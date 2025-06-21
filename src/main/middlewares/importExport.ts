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

  switch (ext) {
    case ".csv":
      await importCSVFile(db, filePath);
      break;
    case ".json":
      await importJSONFile(db, filePath);
      break;
    default:
      dialog.showErrorBox(
        "Unsupported File Type",
        "Please select a valid CSV or JSON file."
      );
  }
}

async function importCSVFile(db: DatabaseRepository, path: string) {
  try {
    const fileContent = fs.readFileSync(path, "utf-8");
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Password[];

    for (const record of records) {
      console.log("Importing record:", record);
      const password: Omit<Password, "Id" | "OnCreated" | "OnModified"> = {
        Name: record.Name,
        Username: record.Username,
        Password: record.Password,
        Url: record.Url,
      };
      await InsertToDatabase(db, password);
    }
  } catch (error) {
    console.error("Error importing CSV:", error);
    dialog.showErrorBox("Import Error", `Failed to import CSV file: ${error}`);
  }
}

async function importJSONFile(db: DatabaseRepository, path: string) {
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
      };
      await InsertToDatabase(db, password);
    }
  } catch (error) {
    console.error("Error importing JSON:", error);
    dialog.showErrorBox("Import Error", `Failed to import JSON file: ${error}`);
  }
}

async function InsertToDatabase(
  db: DatabaseRepository,
  password: Omit<Password, "Id" | "OnCreated" | "OnModified">
): Promise<number> {
  try {
    const id = await db.insertPassword(password);
    return id;
  } catch (error) {
    console.error("Error inserting to database:", error);
    throw new Error(`Failed to insert password: ${error}`);
  }
}

// Export handlers (bonus)
// async function handleExportCSV() {
//   if (mainWindow) {
//     mainWindow.webContents.send("export-request", { type: "csv" });
//   }
// }

// async function handleExportJSON() {
//   if (mainWindow) {
//     mainWindow.webContents.send("export-request", { type: "json" });
//   }
// }
