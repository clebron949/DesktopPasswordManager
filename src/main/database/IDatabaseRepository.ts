import { Password } from "../types/password";

export interface IDatabaseRepository {
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
