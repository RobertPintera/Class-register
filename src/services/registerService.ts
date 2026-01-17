import { createDemoDataDb, exportToJsonDb, importFromJsonDb } from "@/database/registerDb";

export class RegisterService {
  async createDemoData() {
    await createDemoDataDb();
  }

  async exportToJson(): Promise<Blob> {
    return exportToJsonDb();
  }

  async importFromJson(json: string) {
    await importFromJsonDb(json);
  }
}

export const registerService = new RegisterService();
