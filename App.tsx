import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BASES, FRUIT_PACKS, PROTEINS, FRUITS_MASTER, ADD_ONS } from './constants';
import { SmoothieState } from './types';
import { calculateNutrition, formatValue } from './services/nutritionService';
import { SmoothieCup } from './components/SmoothieCup';

/**
 * Main App Component: Smokey's Protein Smoothies
 * Purpose: Manages the global builder state, selection logic, and UI rendering.
 */
const App: React.FC = () => {
  // State: Theme management (Persisted in localStorage)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  // State: Smoothie configuration (The 'Cart' of current selections)
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

  // UI State: Controls notifications and summary modal
  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Controls the kcal counter ping animation
  
  // Ref: Tracks previous kcal value to trigger feedback animation on change
  const prevKcalRef = useRef(0);

  // Effect: Sync HTML classes and localStorage when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Effect: Persist selection state to localStorage for session recovery
  useEffect(() => {
    localStorage.setItem('smokeys_pro_v5_updated', JSON.stringify(state));
  }, [state]);

  // Memo: Derived data based on current selections
  const currentPack = useMemo(() => FRUIT_PACKS.find(p => p.id === state.fruitPackId), [state.fruitPackId]);
  const isDoubleProtein = currentPack?.proteinMultiplier === 2;
  
  // Memo: Complex nutritional summation logic
  const nutrition = useMemo(() => calculateNutrition(state), [state]);
  
  // Logic: Minimum requirements check for enabling selection completion
  const canBlend = state.base && state.fruitPackId && state.protein;

  // Effect: Logic to trigger feedback animations when kcal value updates
  useEffect(() => {
    if (Math.round(nutrition.kcal) !== Math.round(prevKcalRef.current)) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      prevKcalRef.current = nutrition.kcal;
      return () => clearTimeout(timer);
    }
  }, [nutrition.kcal]);

  // Effect: Notification logic for special pack bonuses
  useEffect(() => {
    if (state.fruitPackId && isDoubleProtein) {
      showToast(`${currentPack?.name} selected – Double Protein Active!`);
    }
  }, [state.fruitPackId, isDoubleProtein]);

  /**
   * Function: showToast
   * Purpose: Displays a temporary floating notification.
   */
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000); // Auto-dismiss after 3s
  };

  /**
   * Function: toggleAddOn
   * Purpose: Adds/Removes an ID from the selectedAddOns array.
   */
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
   * Function: calculatePackNutrition
   * Purpose: Helper used in the 'Archive' section to show preset pack totals.
   */
  const calculatePackNutrition = (packId: string) => {
    const pack = FRUIT_PACKS.find(p => p.id === packId);
    let protein = 0, carbs = 0, fat = 0, kcal = 0;
    if (pack) {
      pack.items.forEach(item => {
        const fruit = FRUITS_MASTER.find(f => f.id === item.fruitId);
        if (fruit) {
          const factor = item.weight / 100;
          protein += fruit.protein * factor;
          carbs += fruit.carbs * factor;
          fat += fruit.fat * factor;
          kcal += fruit.kcal * factor;
        }
      });
    }
    return { protein, carbs, fat, kcal };
  };

  /**
   * Function: downloadRecipe
   * Purpose: Generates and triggers a .txt file download containing the recipe summary.
   */
  const downloadRecipe = () => {
    const baseName = BASES.find(b => b.id === state.base)?.name || 'Not selected';
    const packName = FRUIT_PACKS.find(p => p.id === state.fruitPackId)?.name || 'Not selected';
    const proteinName = PROTEINS.find(p => p.id === state.protein)?.name || 'Not selected';
    const proteinAmount = isDoubleProtein ? `${proteinName} (Double Protein)` : proteinName;
    const addOnLines = (state.selectedAddOns || []).map(id => {
      const item = ADD_ONS.find(a => a.id === id);
      return item ? `- ${item.name}` : '';
    }).filter(l => l !== '').join('\n');

    const content = `SMOKEY'S SMOOTHIE RECIPE
-------------------------------------
FRUIT PACK: ${packName}
BASE: ${baseName}
PROTEIN: ${proteinAmount}
${addOnLines ? '\nADD-ONS:\n' + addOnLines : ''}

NUTRITION FACTS:
Protein: ${formatValue(nutrition.protein)}g
Carbs: ${formatValue(nutrition.carbs)}g
Fat: ${formatValue(nutrition.fat)}g
Energy: ${formatValue(nutrition.kcal)} kcal
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smokeys-recipe.txt`;
    link.click();
  };

  /**
   * Component: LivePreviewRight
   * Purpose: Enlarged persistent fixed preview panel on the right side.
   */
  const LivePreviewRight = () => {
    const kcalValue = Math.round(nutrition.kcal);
    return (
      <div 
        aria-label="Live calorie counter"
        onClick={() => setIsModalOpen(true)}
        className="fixed top-1/2 right-0 transform -translate-y-1/2
                   w-32 md:w-36 lg:w-40
                   min-h-[16rem] max-h-[80vh] overflow-y-auto custom-scrollbar
                   bg-white/30 dark:bg-black/30 backdrop-blur-md
                   border-l border-gray-300 dark:border-gray-700
                   rounded-l-xl shadow-2xl z-50
                   p-3 flex flex-col items-center gap-y-3 cursor-pointer transition-all hover:bg-white/50 dark:hover:bg-black/50"
      >
        {/* Section: Enlarged Smoothie icon (via scale logic) */}
        <div className="w-12 h-12 flex items-center justify-center pointer-events-none scale-[0.75] origin-center">
          <SmoothieCup state={state} />
        </div>

        {/* Section: Large Bold Kcal Display */}
        <div className="flex flex-col items-center justify-center leading-none">
          <span className={`text-3xl font-extrabold text-[#CA210E] neon-red leading-none transition-transform duration-200 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
            {kcalValue}
          </span>
          <span className="text-xs tracking-wider font-semibold text-gray-700 dark:text-gray-300 uppercase mt-1">kcal</span>
        </div>

        {/* Section: Macro Grid (Anti-overlap layout) */}
        <div className="grid grid-cols-3 gap-x-2 gap-y-1 w-full text-gray-900 dark:text-white leading-tight">
          <div className="flex flex-col items-center border-r border-gray-400/20 last:border-0">
            <span className="text-[10px] tracking-wider font-semibold text-gray-500/80">P</span>
            <span className="text-sm font-bold">{formatValue(nutrition.protein)}</span>
          </div>
          <div className="flex flex-col items-center border-r border-gray-400/20 last:border-0">
            <span className="text-[10px] tracking-wider font-semibold text-gray-500/80">C</span>
            <span className="text-sm font-bold">{formatValue(nutrition.carbs)}</span>
          </div>
          <div className="flex flex-col items-center last:border-0">
            <span className="text-[10px] tracking-wider font-semibold text-gray-500/80">F</span>
            <span className="text-sm font-bold">{formatValue(nutrition.fat)}</span>
          </div>
        </div>

        {/* Visual: Action Hint */}
        <div className="mt-auto pt-2">
          <div className="text-[9px] font-black text-[#CA210E] uppercase text-center tracking-[0.2em] animate-pulse">
            VIEW SUMMARY
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-12 flex flex-col items-center bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* THEME TOGGLE */}
      <button 
        onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        className="fixed top-4 left-4 z-[60] p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-yellow-400 shadow-lg active:scale-95 transition-transform"
      >
        {theme === 'dark' ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
        )}
      </button>

      {/* PERSISTENT FIXED PREVIEW PANEL */}
      <LivePreviewRight />

      {/* TOAST MESSAGES */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-white dark:bg-black text-black dark:text-white px-8 py-4 border-l-8 border-[#CA210E] shadow-2xl animate-in slide-in-from-top duration-300 rounded-lg">
          <p className="font-black text-xs uppercase tracking-widest">{toast}</p>
        </div>
      )}

      {/* MAIN BUILDER AREA - Enlarged offset padding to match enlarged panel widths */}
      <main className="w-full max-w-6xl pr-32 md:pr-36 lg:pr-40 transition-all duration-300 flex flex-col items-start pt-8">
        <div className="w-full space-y-10">
          
          {/* STEP 1: FRUIT PACKS */}
          <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-gray-700 shadow-lg relative transition-colors duration-300">
            <div className="flex items-center space-x-4 mb-8">
              <span className="px-2.5 py-1 rounded bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase">01</span>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">PICK FRUIT PACK</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FRUIT_PACKS.map(pack => (
                <button
                  key={pack.id}
                  onClick={() => setState(prev => ({ ...prev, fruitPackId: prev.fruitPackId === pack.id ? null : pack.id }))}
                  className={`relative p-6 rounded-2xl text-left border-2 flex flex-col min-h-[140px] overflow-hidden transition-all ${
                    state.fruitPackId === pack.id 
                      ? 'bg-[#CA210E]/10 border-[#CA210E]' 
                      : 'border-transparent bg-white dark:bg-[#1f1f1f] hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {pack.image && <div className="absolute inset-0 opacity-10 pointer-events-none"><img src={pack.image} className="w-full h-full object-cover grayscale" alt="" /></div>}
                  {pack.tag && <div className="absolute top-2 right-2 bg-[#CA210E] text-white text-[9px] font-black px-2 py-0.5 z-20 rounded-full">{pack.tag}</div>}
                  <div className="relative z-10">
                    <div className={`font-black text-sm mb-1 uppercase tracking-tight ${state.fruitPackId === pack.id ? 'text-[#CA210E]' : ''}`}>{pack.name}</div>
                    <div className="text-[10px] text-gray-600 dark:text-gray-400 mb-5 font-medium uppercase">{pack.description}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-auto relative z-10">
                    {pack.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-600 bg-white/40 dark:bg-black/40">
                        <span className="text-[10px]">{FRUITS_MASTER.find(f => f.id === item.fruitId)?.emoji}</span>
                        <span className="text-[8px] font-black uppercase text-gray-500 dark:text-gray-300">
                          {FRUITS_MASTER.find(f => f.id === item.fruitId)?.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: BASE (MILK) */}
          <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
            <div className="flex items-center space-x-4 mb-8">
              <span className="px-2.5 py-1 rounded bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase">02</span>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">PICK MILK BASE</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {BASES.map(base => (
                <button
                  key={base.id}
                  onClick={() => setState(prev => ({ ...prev, base: prev.base === base.id ? null : base.id }))}
                  className={`p-4 rounded-xl text-center border-2 font-bold text-[10px] uppercase transition-all ${state.base === base.id ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600' : 'border-transparent bg-white dark:bg-[#1f1f1f] hover:bg-gray-100 dark:hover:bg-white/5'}`}
                >
                  {base.name}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: PROTEIN */}
          <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
            <div className="flex items-center space-x-4 mb-8">
              <span className="px-2.5 py-1 rounded bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase">03</span>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">{isDoubleProtein ? 'PROTEIN (2x ACTIVE)' : 'PICK PROTEIN'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PROTEINS.map(protein => (
                <button
                  key={protein.id}
                  onClick={() => setState(prev => ({ ...prev, protein: prev.protein === protein.id ? null : protein.id }))}
                  className={`p-4 rounded-xl text-left px-6 border-2 font-black text-[10px] uppercase transition-all ${state.protein === protein.id ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600' : 'border-transparent bg-white dark:bg-[#1f1f1f] hover:bg-gray-100 dark:hover:bg-white/5'}`}
                >
                  {protein.name}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 4: ADD-ONS */}
          <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
            <div className="flex items-center space-x-4 mb-8">
              <span className="px-2.5 py-1 rounded bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase">04</span>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">ADD-ON BOOSTERS</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {ADD_ONS.map(addOn => {
                const isSelected = state.selectedAddOns?.includes(addOn.id);
                return (
                  <button
                    key={addOn.id}
                    onClick={() => toggleAddOn(addOn.id)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 text-[10px] uppercase font-black h-20 transition-all ${isSelected ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'border-transparent bg-white dark:bg-[#1f1f1f] hover:bg-gray-100 dark:hover:bg-white/5'}`}
                  >
                    {isSelected && <div className="absolute top-1 right-1 bg-green-600 text-white rounded-full p-0.5"><svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg></div>}
                    <span className="text-center">{addOn.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* NUTRITIONAL ARCHIVE SECTION */}
      <section className="w-full max-w-6xl pr-32 md:pr-36 lg:pr-40 mb-32 pt-16 border-t border-gray-200 dark:border-gray-800">
        <div className="mb-12 border-l-8 border-yellow-500 pl-6">
          <h3 className="text-3xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">NUTRITIONAL ARCHIVE</h3>
          <p className="text-xs text-gray-500 mt-2 font-medium tracking-widest uppercase">RAW COMPONENT DATA</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'FRUIT PACK', data: FRUIT_PACKS, isPack: true },
            { title: 'MILK BASE', data: BASES },
            { title: 'PROTEIN', data: PROTEINS },
            { title: 'ADD ON BOOSTERS', data: ADD_ONS }
          ].map((col, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-[#141414] border-2 border-gray-200 dark:border-gray-700 rounded-[2rem] overflow-hidden transition-colors">
              <div className="px-6 py-5 bg-gray-900 dark:bg-white">
                <h4 className="font-black text-white dark:text-black text-xs uppercase tracking-[0.2em]">{col.title}</h4>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-800 max-h-[500px] overflow-y-auto custom-scrollbar">
                {col.data.map((item: any) => {
                  const stats = col.isPack ? calculatePackNutrition(item.id) : item;
                  return (
                    <div key={item.id} className="p-6 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <p className="font-black text-[11px] text-gray-900 dark:text-white uppercase mb-4 group-hover:text-yellow-600 transition-colors">
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

      {/* FINAL SUMMARY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-lg rounded-[3rem] bg-white dark:bg-black border-4 border-[#CA210E] p-10 text-center relative shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-[#CA210E] hover:text-white transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg></button>
            <h4 className="text-3xl font-black mb-6 uppercase tracking-tighter">SMOKEY'S BLEND</h4>
            <div className="bg-gray-50 dark:bg-white/5 rounded-[2.5rem] p-6 mb-6"><SmoothieCup state={state} /></div>
            
            <div className="bg-white dark:bg-black p-6 rounded-[2rem] border-2 border-gray-100 dark:border-gray-800 mb-6 transition-colors">
              <div className="flex justify-between items-baseline mb-6"><span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">TOTAL ENERGY</span><div className="flex items-baseline space-x-1"><span className="text-5xl font-black text-[#CA210E] neon-red">{formatValue(nutrition.kcal)}</span><span className="text-sm font-bold uppercase text-yellow-600">KCAL</span></div></div>
              <div className="grid grid-cols-3 gap-3">
                {[{ l: 'PRO', v: nutrition.protein, c: '#CA210E' }, { l: 'CARB', v: nutrition.carbs, c: 'currentColor' }, { l: 'FAT', v: nutrition.fat, c: 'currentColor' }].map((s, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-100 dark:border-gray-800"><p className="text-[7px] font-black text-yellow-600 uppercase mb-1">{s.l}</p><p className="font-black" style={{ color: s.c }}>{formatValue(s.v)}g</p></div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-left">
                <p className="text-[8px] font-black text-gray-400 uppercase mb-2 tracking-widest">Ingredients Summary:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[9px] font-bold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded uppercase">{BASES.find(b => b.id === state.base)?.name}</span>
                  <span className="text-[9px] font-bold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded uppercase">{currentPack?.name}</span>
                  <span className="text-[9px] font-bold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded uppercase">{PROTEINS.find(p => p.id === state.protein)?.name} {isDoubleProtein && '(Double)'}</span>
                  {state.selectedAddOns.map(id => (
                    <span key={id} className="text-[9px] font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded uppercase border border-green-200 dark:border-green-800">{ADD_ONS.find(a => a.id === id)?.name}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Action buttons removed per user request to simplify post-summary view */}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
// End of file - App.tsx