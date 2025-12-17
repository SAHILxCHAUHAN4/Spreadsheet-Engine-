
import { GridState } from '../types';

// Matches cell references like A1, B10, J5
export const CELL_REF_REGEX = /[A-J](?:10|[1-9])/g;

/**
 * Extracts all cell IDs referenced in a formula string.
 */
export const extractReferences = (formula: string): string[] => {
  if (!formula.startsWith('=')) return [];
  const matches = formula.toUpperCase().match(CELL_REF_REGEX);
  return matches ? Array.from(new Set(matches)) : [];
};

/**
 * Evaluates a formula string given the current grid state.
 */
export const evaluateFormula = (
  formula: string,
  grid: GridState,
  visited: Set<string> = new Set()
): string => {
  if (!formula.startsWith('=')) return formula;

  const expression = formula.substring(1).toUpperCase();
  
  // 1. Replace cell references with their computed values
  let processedExpr = expression.replace(CELL_REF_REGEX, (match) => {
    const cell = grid[match];
    if (!cell) return '0';
    
    const val = cell.computed;
    if (val === '#CIRCULAR') return 'NaN';
    if (val === '#ERROR') return 'NaN';
    
    // If value is empty or not a number, treat as 0 for math, or return NaN if strictly text
    const num = parseFloat(val);
    return isNaN(num) ? '0' : num.toString();
  });

  // 2. Sanitize: only allow numbers, math operators, parentheses, and spaces
  // This is a safety measure before evaluation.
  const sanitized = processedExpr.replace(/[^0-9+\-*/().\s]/g, '');

  try {
    // 3. Simple evaluation using new Function (safely scoped)
    // Note: We've sanitized the string heavily above.
    // A production app would use a real math parser like mathjs.
    const result = new Function(`return ${sanitized}`)();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      if (isNaN(result)) return '#ERROR';
      return '#DIV/0!';
    }
    
    // Format to avoid long decimals
    return Number.isInteger(result) ? result.toString() : result.toFixed(2).replace(/\.?0+$/, "");
  } catch (err) {
    return '#ERROR';
  }
};
