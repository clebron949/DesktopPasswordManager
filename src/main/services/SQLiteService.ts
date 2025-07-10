import sqlite3, { Database } from "sqlite3";

export interface Password {
  Id: number;
  Name: string;
  Username: string;
  Password: string;
  Url: string;
  IsPinned: boolean;
  OnCreated: string;
  OnModified: string;
}

export interface DatabaseRepository {
  createDatabase(): Promise<void>;
  getPasswords(): Promise<Password[]>;
  getPasswordById(id: number): Promise<Password | undefined>;
  insertPassword(
    password: Omit<Password, "Id" | "OnCreated" | "OnModified">,
  ): Promise<number>;
  updatePassword(
    id: number,
    password: Partial<Omit<Password, "Id" | "OnCreated" | "OnModified">>,
  ): Promise<void>;
  deletePassword(id: number): Promise<void>;
  close(): Promise<void>;
}

export class SQLiteService implements DatabaseRepository {
  private static instance: SQLiteService;
  private db: Database;

  constructor(connectionString: string) {
    this.db = new sqlite3.Database(connectionString);
  }

  static getInstance(path: string): SQLiteService {
    if (!SQLiteService.instance) {
      SQLiteService.instance = new SQLiteService(path);
    }
    return SQLiteService.instance;
  }

  getPasswords(): Promise<Password[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Passwords`;
      this.db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Password[]);
        }
      });
    });
  }

  getPasswordById(id: number): Promise<Password | undefined> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Passwords WHERE Id = ?`;
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as Password | undefined);
        }
      });
    });
  }

  insertPassword(
    password: Omit<Password, "Id" | "OnCreated" | "OnModified">,
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO Passwords (Name, Username, Password, Url, IsPinned)
        VALUES (?, ?, ?, ?, ?)
      `;
      this.db.run(
        sql,
        [password.Name, password.Username, password.Password, password.Url],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        },
      );
    });
  }

  updatePassword(
    id: number,
    password: Partial<Omit<Password, "Id" | "OnCreated" | "OnModified">>,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(password);
      const setClause = fields.map((key) => `${key} = ?`).join(", ");
      const values = fields.map(
        (key) => password[key as keyof typeof password],
      );

      const sql = `UPDATE Passwords SET ${setClause} WHERE Id = ?`;
      this.db.run(sql, [...values, id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  deletePassword(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM Passwords WHERE Id = ?`;
      this.db.run(sql, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  createDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `
        CREATE TABLE IF NOT EXISTS Passwords (
          Id INTEGER PRIMARY KEY AUTOINCREMENT,
          Name TEXT NOT NULL,
          Username TEXT NOT NULL,
          Password TEXT NOT NULL,
          Url TEXT,
          IsPinned INTEGER DEFAULT 0,
          OnCreated TEXT DEFAULT (datetime('now')),
          OnModified TEXT DEFAULT (datetime('now'))
        );

        CREATE TRIGGER IF NOT EXISTS update_passwords_timestamp 
          AFTER UPDATE ON Passwords
          BEGIN
            UPDATE Passwords SET OnModified = datetime('now')
            WHERE Id = NEW.Id;
          END;
      `;

      this.db.exec(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

