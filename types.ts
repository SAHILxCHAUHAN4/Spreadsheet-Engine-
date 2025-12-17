export interface CellData {
  id: string;
  raw: string;
  computed: string;
}

export type GridState = Record<string, CellData>;

export interface DependencyGraph {
  // map cell ID to set of cell IDs it depends ON (e.g., B1 depends on [A1, C1])
  dependencies: Record<string, Set<string>>;
  // map cell ID to set of cell IDs that depend ON IT (e.g., A1 is used by [B1, D1])
  dependents: Record<string, Set<string>>;
}
