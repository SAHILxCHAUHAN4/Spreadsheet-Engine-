
import React, { useState, useCallback } from 'react';
import { GridState, DependencyGraph } from '../types';
import { extractReferences, evaluateFormula } from '../utils/formulaParser';
import { hasCycle, getUpdateOrder } from '../utils/dependencyGraph';
import Cell from './Cell';

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const ROWS = Array.from({ length: 15 }, (_, i) => i + 1);

const Spreadsheet: React.FC = () => {
  const [grid, setGrid] = useState<GridState>(() => {
    const initial: GridState = {};
    COLS.forEach(col => {
      ROWS.forEach(row => {
        const id = `${col}${row}`;
        initial[id] = { id, raw: '', computed: '' };
      });
    });
    return initial;
  });

  const [graph, setGraph] = useState<DependencyGraph>({
    dependencies: {},
    dependents: {}
  });

  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const updateCell = useCallback((id: string, rawValue: string) => {
    setGrid(prevGrid => {
      const newGrid = { ...prevGrid };
      const newGraph = { 
        dependencies: { ...graph.dependencies }, 
        dependents: { ...graph.dependents } 
      };

      const newRefs = extractReferences(rawValue);

      if (hasCycle(id, newRefs, newGraph)) {
        newGrid[id] = { ...newGrid[id], raw: rawValue, computed: '#CIRCULAR' };
        setGrid(newGrid);
        return newGrid;
      }

      const oldRefs = newGraph.dependencies[id] || new Set();
      oldRefs.forEach(ref => {
        newGraph.dependents[ref]?.delete(id);
      });

      newGraph.dependencies[id] = new Set(newRefs);
      newRefs.forEach(ref => {
        if (!newGraph.dependents[ref]) newGraph.dependents[ref] = new Set();
        newGraph.dependents[ref].add(id);
      });
      setGraph(newGraph);

      const computedValue = evaluateFormula(rawValue, newGrid);
      newGrid[id] = { ...newGrid[id], raw: rawValue, computed: computedValue };

      const affected = getUpdateOrder(id, newGraph);
      affected.forEach(cellId => {
        const cell = newGrid[cellId];
        newGrid[cellId] = { 
          ...cell, 
          computed: evaluateFormula(cell.raw, newGrid) 
        };
      });

      return newGrid;
    });
  }, [graph]);

  const activeRawValue = selectedCell ? grid[selectedCell].raw : '';
  const isFormula = activeRawValue.startsWith('=');

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-slate-200">
      {/* Dynamic Formula Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex items-center px-6 py-4 space-x-4 bg-slate-50/30">
          <div className="flex flex-col items-center min-w-[50px]">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cell</span>
            <div className="bg-brand-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg shadow-brand-500/30 min-w-[48px] text-center">
              {selectedCell || '--'}
            </div>
          </div>
          <div className="h-10 w-px bg-slate-200"></div>
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-3 pointer-events-none">
              <span className={`text-lg font-serif italic transition-colors duration-300 ${isFormula ? 'text-brand-500' : 'text-slate-300'}`}>fx</span>
              <div className="h-5 w-px bg-slate-200"></div>
            </div>
            <input
              className={`w-full pl-14 pr-4 py-3 bg-white border rounded-xl text-sm font-semibold transition-all outline-none shadow-sm
                ${isFormula ? 'border-brand-500 ring-4 ring-brand-500/10 text-brand-700' : 'border-slate-200 text-slate-700 focus:border-brand-400'}
              `}
              placeholder="Start with = for advanced logic..."
              value={activeRawValue}
              onChange={(e) => selectedCell && updateCell(selectedCell, e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-[#f8fafc]">
        <div className="inline-block min-w-full">
          {/* Catchy Header Row */}
          <div className="flex sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200">
            <div className="w-14 h-[36px] flex items-center justify-center border-r border-slate-200 shrink-0 bg-slate-50/50">
               <div className="w-4 h-4 text-brand-500">
                 <svg fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
               </div>
            </div>
            {COLS.map(col => (
              <div key={col} className="w-[110px] h-[36px] flex items-center justify-center border-r border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-widest shrink-0 hover:bg-brand-50/50 hover:text-brand-600 transition-all cursor-default">
                {col}
              </div>
            ))}
          </div>

          {/* Table Body */}
          {ROWS.map(row => (
            <div key={row} className="flex group">
              <div className="w-14 h-[36px] sticky left-0 z-20 bg-white/90 backdrop-blur-xl flex items-center justify-center border-r border-slate-200 text-[10px] font-extrabold text-slate-300 shrink-0 group-hover:text-brand-500 group-hover:bg-brand-50/30 transition-all border-b">
                {row}
              </div>
              {COLS.map(col => {
                const id = `${col}${row}`;
                return (
                  <Cell
                    key={id}
                    id={id}
                    data={grid[id]}
                    onUpdate={updateCell}
                    isSelected={selectedCell === id}
                    onSelect={setSelectedCell}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Catchy Status Bar */}
      <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between items-center shadow-inner">
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse"></span>
            <span className="font-bold text-slate-200 uppercase tracking-tighter">Live Engine</span>
          </span>
          <span className="w-px h-3 bg-slate-700"></span>
          <span className="hover:text-white transition-colors cursor-default">Cells: 150 Active</span>
        </div>
        <div className="flex items-center space-x-6">
          <button className="hover:text-brand-500 transition-all font-bold group flex items-center">
            <span className="mr-2">Analytics View</span>
            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
