
import React from 'react';
import { Calendar } from 'lucide-react';

interface HeaderProps {
  date: string;
  onDateChange: (date: string) => void;
}

const Header: React.FC<HeaderProps> = ({ date, onDateChange }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-900 p-3 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-inner">
              303
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase leading-tight tracking-tight">
                Consejo Comunitario de Comunidades Negras
              </h1>
              <h2 className="text-md sm:text-lg font-semibold text-blue-800 uppercase tracking-widest">
                Cuenca Río Ovejas
              </h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Información Votantes 2026</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="bg-transparent border-none p-0 text-slate-900 font-medium focus:ring-0 outline-none cursor-pointer"
                />
              </div>
            </div>
            <div className="hidden lg:block h-12 w-12 rounded-full border-4 border-slate-100 overflow-hidden">
                <img src="https://picsum.photos/id/64/100/100" alt="Logo" className="w-full h-full object-cover grayscale" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
