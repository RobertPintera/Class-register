export interface Test {
  id: string;
  name: string;
  maxScore: number;
  weight: number;
  required: boolean;
  requiredScore: number | null;
}
