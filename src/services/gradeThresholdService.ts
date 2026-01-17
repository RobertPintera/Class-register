import type { GradeThreshold } from "@/models/GradeThreshold";
import { initGradeThresholdsDb, getGradeThresholdsDb, addGradeThresholdDb, updateGradeThresholdDb, deleteGradeThresholdDb, replaceGradeThresholdsDb,} from "@/database/gradeThresholdsDb";
import { v4 as uuidv4 } from 'uuid';

class GradeThresholdService {
  async initGradeThresholds(): Promise<void> {
    await initGradeThresholdsDb();
  }

  async getAllGradeThresholds(): Promise<GradeThreshold[]> {
    return getGradeThresholdsDb();
  }

  async addGradeThreshold(threshold: Omit<GradeThreshold, 'id'>): Promise<GradeThreshold> {
    const newGradeThreshold: GradeThreshold = { id: uuidv4(), ...threshold };
    return addGradeThresholdDb(newGradeThreshold);
  }

  async updateGradeThreshold(id: string, updatedFields: Partial<Omit<GradeThreshold, "id">>): Promise<number> {
    return updateGradeThresholdDb(id, updatedFields);
  }

  async deleteGradeThreshold(id: string): Promise<void> {
    return deleteGradeThresholdDb(id);
  }

  async replaceGradeThreshold(newThresholds: GradeThreshold[]): Promise<void> {
    return replaceGradeThresholdsDb(newThresholds);
  }
}

export const gradeThresholdService = new GradeThresholdService();
