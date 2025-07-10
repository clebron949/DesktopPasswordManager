import { app, BrowserWindow, Menu, dialog, ipcMain, Data } from "electron";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";
import { DatabaseRepository, Password } from "../services/SQLiteService";

export async function handleFileImport(db: DatabaseRepository) {
  const result = await dialog.showOpenDialog({
    title: "Import Data File",
    filters: [
      { name: "CSV Files", extensions: ["csv"] },
      { name: "JSON Files", extensions: ["json"] },
    ],
    properties: ["openFile"],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return;
  }

  const filePath = result.filePaths[0];
  const ext = path.extname(filePath).toLowerCase();

  // Get the main window to send messages and Notify the UI
  const mainWindow = BrowserWindow.getAllWindows()[0];
  let importedCount = 0;

  switch (ext) {
    case ".csv":
      importedCount = await importCSVFile(db, filePath);
      break;
    case ".json":
      importedCount = await importJSONFile(db, filePath);
      break;
    default:
      dialog.showErrorBox(
        "Unsupported File Type",
        "Please select a valid CSV or JSON file.",
      );
      return;
  }

  // Notify UI that import is complete
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("import-completed", {
      success: true,
      fileName: path.basename(filePath),
      importedCount,
      message: `Successfully imported ${importedCount} records`,
    });
  }
}

async function importCSVFile(
  db: DatabaseRepository,
  path: string,
): Promise<number> {
  let importCount = 0;
  try {
    const fileContent = fs.readFileSync(path, "utf-8");
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Password[];

    for (const record of records) {
      const password: Omit<Password, "Id" | "OnCreated" | "OnModified"> = {
        Name: record.Name,
        Username: record.Username,
        Password: record.Password,
        Url: record.Url,
        IsPinned: record.IsPinned || false, // Default to false if not provided
      };
      importCount = importCount + (await InsertToDatabase(db, password));
    }
  } catch (error) {
    console.error("Error importing CSV:", error);
    dialog.showErrorBox("Import Error", `Failed to import CSV file: ${error}`);
  }
  return importCount;
}

async function importJSONFile(
  db: DatabaseRepository,
  path: string,
): Promise<number> {
  let importCount = 0;
  try {
    const fileContent = fs.readFileSync(path, "utf-8");
    const jsonData = JSON.parse(fileContent) as Password[];

    for (const item of jsonData) {
      console.log("Importing item:", item);
      const password: Omit<Password, "Id" | "OnCreated" | "OnModified"> = {
        Name: item.Name,
        Username: item.Username,
        Password: item.Password,
        Url: item.Url,
        IsPinned: item.IsPinned || false, // Default to false if not provided
      };
      importCount = importCount + (await InsertToDatabase(db, password));
    }
  } catch (error) {
    console.error("Error importing JSON:", error);
    dialog.showErrorBox("Import Error", `Failed to import JSON file: ${error}`);
  }
  return importCount;
}

async function InsertToDatabase(
  db: DatabaseRepository,
  password: Omit<Password, "Id" | "OnCreated" | "OnModified">,
): Promise<number> {
  try {
    if (await recordExist(db, password)) {
      console.log(
        `Skipping duplicate record: ${password.Name} - ${password.Username}`,
      );
      return -1; // Return -1 for skipped records
    }

    console.log("Importing record:", password);
    await db.insertPassword(password);
    return 1;
  } catch (error) {
    console.error("Error inserting to database:", error);
    return -1; // Return -1 for failed inserts
  }
}

async function recordExist(
  db: DatabaseRepository,
  password: Omit<Password, "Id" | "OnCreated" | "OnModified">,
): Promise<boolean> {
  try {
    const passwords = await db.getPasswords();
    const existingRecord = passwords.find(
      (p) => p.Name === password.Name && p.Username === password.Username,
    );
    return existingRecord !== undefined;
  } catch (error) {
    console.error("Error checking record existence:", error);
    throw new Error(`Failed to check record existence: ${error}`);
  }
}

export async function handleFileExport(db: DatabaseRepository) {
  const result = await dialog.showSaveDialog({
    title: "Export Data File",
    filters: [
      { name: "CSV Files", extensions: ["csv"] },
      { name: "JSON Files", extensions: ["json"] },
    ],
  });

  if (result.canceled || !result.filePath) {
    return;
  }

  const filePath = result.filePath;
  const ext = path.extname(filePath).toLowerCase();

  try {
    switch (ext) {
      case ".csv":
        await exportToCSV(db, filePath);
        break;
      case ".json":
        await exportToJSON(db, filePath);
        break;
      default:
        dialog.showErrorBox(
          "Unsupported File Type",
          "Please select a valid CSV or JSON file.",
        );
    }
  } catch (error) {
    console.error("Error exporting data:", error);
    dialog.showErrorBox("Export Error", `Failed to export data: ${error}`);
  }
}

async function exportToCSV(db: DatabaseRepository, filePath: string) {
  const passwords = await db.getPasswords();
  const csvHeader = "Name,Username,Password,Url\n";
  const csvData = passwords
    .map((p) => `${p.Name},${p.Username},${p.Password},${p.Url}`)
    .join("\n");

  const csvContent = csvHeader + csvData;
  fs.writeFileSync(filePath, csvContent, "utf-8");
  dialog.showMessageBox({
    title: "Notification",
    type: "info",
    message: "Export Successful",
    detail: `${filePath}`,
  });
}

async function exportToJSON(db: DatabaseRepository, filePath: string) {
  const passwords = await db.getPasswords();
  const filteredPasswords = passwords.map(
    ({ Id, OnCreated, OnModified, ...rest }) => rest,
  );
  fs.writeFileSync(
    filePath,
    JSON.stringify(filteredPasswords, null, 2),
    "utf-8",
  );
  dialog.showMessageBox({
    title: "Notification",
    type: "info",
    message: "Export Successful",
    detail: `${filePath}`,
  });
}
