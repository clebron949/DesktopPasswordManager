import { AppSettings, DBSettings, GUISettings, PasswordGeneratorSettings } from "./appSettings";
import { ImportCompletedData } from "./imports";
import { Password } from "./password";

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface API {
  settings: {
    GUI:{
      get(): Promise<GUISettings>;
      save(settings: Partial<GUISettings>): Promise<void>;
    },
    DB: {
      get(): Promise<DBSettings>;
      save(settings: Partial<DBSettings>): Promise<void>;
    },
    PasswordGenerator:{
      get(): Promise<PasswordGeneratorSettings>;
      save(settings: Partial<PasswordGeneratorSettings>): Promise<void>;
    },
    openFolderDialog(): Promise<string | undefined>;
    joinPaths(...parts: string[]): Promise<string | undefined>;
  };
  db:{
    getPasswords(): Promise<Password[]>;
    getPasswordById(id: number): Promise<Password | undefined>;
    insertPassword(
      password: Omit<Password, "Id" | "OnCreated" | "OnModified">
    ): Promise<number>;
    updatePassword(
      id: number,
      password: Partial<Omit<Password, "Id" | "OnCreated" | "OnModified">>
    ): Promise<void>;
    deletePassword(id: number): Promise<void>;
  },
  app: {
    getVersion(): Promise<string>;
  };
   import: {
    onCompleted: (callback: (data: ImportCompletedData) => void) => void;
    removeAllListeners: () => void;
  };
   navigation: {
    onNavigateToDbOptions: (callback: () => void) => void;
    removeNavigationListeners: () => void;
  };
}

declare global {
  interface Window {
    api: API,
  }
}
