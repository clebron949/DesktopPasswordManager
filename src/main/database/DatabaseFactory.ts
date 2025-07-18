import { DatabaseProvider } from "./DatabaseProvider";
import { IDatabaseRepository } from "./IDatabaseRepository";
import { MySQLRepository } from "./MySQLRepository";
import { SQLiteRepository } from "./SQLiteRepository";

export class DatabaseFactory {
  private static dbInstance: IDatabaseRepository;

  static getDatabaseRepository(): IDatabaseRepository {
    return this.dbInstance;
  }

  static createDatabaseRepository(
    dbType: DatabaseProvider,
    connectionString: string
  ): IDatabaseRepository {
    switch (dbType) {
      case DatabaseProvider.SQLite:
        this.dbInstance = SQLiteRepository.getInstance(connectionString);
        break;
      case DatabaseProvider.MySQL:
        this.dbInstance = MySQLRepository.getInstance(connectionString);
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }

    this.dbInstance.createDatabase();
    return this.dbInstance;
  }

  static handleChangeDatabaseRepository(
    dbProvider: DatabaseProvider,
    connectionString: string
  ): IDatabaseRepository {
    if (this.dbInstance) {
      this.dbInstance.close();
    }
    this.dbInstance = this.createDatabaseRepository(
      dbProvider,
      connectionString
    );
    return this.dbInstance;
  }
}
