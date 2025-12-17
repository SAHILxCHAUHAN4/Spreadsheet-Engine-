
import React, { useState, useEffect, useRef } from 'react';
import { CellData } from '../types';

interface CellProps {
  id: string;
  data: CellData;
  onUpdate: (id: string, value: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const Cell: React.FC<CellProps> = ({ id, data, onUpdate, isSelected, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.raw);
  const [flashKey, setFlashKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Trigger a subtle flash animation when computed value changes
  useEffect(() => {
    if (data.computed !== '') {
      setFlashKey(prev => prev + 1);
    }
  }, [data.computed]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(data.raw);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== data.raw) {
      onUpdate(id, editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onUpdate(id, editValue);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(data.raw);
    }
  };

  const isError = data.computed.startsWith('#');
  const isFormula = data.raw.startsWith('=');
  
  // Dynamic Text Styling: Color numbers differently
  const numValue = parseFloat(data.computed);
  const isNegative = !isNaN(numValue) && numValue < 0;
  const isNumber = !isNaN(numValue) && data.computed !== '';

  return (
    <div
      key={`${id}-${flashKey}`}
      className={`
        relative h-[36px] border-r border-b border-slate-100 min-w-[110px] flex items-center px-3 text-[13px] 
        transition-all duration-200 animate-update-flash
        ${isSelected ? 'bg-brand-50/80 ring-2 ring-inset ring-brand-500 z-10' : 'hover:bg-slate-50/80'}
        ${isError ? 'text-brand-accent font-bold' : 'text-slate-700'}
        cursor-cell select-none overflow-hidden whitespace-nowrap
      `}
      onClick={() => onSelect(id)}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="absolute inset-0 w-full h-full px-3 outline-none bg-white z-20 shadow-xl text-[13px] font-medium text-slate-900 border-2 border-brand-500"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div className="flex w-full items-center justify-between pointer-events-none">
          <span className={`truncate ${isFormula && !isSelected ? 'text-brand-600 font-medium' : ''} ${isNegative ? 'text-rose-500' : isNumber ? 'text-indigo-600 font-semibold' : ''}`}>
            {data.computed || data.raw}
          </span>
          {isFormula && !isEditing && (
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 opacity-40 ml-1 shrink-0" title="Formula Cell"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cell;
