import type { GradeThreshold } from "@/models/GradeThreshold";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/database/database";
import { addGradeThresholdDb, deleteGradeThresholdDb, replaceGradeThresholdsDb, updateGradeThresholdDb } from "@/database/gradeThresholdsDb";

export const useGradeThresholdsStore = defineStore('gradeThresholds', () => {
  const _gradeThresholds = ref<GradeThreshold[]>([]);
  const gradeThresholds = computed(() => _gradeThresholds.value);
  
  const addGradeThreshold = async(threshold: Omit<GradeThreshold, 'id'>) => {
    const newGradeThreshold: GradeThreshold = { id: uuidv4(), ...threshold };
    await addGradeThresholdDb(newGradeThreshold);
    _gradeThresholds.value.push(newGradeThreshold);
  };

  const updateGradeThreshold = async(id: string, updated: Partial<Omit<GradeThreshold, 'id'>>) => {
    await updateGradeThresholdDb(id, updated);
    const index = _gradeThresholds.value.findIndex(t => t.id === id);
    if (index !== -1) {
      _gradeThresholds.value[index] = { ..._gradeThresholds.value[index], ...updated };
    }
  };

  const deleteGradeThreshold = async(thresholdId: string) => {
    await deleteGradeThresholdDb(thresholdId);
    _gradeThresholds.value = _gradeThresholds.value.filter(t => t.id !== thresholdId);
  };

  const replaceGradeThresholds = async(thresholds: Omit<GradeThreshold, 'id'>[]) => {
    const newGradeThresholds: GradeThreshold[] = thresholds.map(t => ({
      id: uuidv4(),
      ...t
    }));
    await replaceGradeThresholdsDb(newGradeThresholds);
    _gradeThresholds.value = newGradeThresholds;
  };

  const setGradeThresholds = (newGradeThresholds: GradeThreshold[]) => {
    _gradeThresholds.value = newGradeThresholds;
  };

  const getGradeThreshold = (id: string): GradeThreshold | undefined => {
    return _gradeThresholds.value.find(t => t.id === id);
  };

  return {
    gradeThresholds,
    addGradeThreshold, updateGradeThreshold, deleteGradeThreshold, replaceGradeThresholds, getGradeThreshold, setGradeThresholds
  };
});