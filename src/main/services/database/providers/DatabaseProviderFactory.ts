import { DatabaseProvider } from "./DatabaseProviders";
import { IDatabaseProvider } from "./IDatabaseProvider";
import { MySQLProvider } from "./MySQLProvider";
import { SQLiteProvider } from "./SQLiteProvider";

export class DatabaseFactory {
  private static dbInstance: IDatabaseProvider;

  static getDatabaseProvider(): IDatabaseProvider {
    return this.dbInstance;
  }

  static createDatabaseProvider(
    dbType: DatabaseProvider,
    connectionString: string
  ): IDatabaseProvider {
    if (typeof dbType === "string") {
      if (dbType in DatabaseProvider) {
        dbType = DatabaseProvider[dbType as keyof typeof DatabaseProvider];
      } else {
        throw new Error(`Unsupported database type: ${dbType}`);
      }
    }
    switch (dbType) {
      case DatabaseProvider.SQLite:
        this.dbInstance = SQLiteProvider.getInstance(connectionString);
        break;
      case DatabaseProvider.MySQL:
        this.dbInstance = MySQLProvider.getInstance(connectionString);
        break;
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }

    this.dbInstance.createDatabase();
    return this.dbInstance;
  }

  static onDatabaseProviderChange(
    dbProvider: DatabaseProvider,
    connectionString: string
  ): IDatabaseProvider {
    if (this.dbInstance) {
      this.dbInstance.close();
    }
    this.dbInstance = this.createDatabaseProvider(
      dbProvider,
      connectionString
    );
    return this.dbInstance;
  }
}
