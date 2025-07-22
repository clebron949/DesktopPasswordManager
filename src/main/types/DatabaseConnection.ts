import { DatabaseProvider } from "../database/DatabaseProvider";

export interface DatabaseConnection {
  id: number;
  name: string;
  dbType: string;
  connectionString: string;
}
