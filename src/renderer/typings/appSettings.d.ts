import { DatabaseConnection } from "./database";

export interface AppSettings {
  GUI: GUISettings;
  PasswordGenerator: PasswordGeneratorSettings;
  DB: DBSettings;
}

export interface GUISettings {
  theme: "light" | "dark";
  itemsPerPage: number;
  windowWidth?: number;
  windowHeight?: number;
}

export interface PasswordGeneratorSettings {
  passwordLength: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeLowercase: boolean;
  includeUppercase: boolean;
}

export interface DBSettings {
  selectedDBConnectionID?: number;
  dbConnections?: DatabaseConnection[];
}
