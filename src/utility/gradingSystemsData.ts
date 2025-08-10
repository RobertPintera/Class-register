import type { GradingSystem } from "@/models/GradingSystem";

/**
 * Returns a list of grading systems with their names and minimum percentage thresholds.
 * These systems can vary between different countries or institutions and may not reflect
 * the exact official grading standards.
 *
 * Note: The data is approximated and may not fully correspond to real-world grading scales.
 * @returns {GradingSystem[]} An object containing the gradingSystems array.
 */
export function useGradingSystems(): GradingSystem[] {
  const gradingSystems = [
    { name: 'Polish University', gradethresholds: [
      { name: '5.0', minPercentage: 91 },
      { name: '4.5', minPercentage: 81 },
      { name: '4.0', minPercentage: 71 },
      { name: '3.5', minPercentage: 61 },
      { name: '3.0', minPercentage: 51 },
      { name: '2.0', minPercentage: 0 },
    ] },
    { name: 'Polish', gradethresholds: [
      { name: '6', minPercentage: 98 },
      { name: '5', minPercentage: 90 },
      { name: '4', minPercentage: 75 },
      { name: '3', minPercentage: 50 },
      { name: '2', minPercentage: 30 },
      { name: '1', minPercentage: 0 },
    ] },
    { name: 'Japanese University', gradethresholds: [
      { name: '優', minPercentage: 80 },
      { name: '良', minPercentage: 70 },
      { name: '可', minPercentage: 60 },
      { name: '認', minPercentage: 50 },
      { name: '不可', minPercentage: 0 }
    ] },
    { name: 'Japanese', gradethresholds: [
      { name: '秀', minPercentage: 90 },
      { name: '優', minPercentage: 80 },
      { name: '良', minPercentage: 70 },
      { name: '可', minPercentage: 60 },
      { name: '認', minPercentage: 50 },
      { name: '不可', minPercentage: 0 }
    ] },
    { name: 'UK GCSE/A-Level', gradethresholds: [
      { name: 'A*', minPercentage: 90 },
      { name: 'A', minPercentage: 80 },
      { name: 'B', minPercentage: 70 },
      { name: 'C', minPercentage: 60 },
      { name: 'D', minPercentage: 50 },
      { name: 'E', minPercentage: 40 },
      { name: 'F', minPercentage: 30 },
      { name: 'G', minPercentage: 20 },
      { name: 'U', minPercentage: 0 },
    ] },
  ];
  return gradingSystems;
}