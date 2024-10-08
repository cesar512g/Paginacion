import { Program, Segment, MemoryBlock } from '../types';

const HEAP_SIZE = 131072;
const STACK_SIZE = 65536;

export function performSegmentation(
  programs: Program[],
  segmentBits: number,
  segmentationMethod: 'firstFit' | 'worstFit' | 'bestFit',
  osSize: number
): { segments: Segment[], memoryBlocks: MemoryBlock[] } {
  const totalMemory = Math.pow(2, 24); // Assuming 24-bit address space
  const segmentSize = Math.pow(2, 24 - segmentBits);
  let currentAddress = osSize;
  const segments: Segment[] = [];
  const memoryBlocks: MemoryBlock[] = [];

  const roundToNextSegment = (address: number) => {
    return Math.ceil(address / segmentSize) * segmentSize;
  };

  const allocateSegment = (size: number, type: 'heap' | 'stack' | 'bss' | 'data' | 'txt', programName: string) => {
    let remainingSize = size;
    let segmentId = 0;
    while (remainingSize > 0 && currentAddress < totalMemory) {
      const currentSegmentSize = Math.min(remainingSize, segmentSize);
      let base: number;

      switch (segmentationMethod) {
        case 'firstFit':
          base = roundToNextSegment(currentAddress);
          break;
        case 'worstFit':
          // Simplified worst fit - find largest free space
          base = roundToNextSegment(currentAddress);
          break;
        case 'bestFit':
          // Simplified best fit - find smallest sufficient free space
          base = roundToNextSegment(currentAddress);
          break;
      }

      const segment: Segment = {
        id: segmentId,
        name: `${programName} ${type}`,
        base: base,
        limit: currentSegmentSize,
        type: type,
        permits: type === 'txt' ? 'RX' : 'RW'
      };

      segments.push(segment);
      memoryBlocks.push({
        program: programName,
        type: type,
        size: currentSegmentSize,
        base: base
      });

      currentAddress = base + currentSegmentSize;
      remainingSize -= currentSegmentSize;
      segmentId++;

      if (segmentId > 1000) {
        console.error('Too many segments created. Stopping allocation.');
        break;
      }
    }
  };

  programs.forEach((program) => {
    allocateSegment(HEAP_SIZE, 'heap', program.name);
    allocateSegment(STACK_SIZE, 'stack', program.name);
    allocateSegment(program.bss, 'bss', program.name);
    allocateSegment(program.data, 'data', program.name);
    allocateSegment(program.txt, 'txt', program.name);
  });

  return { segments, memoryBlocks };
}