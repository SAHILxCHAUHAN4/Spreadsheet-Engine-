
import { DependencyGraph } from '../types';

/**
 * Detects if adding a dependency from 'cellId' to 'references' creates a cycle.
 * Uses Depth First Search (DFS).
 */
export const hasCycle = (
  cellId: string,
  newReferences: string[],
  graph: DependencyGraph
): boolean => {
  const visited = new Set<string>();

  const dfs = (current: string): boolean => {
    if (current === cellId) return true;
    if (visited.has(current)) return false;
    visited.add(current);

    const dependents = graph.dependents[current];
    if (dependents) {
      for (const dep of dependents) {
        if (dfs(dep)) return true;
      }
    }
    return false;
  };

  for (const ref of newReferences) {
    if (dfs(ref)) return true;
  }

  return false;
};

/**
 * Gets the order in which cells should be updated based on their dependencies.
 * Only returns cells that are affected by a change to startCellId.
 */
export const getUpdateOrder = (
  startCellId: string,
  graph: DependencyGraph
): string[] => {
  const result: string[] = [];
  const visited = new Set<string>();

  const visit = (id: string) => {
    if (visited.has(id)) return;
    visited.add(id);

    const deps = graph.dependents[id];
    if (deps) {
      deps.forEach(visit);
    }
    // Only push if it's not the starting cell (the trigger)
    if (id !== startCellId) {
      result.push(id);
    }
  };

  visit(startCellId);
  // We reverse or topo-sort if needed, but for simple reactive spreadsheets, 
  // a basic topological search ensures we visit the tree correctly.
  // Actually, for spreadsheets, a breadth-first or correct topo-order is safer.
  
  // Refined Topo Sort for affected subtree:
  const order: string[] = [];
  const state = new Map<string, 'visiting' | 'visited'>();

  const topo = (u: string) => {
    state.set(u, 'visiting');
    const neighbors = graph.dependents[u];
    if (neighbors) {
      for (const v of neighbors) {
        if (state.get(v) === 'visiting') continue; // Cycle should be handled elsewhere
        if (!state.has(v)) topo(v);
      }
    }
    state.set(u, 'visited');
    order.push(u);
  };

  topo(startCellId);
  return order.reverse().filter(id => id !== startCellId);
};
