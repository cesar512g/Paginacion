import React, { useMemo } from 'react';
import { Program, MemoryBlock, Segment } from '../types';
import { performSegmentation } from '../utils/segmentation';

interface MemoryVisualizationProps {
  programs: Program[];
  segmentBits: number;
  segmentationMethod: 'firstFit' | 'worstFit' | 'bestFit';
}

const MemoryVisualization: React.FC<MemoryVisualizationProps> = ({ programs, segmentBits, segmentationMethod }) => {
  const totalMemory = Math.pow(2, 24); // 24-bit address space
  const osSize = totalMemory * 0.1; // Assume OS takes 10% of memory

  const { segments, memoryBlocks } = useMemo(() => 
    performSegmentation(programs, segmentBits, segmentationMethod, osSize),
    [programs, segmentBits, segmentationMethod, osSize]
  );

  const getColor = (type: string) => {
    switch (type) {
      case 'txt': return 'bg-blue-500';
      case 'data': return 'bg-green-500';
      case 'bss': return 'bg-yellow-500';
      case 'heap': return 'bg-purple-500';
      case 'stack': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const totalUsedMemory = useMemo(() => 
    memoryBlocks.reduce((acc, block) => acc + block.size, 0) + osSize,
    [memoryBlocks, osSize]
  );

  // Function to calculate position and size for visualization
  const getBlockStyle = (block: MemoryBlock, index: number) => {
    const blockStart = block.base;
    const blockSize = block.size;
    const heightPercentage = (blockSize / totalMemory) * 100;
    const bottomPercentage = ((blockStart - osSize) / totalMemory) * 100;

    return {
      height: `${heightPercentage}%`,
      bottom: `${bottomPercentage}%`,
    };
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4">
        <h3 className="font-bold mb-2">Segmentation Table:</h3>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Segmento</th>
              <th className="border border-gray-300 px-4 py-2">Base (Hex)</th>
              <th className="border border-gray-300 px-4 py-2">Base (Dec)</th>
              <th className="border border-gray-300 px-4 py-2">Límite</th>
              <th className="border border-gray-300 px-4 py-2">Tipo</th>
              <th className="border border-gray-300 px-4 py-2">Permisos</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((segment, index) => (
              <tr key={index} className={getColor(segment.type)}>
                <td className="border border-gray-300 px-4 py-2">{segment.name}</td>
                <td className="border border-gray-300 px-4 py-2">{segment.id}</td>
                <td className="border border-gray-300 px-4 py-2">{segment.base.toString(16).toUpperCase().padStart(8, '0')}</td>
                <td className="border border-gray-300 px-4 py-2">{segment.base}</td>
                <td className="border border-gray-300 px-4 py-2">{segment.limit}</td>
                <td className="border border-gray-300 px-4 py-2">{segment.type}</td>
                <td className="border border-gray-300 px-4 py-2">{segment.permits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full h-[600px] bg-gray-200 relative overflow-y-auto">
        <div className="absolute inset-0">
          {/* OS Block */}
          <div
            className="absolute bottom-0 left-0 w-full bg-red-500"
            style={{ height: `${(osSize / totalMemory) * 100}%` }}
          >
            <span className="text-white text-xs p-1">OS</span>
          </div>

          {/* Program Blocks */}
          {memoryBlocks.map((block, index) => {
            const style = getBlockStyle(block, index);
            return (
              <div
                key={index}
                className={`absolute left-0 w-full ${getColor(block.type)} border-t border-gray-600 flex items-center justify-center`}
                style={style}
              >
                <span className="text-white text-xs p-1 truncate">
                  {`${block.program} (${block.type})`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-bold">Legend:</h3>
        <div className="flex flex-wrap gap-4">
          <span className="flex items-center"><div className="w-4 h-4 bg-red-500 mr-2"></div>OS</span>
          <span className="flex items-center"><div className="w-4 h-4 bg-blue-500 mr-2"></div>TXT</span>
          <span className="flex items-center"><div className="w-4 h-4 bg-green-500 mr-2"></div>Data</span>
          <span className="flex items-center"><div className="w-4 h-4 bg-yellow-500 mr-2"></div>BSS</span>
          <span className="flex items-center"><div className="w-4 h-4 bg-purple-500 mr-2"></div>Heap</span>
          <span className="flex items-center"><div className="w-4 h-4 bg-pink-500 mr-2"></div>Stack</span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-bold">Memory Usage:</h3>
        <p>{`${(totalUsedMemory / totalMemory * 100).toFixed(2)}% of total memory used`}</p>
        <p>{`Total Memory: ${totalMemory} bytes`}</p>
        <p>{`Used Memory: ${totalUsedMemory} bytes`}</p>
      </div>
    </div>
  );
};

export default MemoryVisualization;