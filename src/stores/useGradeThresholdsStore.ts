import type { GradeThreshold } from "@/models/GradeThreshold";
import { defineStore } from "pinia";
import { computed, onScopeDispose, ref } from "vue";
import { v4 as uuidv4 } from 'uuid';
import { gradeThresholdService } from "@/services/gradeThresholdService";

export const useGradeThresholdsStore = defineStore('gradeThresholds', () => {
  const _gradeThresholds = ref<GradeThreshold[]>([]);
  const gradeThresholds = computed(() => _gradeThresholds.value);
  
  const subscription = gradeThresholdService
    .getAllGradeThresholds()
    .subscribe((data) => {
      _gradeThresholds.value = data;
    });

  onScopeDispose(() => {
    subscription.unsubscribe();
  });

  const addGradeThreshold = async(threshold: Omit<GradeThreshold, 'id'>) => {
    await gradeThresholdService.addGradeThreshold(threshold);
  };

  const updateGradeThreshold = async(id: string, updated: Partial<Omit<GradeThreshold, 'id'>>) => {
    await gradeThresholdService.updateGradeThreshold(id, updated);
  };

  const deleteGradeThreshold = async(thresholdId: string) => {
    await gradeThresholdService.deleteGradeThreshold(thresholdId);
  };

  const replaceGradeThresholds = async(thresholds: Omit<GradeThreshold, 'id'>[]) => {
    const newGradeThresholds: GradeThreshold[] = thresholds.map(t => ({
      id: uuidv4(),
      ...t
    }));
    await gradeThresholdService.replaceGradeThreshold(newGradeThresholds);
  };

  const getGradeThreshold = (id: string): GradeThreshold | undefined => {
    return _gradeThresholds.value.find(t => t.id === id);
  };

  return {
    gradeThresholds,
    addGradeThreshold, updateGradeThreshold, deleteGradeThreshold, replaceGradeThresholds, getGradeThreshold,
  };
});