import type { GradeThreshold } from "./GradeThreshold";

export interface GradingSystem{
  name: string;
  gradethresholds: Omit<GradeThreshold, 'id'>[];
}