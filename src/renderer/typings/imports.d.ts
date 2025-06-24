export interface ImportCompletedData {
  success: boolean;
  fileName: string;
  importedCount?: number;
  error?: string;
  message: string;
}
