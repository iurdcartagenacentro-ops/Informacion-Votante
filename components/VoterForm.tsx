
import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Voter } from '../types.ts';
import SignaturePad from './SignaturePad.tsx';

interface VoterFormProps {
  onSubmit: (voter: Omit<Voter, 'id'>) => void;
  onClose: () => void;
  existingVoters: Voter[];
}

const VoterForm: React.FC<VoterFormProps> = ({ onSubmit, onClose, existingVoters }) => {
  const [formData, setFormData] = useState({
    name: '',
    cedula: '',
    phone: '',
    votingLocation: '',
    dataAuthorization: false,
    signature: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.cedula.trim()) newErrors.cedula = "La cédula es obligatoria";
    if (!formData.votingLocation.trim()) newErrors.votingLocation = "El lugar es obligatorio";
    if (!formData.signature) newErrors.signature = "Falta la firma del votante";
    if (!formData.dataAuthorization) newErrors.auth = "Debe autorizar el uso de datos";
    
    const isDuplicate = existingVoters.some(v => v.cedula.trim() === formData.cedula.trim());
    if (isDuplicate) newErrors.cedula = "Esta cédula ya está registrada";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-auto overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-xl font-bold text-slate-900">Formulario de Registro</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 text-center">Nombre y Apellido *</label>
            <input 
              type="text"
              placeholder="Ej: Manuel Castillo"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all text-center uppercase ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:ring-2 focus:ring-blue-500'}`}
            />
            {errors.name && <p className="text-red-600 text-[10px] mt-1 flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 text-center">Cédula *</label>
              <input 
                type="text"
                placeholder="000.000.000"
                value={formData.cedula}
                onChange={(e) => setFormData(prev => ({ ...prev, cedula: e.target.value }))}
                className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all text-center ${errors.cedula ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:ring-2 focus:ring-blue-500'}`}
              />
              {errors.cedula && <p className="text-red-600 text-[10px] mt-1 flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.cedula}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 text-center">Celular</label>
              <input 
                type="tel"
                placeholder="310..."
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 text-center">Lugar de Votación *</label>
            <input 
              type="text"
              placeholder="Ej: Escuela Central Mesa 2"
              value={formData.votingLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, votingLocation: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all text-center uppercase ${errors.votingLocation ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:ring-2 focus:ring-blue-500'}`}
            />
            {errors.votingLocation && <p className="text-red-600 text-[10px] mt-1 flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.votingLocation}</p>}
          </div>

          <div>
            <SignaturePad 
              onSave={(dataUrl) => {
                setFormData(prev => ({ ...prev, signature: dataUrl }));
                setErrors(prev => ({ ...prev, signature: '' }));
              }} 
              onClear={() => setFormData(prev => ({ ...prev, signature: '' }))}
            />
            {errors.signature && <p className="text-red-600 text-[10px] mt-1 flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.signature}</p>}
          </div>

          <div className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${errors.auth ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
            <input 
              id="auth"
              type="checkbox"
              checked={formData.dataAuthorization}
              onChange={(e) => setFormData(prev => ({ ...prev, dataAuthorization: e.target.checked }))}
              className="mt-1 w-5 h-5 text-blue-600 border-slate-300 rounded cursor-pointer"
            />
            <label htmlFor="auth" className="text-[11px] text-slate-700 cursor-pointer leading-tight">
              <strong>Ley 1581:</strong> Autorizo al Consejo Comunitario el tratamiento de mis datos personales para fines electorales.
            </label>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/2 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5" />
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoterForm;
