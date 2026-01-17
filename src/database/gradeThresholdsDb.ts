import type { GradeThreshold } from "@/models/GradeThreshold";
import { db } from "./database";
import { v4 as uuidv4 } from "uuid";

export async function initGradeThresholdsDb(): Promise<void> {
  const count = await db.thresholds.count();
  if (count === 0) {
    const defaultThresholds: GradeThreshold[] = [
      { id: uuidv4(), name: "5", minPercentage: 90 },
      { id: uuidv4(), name: "4.5", minPercentage: 80 },
      { id: uuidv4(), name: "4", minPercentage: 70 },
      { id: uuidv4(), name: "3.5", minPercentage: 60 },
      { id: uuidv4(), name: "3", minPercentage: 50 },
      { id: uuidv4(), name: "2", minPercentage: 0 },
    ];
    await db.thresholds.bulkAdd(defaultThresholds);
  }
}

export async function getGradeThresholdsDb(): Promise<GradeThreshold[]> {
  return db.thresholds.toArray();
}

export async function addGradeThresholdDb(threshold: GradeThreshold): Promise<GradeThreshold> {
  return db.thresholds.add(threshold);
}

export async function updateGradeThresholdDb(
  id: string,
  updatedFields: Partial<Omit<GradeThreshold, "id">>
): Promise<number> {
  return db.thresholds.update(id, updatedFields);
}

export async function deleteGradeThresholdDb(id: string): Promise<void> {
  return db.thresholds.delete(id);
}

export async function replaceGradeThresholdsDb(newThresholds: GradeThreshold[]): Promise<void> {
  await db.transaction("rw", db.thresholds, async () => {
    await db.thresholds.clear();
    await db.thresholds.bulkAdd(newThresholds);
  });
}