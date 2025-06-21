import { DatabaseRepository, SQLiteService } from "../services/SQLiteService";

export function createDatabaseRepository(dbType: string, connectionString: string): DatabaseRepository {
    switch (dbType) {
        case "sqlite":
        return SQLiteService.getInstance(connectionString);
        default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
}