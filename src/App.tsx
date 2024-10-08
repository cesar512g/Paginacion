import React, { useState, useCallback } from 'react';
import ProgramTable from './components/ProgramTable';
import MemoryVisualization from './components/MemoryVisualization';
import SegmentationForm from './components/SegmentationForm';
import { Program } from './types';

const initialPrograms: Program[] = [
  {
    key: 1,
    id: 0,
    name: "NotePad",
    txt: 195240,
    data: 12352,
    bss: 1165
  },
  {
    key: 2,
    id: 0,
    name: "Word",
    txt: 775390,
    data: 32680,
    bss: 4100
  },
  {
    key: 3,
    id: 0,
    name: "Excel",
    txt: 995420,
    data: 24245,
    bss: 7557
  },
  {
    key: 4,
    id: 0,
    name: "AutoCad",
    txt: 1150000,
    data: 123470,
    bss: 1123
  },
  {
    key: 5,
    id: 0,
    name: "Calculadora",
    txt: 123420,
    data: 1246,
    bss: 1756
  },
  {
    key: 6,
    id: 0,
    name: "ProgramaErr",
    txt: 5250000,
    data: 3224000,
    bss: 51000
  }
];

function App() {
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>([]);
  const [segmentBits, setSegmentBits] = useState<number>(16);
  const [segmentationMethod, setSegmentationMethod] = useState<'firstFit' | 'worstFit' | 'bestFit'>('firstFit');

  const handleProgramSelect = useCallback((program: Program) => {
    setSelectedPrograms(prev => [...prev, program]);
  }, []);

  const handleSegmentBitsChange = useCallback((bits: number) => {
    setSegmentBits(bits);
  }, []);

  const handleSegmentationMethodChange = useCallback((method: 'firstFit' | 'worstFit' | 'bestFit') => {
    setSegmentationMethod(method);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Memory Segmentation Visualization</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Programs</h2>
          <ProgramTable programs={initialPrograms} onSelect={handleProgramSelect} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Segmentation Configuration</h2>
          <SegmentationForm
            onSegmentBitsChange={handleSegmentBitsChange}
            onSegmentationMethodChange={handleSegmentationMethodChange}
            initialBits={segmentBits}
            initialMethod={segmentationMethod}
          />
        </div>
      </div>
      <MemoryVisualization
        programs={selectedPrograms}
        segmentBits={segmentBits}
        segmentationMethod={segmentationMethod}
      />
    </div>
  );
}

export default App;