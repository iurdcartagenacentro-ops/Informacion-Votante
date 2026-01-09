
import { Voter } from '../types';

export const downloadCSV = (voters: Voter[], date: string) => {
  // UTF-8 BOM para asegurar que Excel reconozca caracteres especiales si los hay
  const BOM = '\uFEFF';
  
  const escape = (val: any) => {
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Encabezados exactos según la imagen de muestra proporcionada
  const headers = [
    'N',
    'NOMBRE YAPELLIDO',
    'N- Cedula',
    'CELULAR',
    'LUGAR DE VOTACION',
    'FIRMA DIGITAL',
    'AUTORIZACION DATOS PERSONALES'
  ];

  // Preparamos los datos actuales
  const dataRows = voters.map((v, i) => [
    i + 1,
    v.name.toUpperCase(),
    v.cedula,
    v.phone,
    v.votingLocation.toUpperCase(),
    v.signature ? 'REGISTRADA' : 'PENDIENTE',
    v.dataAuthorization ? 'SI' : 'NO'
  ]);

  // Para que el archivo parezca un "cuadro" como en la muestra, 
  // completamos con filas vacías hasta llegar a un mínimo de 40 posiciones.
  const totalRowsDesired = 40;
  const emptyRowsCount = Math.max(0, totalRowsDesired - dataRows.length);
  const emptyRows = Array.from({ length: emptyRowsCount }, (_, i) => [
    dataRows.length + i + 1,
    '', '', '', '', '', ''
  ]);

  const allRows = [...dataRows, ...emptyRows];

  // Construcción del contenido respetando las primeras filas de la imagen
  const csvContent = [
    'sep=;', // Indica a Excel que use punto y coma como separador de columnas
    [`REPORTE DE VOTANTES - FECHA: ${date}`],
    [`CONSEJO COMUNITARIO CUENCA RIO OVEJAS`],
    [], // Fila vacía de separación
    headers.map(escape).join(';'),
    ...allRows.map(row => row.map(escape).join(';'))
  ].join('\n');

  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Planilla_Votantes_Ovejas_${date}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
