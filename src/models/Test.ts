export interface Test {
  id: string;
  name: string;
  maxPoints: number;
  weight: number;
  requiredPoints: number | null;
  isMandatory: boolean;
}
