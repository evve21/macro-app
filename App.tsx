
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BASES, FRUIT_PACKS, PROTEINS, FRUITS_MASTER, ADD_ONS, PRESET_EXTRA } from './constants';
import { SmoothieState, SmoothieSnap } from './types';
import { calculateNutrition, formatValue } from './services/nutritionService';
import { SmoothieCup } from './components/SmoothieCup';

/**
 * Main App Component: Smokey's Protein Smoothies
 */
const App: React.FC = () => {
  // State: Theme management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  // State: Main Builder
  const [state, setState] = useState<SmoothieState>(() => {
    const saved = localStorage.getItem('smokeys_pro_v5_updated');
    if (saved) return JSON.parse(saved);
    return { 
      base: null, 
      fruitPackId: null, 
      protein: null, 
      selectedAddOns: []
    };
  });

  // State: Comparison logic
  const [smoothie1, setSmoothie1] = useState<SmoothieSnap | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  // UI State
  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const prevKcalRef = useRef(0);

  // Effect: Theme sync
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Effect: Persist builder state
  useEffect(() => {
    localStorage.setItem('smokeys_pro_v5_updated', JSON.stringify(state));
  }, [state]);

  // Memo: Derived data
  const currentPack = useMemo(() => FRUIT_PACKS.find(p => p.id === state.fruitPackId), [state.fruitPackId]);
  const isDoubleProtein = currentPack?.proteinMultiplier === 2;
  const nutrition = useMemo(() => calculateNutrition(state), [state]);
  
  // Effect: Animation trigger for kcal counter
  useEffect(() => {
    if (Math.round(nutrition.kcal) !== Math.round(prevKcalRef.current)) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      prevKcalRef.current = nutrition.kcal;
      return () => clearTimeout(timer);
    }
  }, [nutrition.kcal]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /**
   * REFRESH ALL: Resets the entire builder
   */
  const refreshAll = () => {
    setState({ base: null, fruitPackId: null, protein: null, selectedAddOns: [] }); 
    showToast("Smoothie reset"); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    setIsModalOpen(false); 
  };

  /**
   * START COMPARE: Saves current smoothie to Smoothie 1 and resets builder
   */
  const startCompare = () => {
    setSmoothie1({
      baseId: state.base,
      fruitPackId: state.fruitPackId,
      proteinId: state.protein,
      selectedAddOns: [...state.selectedAddOns],
      nutrition: { ...nutrition }
    }); 
    setCompareMode(true); 
    setState({ base: null, fruitPackId: null, protein: null, selectedAddOns: [] }); 
    showToast("Smoothie 1 Locked. Build Smoothie 2!"); 
    setIsModalOpen(false); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  /**
   * CLEAR COMPARE: Exits dual mode
   */
  const clearCompare = () => {
    setCompareMode(false);
    setSmoothie1(null);
    showToast("Comparison cleared");
  };

  const selectPack = (packId: string) => {
    setState(prev => ({
      ...prev,
      fruitPackId: prev.fruitPackId === packId ? null : packId
    }));
  };

  const toggleAddOn = (id: string) => {
    setState(prev => {
      const current = prev.selectedAddOns || [];
      if (current.includes(id)) {
        return { ...prev, selectedAddOns: current.filter(item => item !== id) };
      } else {
        return { ...prev, selectedAddOns: [...current, id] };
      }
    });
  };

  /**
   * RESET ADD-ONS: Clears only Step 4 selections
   */
  const resetAddOns = () => {
    setState(prev => ({ ...prev, selectedAddOns: [] }));
    showToast("Add-ons cleared");
  };

  /**
   * NUTRITION CALC FOR ARCHIVE
   */
  const calculatePackNutrition = (packId: string) => {
    const pack = FRUIT_PACKS.find(p => p.id === packId);
    let pTotal = 0, cTotal = 0, fTotal = 0, kTotal = 0;
    if (pack) {
      pack.items.forEach(item => {
        const fruit = FRUITS_MASTER.find(f => f.id === item.fruitId);
        if (fruit) {
          const factor = item.weight / 100;
          pTotal += fruit.protein * factor;
          cTotal += fruit.carbs * factor;
          fTotal += fruit.fat * factor;
          kTotal += fruit.kcal * factor;
        }
      });
      const extras = PRESET_EXTRA[packId] || [];
      extras.forEach(ex => {
        pTotal += ex.p; cTotal += ex.c; fTotal += ex.f; kTotal += ex.kcal;
      });
    }
    return { protein: pTotal, carbs: cTotal, fat: fTotal, kcal: kTotal };
  };

  /**
   * Summary Card used for Modal and Single views
   */
  const SummaryCard = ({ nut, stateToUse, title, isSecondary = false }: { nut: any, stateToUse: SmoothieState, title: string, isSecondary?: boolean }) => {
    const baseName = BASES.find(b => b.id === stateToUse.base)?.name || 'None Selected';
    const packName = FRUIT_PACKS.find(p => p.id === stateToUse.fruitPackId)?.name || 'None Selected';
    const proteinName = PROTEINS.find(p => p.id === stateToUse.protein)?.name || 'None Selected';
    const addOnNames = stateToUse.selectedAddOns.map(id => ADD_ONS.find(a => a.id === id)?.name).filter(Boolean);

    return (
      <div className={`flex flex-col flex-1 p-6 rounded-[2.5rem] ${isSecondary ? 'bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-gray-800' : ''}`}>
        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 text-center">{title}</h5>
        <div className="bg-white dark:bg-black/20 rounded-[2rem] p-4 mb-6 flex justify-center shadow-inner">
          <div className="scale-110"><SmoothieCup state={stateToUse} /></div>
        </div>
        
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">TOTAL ENERGY</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl md:text-5xl font-black text-[#CA210E] neon-red">{formatValue(nut.kcal)}</span>
              <span className="text-xs font-bold uppercase text-yellow-600">KCAL</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { l: 'PRO', v: nut.protein, c: '#CA210E' },
              { l: 'CARB', v: nut.carbs, c: 'currentColor' },
              { l: 'FAT', v: nut.fat, c: 'currentColor' }
            ].map((s, i) => (
              <div key={i} className="bg-white/80 dark:bg-black/40 p-3 rounded-2xl border border-gray-100 dark:border-white/5 text-center">
                <p className="text-[8px] font-black text-yellow-600 uppercase mb-0.5">{s.l}</p>
                <p className="font-black text-xs md:text-sm" style={{ color: s.c }}>{formatValue(s.v)}g</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-white/10 text-left space-y-3">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">FRUIT PACK</span>
              <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase">{packName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">BASE</span>
              <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase">{baseName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">PROTEIN</span>
              <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase">{proteinName}</span>
            </div>
            {addOnNames.length > 0 && (
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">BOOSTERS</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {addOnNames.map((name, i) => (
                    <span key={i} className="text-[8px] px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded border border-gray-200 dark:border-gray-800 font-bold uppercase">{name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Mini Summary for Sidebar View
   */
  const MiniSidebarSummary = ({ nut, title, isSnap = false }: { nut: any, title: string, isSnap?: boolean }) => {
    const isChanging = !isSnap && isAnimating;
    const cupState = isSnap ? { 
      base: smoothie1?.baseId, 
      fruitPackId: smoothie1?.fruitPackId, 
      protein: smoothie1?.proteinId, 
      selectedAddOns: smoothie1?.selectedAddOns 
    } as any : state;

    return (
      <div className={`flex flex-col items-center gap-1 w-full p-2 rounded-xl transition-all ${isSnap ? 'bg-gray-100 dark:bg-white/5 opacity-80' : ''}`}>
        <div className="text-[8px] font-black uppercase text-gray-500 mb-1">{title}</div>
        <div className="w-10 h-14 flex items-center justify-center pointer-events-none scale-[0.6] origin-center">
          <SmoothieCup state={cupState} />
        </div>
        <div className="flex flex-col items-center leading-none mt-1">
          <span className={`text-xl font-black text-[#CA210E] neon-red transition-transform duration-200 ${isChanging ? 'scale-110' : 'scale-100'}`}>{Math.round(nut.kcal)}</span>
          <span className="text-[7px] tracking-widest font-bold text-gray-500 uppercase">kcal</span>
        </div>
        <div className="grid grid-cols-3 gap-1 w-full text-[9px] font-black uppercase text-center mt-1">
          <div className="flex flex-col">
            <span className="text-[7px] text-gray-400">P</span>
            <span>{formatValue(nut.protein)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] text-gray-400">C</span>
            <span>{formatValue(nut.carbs)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] text-gray-400">F</span>
            <span>{formatValue(nut.fat)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-12 flex flex-col items-center bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* THEME TOGGLE */}
      <button onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} className="fixed top-4 left-4 z-[60] p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-yellow-400 shadow-lg active:scale-95 transition-transform">
        {theme === 'dark' ? <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg> : <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>}
      </button>

      {/* FLOATING SIDEBAR SUMMARY */}
      <div 
        className={`fixed top-1/2 right-0 transform -translate-y-1/2 
                   transition-all duration-500 ease-in-out z-50
                   ${compareMode ? 'w-56 md:w-64' : 'w-32 md:w-36 lg:w-40'}
                   bg-white/40 dark:bg-black/40 backdrop-blur-xl border-l border-gray-300 dark:border-gray-700 
                   rounded-l-[2.5rem] shadow-2xl p-4 flex flex-col items-center gap-4`}
      >
        <div className={`flex w-full gap-4 ${compareMode ? 'flex-row' : 'flex-col'} cursor-pointer`} onClick={() => setIsModalOpen(true)}>
          {compareMode && smoothie1 && (
            <div className="flex-1 animate-in slide-in-from-right duration-300">
              <MiniSidebarSummary nut={smoothie1.nutrition} title="Smoothie 1" isSnap={true} />
            </div>
          )}
          <div className="flex-1">
            <MiniSidebarSummary nut={nutrition} title={compareMode ? "Smoothie 2" : "Current"} />
          </div>
        </div>

        {/* INTERACTION BUTTONS ON SIDEBAR */}
        <div className="w-full flex flex-col gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={(e) => { e.stopPropagation(); refreshAll(); }} 
            className="w-full py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span className="text-xs">↻</span> Reset
          </button>
          
          {compareMode ? (
            <button 
              onClick={(e) => { e.stopPropagation(); clearCompare(); }} 
              className="w-full py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
            >
              <span>✖</span> Clear
            </button>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); startCompare(); }} 
              className="w-full py-2 rounded-xl bg-[#CA210E] text-white hover:bg-[#b01c0c] transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
            >
              <span>⚖️</span> Compare
            </button>
          )}

          <div 
            onClick={() => setIsModalOpen(true)}
            className="text-[8px] font-black text-gray-400 uppercase text-center tracking-[0.2em] mt-1 hover:text-[#CA210E] cursor-pointer transition-colors"
          >
            VIEW SUMMARY
          </div>
        </div>
      </div>

      {toast && <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-white dark:bg-black text-black dark:text-white px-8 py-4 border-l-8 border-[#CA210E] shadow-2xl animate-in slide-in-from-top duration-300 rounded-lg"><p className="font-black text-xs uppercase tracking-widest">{toast}</p></div>}

      <main className="w-full max-w-6xl pr-36 md:pr-40 lg:pr-44 transition-all duration-300 flex flex-col items-center pt-8">
        
        {/* NEW HEADER SECTION */}
        <div className="w-full mb-16 text-center space-y-8 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-4xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none italic">
            MAKE YOUR OWN SMOOTHIES
          </h1>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-[2px] w-12 bg-[#CA210E]"></div>
            <span className="text-xs md:text-sm font-black text-[#CA210E] uppercase tracking-[0.4em]">STEP BY STEP</span>
            <div className="h-[2px] w-12 bg-[#CA210E]"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 w-full">
            {[
              { n: '1', t: 'CHOOSE YOUR FRUIT PACK' },
              { n: '2', t: 'CHOOSE YOUR MILK' },
              { n: '3', t: 'CHOOSE YOUR PROTEIN' },
              { n: '4', t: 'CHOOSE YOUR ADD-ON' }
            ].map((step, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#CA210E] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-sm">{step.n}</span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider leading-tight">
                    {step.t}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full space-y-10">
          
          {/* STEP 1: FRUIT PACKS */}
          <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-gray-700 shadow-lg relative transition-colors duration-300">
            <div className="flex items-center space-x-4 mb-8"><span className="px-2.5 py-1 rounded bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase">01</span><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">PICK FRUIT PACK</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FRUIT_PACKS.map(pack => {
                const isSelected = state.fruitPackId === pack.id;
                const extras = PRESET_EXTRA[pack.id] || [];
                return (
                  <button key={pack.id} onClick={() => selectPack(pack.id)} className={`relative p-6 rounded-2xl text-left border-2 flex flex-col min-h-[140px] overflow-hidden transition-all ${isSelected ? 'bg-[#CA210E]/10 border-[#CA210E]' : 'border-transparent bg-white dark:bg-[#1f1f1f] hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                    {pack.image && <div className="absolute inset-0 opacity-10 pointer-events-none"><img src={pack.image} className="w-full h-full object-cover grayscale" alt="" /></div>}
                    {pack.tag && <div className="absolute top-2 right-2 bg-[#CA210E] text-white text-[9px] font-black px-2 py-0.5 z-20 rounded-full">{pack.tag}</div>}
                    <div className="relative z-10"><div className={`font-black text-sm mb-1 uppercase tracking-tight ${isSelected ? 'text-[#CA210E]' : ''}`}>{pack.name}</div><div className="text-[10px] text-gray-600 dark:text-gray-400 mb-4 font-medium uppercase">{pack.description}</div>
                      {extras.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{extras.map((ex, i) => (<div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-[8px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-tighter"><span className="w-3 text-center">🔒</span> {ex.name}</div>))}</div>}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-auto relative z-10 pt-4">{pack.items.map((item, i) => (<div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-600 bg-white/40 dark:bg-black/40"><span className="text-[10px]">{FRUITS_MASTER.find(f => f.id === item.fruitId)?.emoji}</span><span className="text-[8px] font-black uppercase text-gray-500 dark:text-gray-300">{FRUITS_MASTER.find(f => f.id === item.fruitId)?.name}</span></div>))}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: BASE */}
          <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
            <div className="flex items-center space-x-4 mb-8"><span className="px-2.5 py-1 rounded bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase">02</span><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">PICK MILK BASE</h3></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {BASES.map(base => (<button key={base.id} onClick={() => setState(prev => ({ ...prev, base: prev.base === base.id ? null : base.id }))} className={`p-4 rounded-xl text-center border-2 font-bold text-[10px] uppercase transition-all ${state.base === base.id ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600' : 'border-transparent bg-white dark:bg-[#1f1f1f] hover:bg-gray-100 dark:hover:bg-white/5'}`}>{base.name}</button>))}
            </div>
          </div>

          {/* STEP 3: PROTEIN */}
          <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
            <div className="flex items-center space-x-4 mb-8"><span className="px-2.5 py-1 rounded bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase">03</span><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">{isDoubleProtein ? 'PROTEIN (2x ACTIVE)' : 'PICK PROTEIN'}</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PROTEINS.map(protein => (<button key={protein.id} onClick={() => setState(prev => ({ ...prev, protein: prev.protein === protein.id ? null : protein.id }))} className={`p-4 rounded-xl text-left px-6 border-2 font-black text-[10px] uppercase transition-all ${state.protein === protein.id ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600' : 'border-transparent bg-white dark:bg-[#1f1f1f] hover:bg-gray-100 dark:hover:bg-white/5'}`}>{protein.name}</button>))}
            </div>
          </div>

          {/* STEP 4: ADD-ONS */}
          <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300 relative">
            <button onClick={resetAddOns} className="absolute top-8 right-8 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors active:scale-95" aria-label="Reset all add-ons"><span>↻</span><span className="hidden sm:inline">Reset</span></button>
            <div className="flex items-center space-x-4 mb-8"><span className="px-2.5 py-1 rounded bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase">04</span><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">ADD-ON BOOSTERS</h3></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {ADD_ONS.map(addOn => {
                const isSelected = state.selectedAddOns?.includes(addOn.id);
                return (<button key={addOn.id} onClick={() => toggleAddOn(addOn.id)} className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 text-[10px] uppercase font-black h-20 transition-all ${isSelected ? 'bg-gray-100 dark:bg-gray-800 border-gray-400 text-gray-900 dark:text-gray-200' : 'border-transparent bg-white dark:bg-[#1f1f1f] hover:bg-gray-100 dark:hover:bg-white/5'}`}>{isSelected && (<div className="absolute top-1 right-1 rounded-full p-0.5 bg-gray-600 text-white"><svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg></div>)}<span className="text-center leading-tight">{addOn.name}</span></button>);
              })}
            </div>
          </div>
        </div>

        {/* NUTRITIONAL ARCHIVE */}
        <section className="w-full mt-20 pt-16 border-t border-gray-200 dark:border-gray-800">
          <div className="mb-12 border-l-8 border-yellow-500 pl-6">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">NUTRITIONAL ARCHIVE</h3>
            <p className="text-xs text-gray-500 mt-2 font-medium tracking-widest uppercase">RAW COMPONENT DATA</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'FRUIT PACK (Main + Extra)', data: FRUIT_PACKS, isPack: true },
              { title: 'MILK BASE', data: BASES },
              { title: 'PROTEIN', data: PROTEINS },
              { title: 'ADD ON BOOSTERS', data: ADD_ONS }
            ].map((col, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-[#141414] border-2 border-gray-200 dark:border-gray-700 rounded-[2rem] overflow-hidden transition-colors">
                <div className="px-6 py-5 bg-gray-900 dark:bg-white">
                  <h4 className="font-black text-white dark:text-black text-[10px] uppercase tracking-[0.2em]">{col.title}</h4>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {col.data.map((item: any) => {
                    const stats = col.isPack ? calculatePackNutrition(item.id) : item;
                    return (
                      <div key={item.id} className="p-6 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                        <p className="font-black text-[11px] text-gray-900 dark:text-white uppercase mb-4 group-hover:text-yellow-600 transition-colors truncate">
                          {item.emoji && <span className="mr-2">{item.emoji}</span>}
                          {item.name}
                        </p>
                        <div className="grid grid-cols-4 gap-2 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                          <div className="flex flex-col"><span>PRO</span><span className="text-gray-900 dark:text-white">{formatValue(stats.protein)}</span></div>
                          <div className="flex flex-col"><span>CARB</span><span className="text-gray-900 dark:text-white">{formatValue(stats.carbs)}</span></div>
                          <div className="flex flex-col"><span>FAT</span><span className="text-gray-900 dark:text-white">{formatValue(stats.fat)}</span></div>
                          <div className="flex flex-col"><span style={{color: '#CA210E'}}>KCAL</span><span className="text-gray-900 dark:text-white">{formatValue(stats.kcal)}</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FINAL SUMMARY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className={`w-full ${compareMode ? 'max-w-6xl' : 'max-w-lg'} rounded-[3rem] bg-white dark:bg-black border-4 border-[#CA210E] p-8 md:p-12 text-center relative shadow-[0_0_50px_rgba(202,33,14,0.3)] animate-in zoom-in duration-300 overflow-y-auto max-h-[95vh] custom-scrollbar`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-3 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-[#CA210E] hover:text-white transition-all active:scale-90 z-10"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg></button>
            
            <h4 className="text-3xl md:text-4xl font-black mb-8 uppercase tracking-tighter">
              {compareMode ? "BLEND COMPARISON" : "YOUR SMOKEY'S BLEND"}
            </h4>

            <div className={`flex flex-col md:flex-row gap-8 ${compareMode ? 'items-stretch' : 'items-center justify-center'}`}>
              {compareMode && smoothie1 && (
                <>
                  <SummaryCard 
                    nut={smoothie1.nutrition} 
                    stateToUse={{ 
                      base: smoothie1.baseId, 
                      fruitPackId: smoothie1.fruitPackId, 
                      protein: smoothie1.proteinId, 
                      selectedAddOns: smoothie1.selectedAddOns 
                    }} 
                    title="SMOOTHIE 1" 
                    isSecondary={true}
                  />
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center font-black text-gray-400 text-xs">VS</div>
                  </div>
                </>
              )}
              
              <SummaryCard 
                nut={nutrition} 
                stateToUse={state} 
                title={compareMode ? "SMOOTHIE 2" : "CURRENT SELECTION"} 
              />
            </div>
            
            <div className="mt-10 flex flex-col items-center gap-8">
              {compareMode && (
                <div className="bg-[#CA210E]/10 px-6 py-3 rounded-2xl border border-[#CA210E]/30">
                  <p className="text-[10px] font-black text-[#CA210E] uppercase tracking-widest">DIFFERENCE</p>
                  <p className="text-2xl font-black">
                    {Math.abs(Math.round(nutrition.kcal - (smoothie1?.nutrition.kcal || 0)))} 
                    <span className="text-sm ml-1 text-gray-500">KCAL</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
