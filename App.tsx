
import React, { useState, useEffect } from 'react';
import { Plus, Download, Share2, Search, FileText } from 'lucide-react';
import { Voter, AppState } from './types';
import Header from './components/Header';
import VoterForm from './components/VoterForm';
import VoterTable from './components/VoterTable';
import Toast from './components/Toast';
import { downloadCSV } from './services/exportService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('voter_registry_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            date: parsed.date || new Date().toISOString().split('T')[0],
            voters: Array.isArray(parsed.voters) ? parsed.voters : []
          };
        }
      }
    } catch (e) {
      console.error("Error al cargar datos locales:", e);
    }
    return {
      date: new Date().toISOString().split('T')[0],
      voters: []
    };
  });

  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('voter_registry_data', JSON.stringify(state));
    } catch (e) {
      console.warn("No se pudo guardar en el almacenamiento local:", e);
    }
  }, [state]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const generateId = () => {
    return `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addVoter = (voter: Omit<Voter, 'id'>) => {
    const newVoter = { ...voter, id: generateId() };
    setState(prev => ({
      ...prev,
      voters: [newVoter, ...prev.voters]
    }));
    setIsAdding(false);
    showToast('¡Votante añadido a la planilla!');
  };

  const removeVoter = (id: string) => {
    if (confirm('¿Eliminar este registro de la planilla?')) {
      setState(prev => ({
        ...prev,
        voters: prev.voters.filter(v => v.id !== id)
      }));
      showToast('Registro eliminado.', 'info');
    }
  };

  const handleExportCSV = () => {
    if (state.voters.length === 0) {
      alert('La planilla está vacía.');
      return;
    }
    downloadCSV(state.voters, state.date);
    showToast('Archivo Excel/CSV generado.');
  };

  const filteredVoters = state.voters.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.cedula.includes(searchTerm)
  );

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <div className="no-print">
        <Header date={state.date} onDateChange={(date) => setState(prev => ({ ...prev, date }))} />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="hidden print:block text-center mb-8 border-b-2 border-slate-900 pb-4">
          <h1 className="text-2xl font-black uppercase tracking-tight">Consejo Comunitario Cuenca Río Ovejas</h1>
          <h2 className="text-xl font-bold text-slate-700">Planilla de Registro de Votantes - 2026</h2>
          <p className="text-sm mt-2">Fecha de Reporte: {state.date}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none">
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Buscar en planilla..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar a Planilla</span>
              </button>
              
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Excel/CSV</span>
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {filteredVoters.length > 0 ? (
              <VoterTable voters={filteredVoters} onRemove={removeVoter} />
            ) : (
              <div className="py-24 text-center no-print">
                <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase">Planilla Vacía</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">Empieza a registrar los ciudadanos para generar la planilla de votación.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 p-6 bg-white border-2 border-slate-200 rounded-xl text-[11px] text-slate-500 leading-relaxed flex items-start gap-4 shadow-sm print:bg-transparent print:border-slate-300">
           <Share2 className="w-8 h-8 text-blue-500 shrink-0 opacity-40 no-print" />
           <div>
             <p className="font-black text-slate-800 mb-1 uppercase tracking-wider">Aviso de Privacidad y Gestión de Datos:</p>
             Este documento contiene información sensible protegida por la Ley 1581 de 2012. El uso de esta planilla es exclusivo para el Consejo Comunitario Cuenca Río Ovejas. Los datos se almacenan localmente en este dispositivo para mayor seguridad. Use el botón **Excel/CSV** para generar el reporte oficial.
           </div>
        </div>
      </main>

      {isAdding && (
        <VoterForm 
          onSubmit={addVoter} 
          onClose={() => setIsAdding(false)} 
          existingVoters={state.voters}
        />
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default App;
