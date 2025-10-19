import { DatabaseConnection } from "./DatabaseConnection";

export interface AppSettings {
  theme: "light" | "dark";
  itemsPerPage: number;
  passwordLength: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeLowercase: boolean;
  includeUppercase: boolean;
  selectedDBConnectionID?: number;
  dbConnections?: DatabaseConnection[];
  windowWidth?: number;
  windowHeight?: number;
}
