
import React, { useState } from 'react';
import { Trash2, ShieldCheck, ShieldAlert, X } from 'lucide-react';
import { Voter } from '../types';

interface VoterTableProps {
  voters: Voter[];
  onRemove: (id: string) => void;
}

const VoterTable: React.FC<VoterTableProps> = ({ voters, onRemove }) => {
  const [selectedSignature, setSelectedSignature] = useState<{ name: string; signature: string } | null>(null);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto bg-white border-2 border-slate-200 rounded-lg shadow-sm print:border-none print:shadow-none">
        <table className="w-full border-collapse table-auto">
          <thead className="bg-slate-100 border-b-2 border-slate-200 print:bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-slate-800 uppercase text-[11px] font-black border-r border-slate-200 w-12 text-center">N°</th>
              <th className="px-4 py-3 text-slate-800 uppercase text-[11px] font-black border-r border-slate-200 min-w-[200px] text-center">Nombre y Apellido</th>
              <th className="px-4 py-3 text-slate-800 uppercase text-[11px] font-black border-r border-slate-200 text-center">Cédula</th>
              <th className="px-4 py-3 text-slate-800 uppercase text-[11px] font-black border-r border-slate-200 text-center">Celular</th>
              <th className="px-4 py-3 text-slate-800 uppercase text-[11px] font-black border-r border-slate-200 min-w-[180px] text-center">Lugar de Votación</th>
              <th className="px-4 py-3 text-slate-800 uppercase text-[11px] font-black border-r border-slate-200 text-center">Firma Digital</th>
              <th className="px-4 py-3 text-slate-800 uppercase text-[11px] font-black border-r border-slate-200 text-center">Autorización</th>
              <th className="px-4 py-3 text-slate-800 uppercase text-[11px] font-black text-center no-print">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {voters.map((voter, index) => (
              <tr key={voter.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-4 text-slate-500 font-bold border-r border-slate-200 text-center">{index + 1}</td>
                <td className="px-4 py-4 text-slate-900 font-bold border-r border-slate-200 uppercase text-xs text-center">{voter.name}</td>
                <td className="px-4 py-4 text-slate-700 border-r border-slate-200 font-mono text-xs text-center">{voter.cedula}</td>
                <td className="px-4 py-4 text-slate-700 border-r border-slate-200 text-xs text-center">{voter.phone || '---'}</td>
                <td className="px-4 py-4 text-slate-700 border-r border-slate-200 text-xs text-center">{voter.votingLocation}</td>
                <td className="px-4 py-4 border-r border-slate-200">
                  <div className="flex justify-center">
                    {voter.signature ? (
                      <div className="flex flex-col items-center">
                        <img src={voter.signature} alt="Firma" className="h-10 w-auto print:h-8" />
                        <button 
                          onClick={() => setSelectedSignature({ name: voter.name, signature: voter.signature! })}
                          className="text-[9px] text-blue-600 font-bold uppercase mt-1 no-print hover:underline"
                        >
                          Ampliar
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic text-[10px]">No firmó</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 border-r border-slate-200">
                  <div className="flex justify-center">
                    {voter.dataAuthorization ? (
                      <div className="flex flex-col items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-[8px] font-bold text-emerald-700 uppercase">Aceptó</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <ShieldAlert className="w-4 h-4 text-red-600" />
                        <span className="text-[8px] font-bold text-red-700 uppercase">No Aceptó</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-center no-print">
                  <button 
                    onClick={() => onRemove(voter.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar Registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estilos para impresión */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background-color: white !important; padding: 0 !important; }
          .max-w-6xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          table { font-size: 10px !important; width: 100% !important; border: 1px solid #000 !important; }
          th, td { padding: 6px 4px !important; border: 1px solid #000 !important; text-align: center !important; }
          thead { background-color: #f1f5f9 !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Modal para ver la firma en grande */}
      {selectedSignature && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm no-print">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-slate-900">Vista de Firma</h3>
                <span className="text-xs text-slate-500 uppercase">{selectedSignature.name}</span>
              </div>
              <button 
                onClick={() => setSelectedSignature(null)} 
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-12 bg-white flex items-center justify-center">
              <img 
                src={selectedSignature.signature} 
                alt="Firma" 
                className="max-w-full h-auto border-2 border-slate-100 p-4 rounded-xl"
              />
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedSignature(null)}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoterTable;
