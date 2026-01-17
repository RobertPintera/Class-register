import type { Test } from "@/models/Test";
import { v4 as uuidv4 } from "uuid";
import { getAllTestsDb, addTestDb, updateTestDb, deleteTestAndGradesDb } from "@/database/testsDb";

class TestService {
  async getAllTests(): Promise<Test[]> {
    return getAllTestsDb();
  }

  async addTest(test: Omit<Test, "id">): Promise<Test> {
    const newTest: Test = { id: uuidv4(), ...test };
    await addTestDb(newTest);
    return newTest;
  }

  async updateTest(testId: string, updatedFields: Partial<Omit<Test, "id">>) {
    await updateTestDb(testId, updatedFields);
  }

  async deleteTest(testId: string) {
    await deleteTestAndGradesDb(testId);
  }
}

export const testService = new TestService();
