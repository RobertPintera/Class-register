import type { SimpleFilter } from "./SimpleFilter";

export interface AdvancedFilter {
  operator: string;
  constraints: SimpleFilter[];
}