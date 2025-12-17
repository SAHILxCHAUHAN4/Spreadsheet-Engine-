
import React, { useState, useCallback } from 'react';
import Spreadsheet from './components/Spreadsheet';

const App: React.FC = () => {
  const [sheetName, setSheetName] = useState('Growth Strategy Q3');
  const [isJumping, setIsJumping] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  const colors = [
    'from-brand-500 to-brand-700 shadow-brand-500/30',
    'from-brand-accent to-pink-600 shadow-brand-accent/30',
    'from-brand-gold to-orange-500 shadow-orange-500/30',
    'from-emerald-500 to-teal-700 shadow-emerald-500/30'
  ];

  const textColors = [
    'text-slate-900',
    'text-brand-accent',
    'text-brand-gold',
    'text-emerald-600'
  ];

  const toggleHeading = useCallback(() => {
    setIsJumping(true);
    setColorIndex((prev) => (prev + 1) % colors.length);
    // Reset animation state after it finishes
    setTimeout(() => setIsJumping(false), 500);
  }, [colors.length]);

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans">
      {/* Vibrant Top Navbar */}
      <nav className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0 z-50 shadow-md">
        <div className="flex items-center space-x-10">
          <div 
            className="flex items-center space-x-4 group cursor-pointer select-none"
            onClick={toggleHeading}
          >
            <div className={`
              ${colors[colorIndex]} 
              p-2.5 rounded-2xl shadow-xl transition-all duration-500 bg-gradient-to-br
              ${isJumping ? 'animate-jump' : 'hover:scale-110'}
            `}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div>
              <h1 className={`
                text-lg font-extrabold transition-all duration-500 leading-none flex items-center
                ${textColors[colorIndex]}
                ${isJumping ? 'scale-110 translate-x-1' : ''}
              `}>
                Spreadsheet Engine 
                <span className={`
                  ml-2 px-2 py-0.5 rounded text-[10px] text-white font-black tracking-widest uppercase shadow-sm transition-colors duration-500
                  ${colorIndex === 0 ? 'bg-indigo-600' : colorIndex === 1 ? 'bg-brand-accent' : colorIndex === 2 ? 'bg-brand-gold' : 'bg-emerald-600'}
                `}>
                  DTU
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">Reactive Architecture</p>
            </div>
          </div>

          <div className="hidden xl:flex items-center space-x-2 text-[13px] font-bold">
            {['Dashboard', 'Insights', 'Forecast', 'Templates'].map(item => (
              <button key={item} className={`px-4 py-2 rounded-xl transition-all ${item === 'Insights' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
             <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
             <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">Syncing Cloud</span>
          </div>
          <button className="flex items-center space-x-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-[13px] font-black shadow-2xl shadow-brand-500/40 transition-all hover:-translate-y-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            <span>Deploy</span>
          </button>
        </div>
      </nav>

      {/* Main UI Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Designer Sidebar */}
        <aside className="w-20 bg-slate-900 flex flex-col items-center py-8 space-y-8 shrink-0 shadow-2xl z-40">
          {[
             'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
             'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z',
             'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
          ].map((path, idx) => (
            <button key={idx} className={`p-3.5 rounded-2xl transition-all group ${idx === 0 ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path} /></svg>
            </button>
          ))}
          <div className="flex-1"></div>
          <div className="p-1 border border-slate-700 rounded-2xl">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${colors[colorIndex]} flex items-center justify-center shadow-lg transition-all duration-500`}>
               <span className="text-white text-xs font-black">JS</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col p-8 space-y-6 overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
             <div className="flex flex-col">
               <div className="flex items-center group">
                 <input 
                   className="text-2xl font-black text-slate-800 tracking-tight bg-transparent border-none outline-none focus:ring-2 focus:ring-brand-500/20 rounded-lg px-2 -ml-2 transition-all cursor-edit"
                   value={sheetName}
                   onChange={(e) => setSheetName(e.target.value)}
                 />
                 <svg className="w-4 h-4 text-slate-300 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
               </div>
               <div className="flex items-center space-x-3 mt-1">
                 <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Modified 2m ago</span>
                 <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                 <span className="text-[11px] text-brand-600 font-bold uppercase tracking-widest">Collaborative Mode</span>
               </div>
             </div>
             
             <div className="flex items-center space-x-3">
                <div className="flex -space-x-3 mr-4">
                   {[1,2,3,4].map(i => (
                     <div key={i} className={`w-9 h-9 rounded-2xl border-4 border-slate-50 flex items-center justify-center text-[10px] font-black text-white shadow-md hover:-translate-y-1 transition-transform cursor-pointer
                       ${i === 1 ? 'bg-brand-500' : i === 2 ? 'bg-brand-accent' : i === 3 ? 'bg-indigo-500' : 'bg-slate-800'}`}>
                       {i === 1 ? 'AD' : i === 2 ? 'BK' : i === 3 ? 'CL' : '+'}
                     </div>
                   ))}
                </div>
                <button className="bg-white border border-slate-200 p-3 rounded-2xl text-slate-600 hover:bg-slate-50 shadow-sm transition-all hover:shadow-lg">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                </button>
             </div>
          </div>
          
          {/* The High-End Spreadsheet Container */}
          <div className="flex-1 overflow-hidden bg-slate-200/20 p-1 rounded-3xl shadow-inner border border-white/40">
            <Spreadsheet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
