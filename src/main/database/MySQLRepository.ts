import mysql from "mysql2/promise";
import { Password } from "../types/password";
import { IDatabaseRepository } from "./IDatabaseRepository";

export class MySQLRepository implements IDatabaseRepository {
  private static instance: MySQLRepository;
  private connectionString: string;
  private db: mysql.Connection | null = null;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  static getInstance(connectionString: string): MySQLRepository {
    if (!MySQLRepository.instance) {
      MySQLRepository.instance = new MySQLRepository(connectionString);
    }
    return MySQLRepository.instance;
  }

  private async getConnection(): Promise<mysql.Connection> {
    if (!this.db) {
      this.db = await mysql.createConnection(this.connectionString);
    }
    return this.db;
  }

  async getPasswords(): Promise<Password[]> {
    const connection = await this.getConnection();
    const sql = `SELECT * FROM Passwords`;
    const [rows] = await connection.execute(sql);
    return rows as Password[];
  }

  async getPasswordById(id: number): Promise<Password | undefined> {
    const connection = await this.getConnection();
    const sql = `SELECT * FROM Passwords WHERE Id = ?`;
    const [rows] = await connection.execute(sql, [id]);
    const results = rows as Password[];
    return results.length > 0 ? results[0] : undefined;
  }

  async insertPassword(
    password: Omit<Password, "Id" | "OnCreated" | "OnModified">
  ): Promise<number> {
    const connection = await this.getConnection();
    const sql = `
      INSERT INTO Passwords (Name, Username, Password, Url)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await connection.execute(sql, [
      password.Name,
      password.Username,
      password.Password,
      password.Url,
    ]);
    return (result as mysql.ResultSetHeader).insertId;
  }

  async updatePassword(
    id: number,
    password: Partial<Omit<Password, "Id" | "OnCreated" | "OnModified">>
  ): Promise<void> {
    const connection = await this.getConnection();
    const fields = Object.keys(password);
    const setClause = fields.map((key) => `${key} = ?`).join(", ");
    const values = fields.map((key) => password[key as keyof typeof password]);

    const sql = `UPDATE Passwords SET ${setClause} WHERE Id = ?`;
    await connection.execute(sql, [...values, id]);
  }

  async deletePassword(id: number): Promise<void> {
    const connection = await this.getConnection();
    const sql = `DELETE FROM Passwords WHERE Id = ?`;
    await connection.execute(sql, [id]);
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.end();
      this.db = null;
    }
  }

  async createDatabase(): Promise<void> {
    const connection = await this.getConnection();
    const sql = `
        CREATE TABLE IF NOT EXISTS Passwords (
        Id INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        Username VARCHAR(255) NOT NULL,
        Password VARCHAR(255) NOT NULL,
        Url VARCHAR(255),
        OnCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
        OnModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await connection.execute(sql);
  }
}
