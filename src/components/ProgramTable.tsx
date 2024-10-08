import React from 'react';
import { Program } from '../types';

interface ProgramTableProps {
  programs: Program[];
  onSelect?: (program: Program) => void;
}

const ProgramTable: React.FC<ProgramTableProps> = ({ programs, onSelect }) => {
  return (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">TXT</th>
          <th className="px-4 py-2">Data</th>
          <th className="px-4 py-2">BSS</th>
          {onSelect && <th className="px-4 py-2">Action</th>}
        </tr>
      </thead>
      <tbody>
        {programs.map((program) => (
          <tr key={program.key} className="border-b">
            <td className="px-4 py-2">{program.name}</td>
            <td className="px-4 py-2">{program.txt}</td>
            <td className="px-4 py-2">{program.data}</td>
            <td className="px-4 py-2">{program.bss}</td>
            {onSelect && (
              <td className="px-4 py-2">
                <button
                  onClick={() => onSelect(program)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                  Select
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProgramTable;