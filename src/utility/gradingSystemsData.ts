import type { GradingSystem } from "@/models/GradingSystem";

/**
 * Returns a list of grading systems with their grades and minimum percentage thresholds.
 * These systems can vary between different countries or institutions and may not reflect
 * the exact official grading standards.
 *
 * Note: The data is approximated and may not fully correspond to real-world grading scales.
 * @returns {GradingSystem[]} An object containing the gradingSystems array.
 */
export function useGradingSystems(): GradingSystem[] {
  const gradingSystems = [
    { name: 'Polish University', gradethresholds: [
      { grade: '5.0', minPercentage: 91 },
      { grade: '4.5', minPercentage: 81 },
      { grade: '4.0', minPercentage: 71 },
      { grade: '3.5', minPercentage: 61 },
      { grade: '3.0', minPercentage: 51 },
      { grade: '2.0', minPercentage: 0 },
    ] },
    { name: 'Polish', gradethresholds: [
      { grade: '6', minPercentage: 98 },
      { grade: '5', minPercentage: 90 },
      { grade: '4', minPercentage: 75 },
      { grade: '3', minPercentage: 50 },
      { grade: '2', minPercentage: 30 },
      { grade: '1', minPercentage: 0 },
    ] },
    { name: 'Japanese University', gradethresholds: [
      { grade: '優', minPercentage: 80 },
      { grade: '良', minPercentage: 70 },
      { grade: '可', minPercentage: 60 },
      { grade: '認', minPercentage: 50 },
      { grade: '不可', minPercentage: 0 }
    ] },
    { name: 'Japanese', gradethresholds: [
      { grade: '秀', minPercentage: 90 },
      { grade: '優', minPercentage: 80 },
      { grade: '良', minPercentage: 70 },
      { grade: '可', minPercentage: 60 },
      { grade: '認', minPercentage: 50 },
      { grade: '不可', minPercentage: 0 }
    ] },
    { name: 'UK GCSE/A-Level', gradethresholds: [
      { grade: 'A*', minPercentage: 90 },
      { grade: 'A', minPercentage: 80 },
      { grade: 'B', minPercentage: 70 },
      { grade: 'C', minPercentage: 60 },
      { grade: 'D', minPercentage: 50 },
      { grade: 'E', minPercentage: 40 },
      { grade: 'F', minPercentage: 30 },
      { grade: 'G', minPercentage: 20 },
      { grade: 'U', minPercentage: 0 },
    ] },
  ];
  return gradingSystems;
}