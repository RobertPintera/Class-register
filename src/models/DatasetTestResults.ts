import type { ChartDataset } from "chart.js";

export interface DatasetTestResults extends ChartDataset<'bar', number[]> {
  points: number[];
  maxPoints: number[];
}