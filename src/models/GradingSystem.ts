import type { GradeThreshold } from "./GradeThreshold";

export interface GradingSystem{
  name: string;
  grades: Omit<GradeThreshold, 'id'>[];
}