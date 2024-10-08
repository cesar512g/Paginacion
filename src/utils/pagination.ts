import { Program, Segment } from '../types';

export const getIndexPag = (processes: Program[], memoryProcess: number) => {
  let indices: number[] = [];
  let memoryOccupied: number[] = [];
  let remainingMemory = memoryProcess;
  let i = 0;

  while (remainingMemory > 0 && i < processes.length) {
    if (processes[i].id === 0) {
      indices.push(i);
      
      if (remainingMemory > processes[i].txt + processes[i].data + processes[i].bss) {
        memoryOccupied.push(processes[i].txt + processes[i].data + processes[i].bss);
      } else {
        memoryOccupied.push(remainingMemory);
      }
      remainingMemory -= (processes[i].txt + processes[i].data + processes[i].bss);
    }
    i++;
  }

  if (remainingMemory > 0) {
    indices = []; // No hay suficiente espacio disponible
    memoryOccupied = [];
  }

  return { indices, memoryOccupied };
};

export const programIndex = (segments: Segment[], processes: Program[]) => {
  let fakeArray = [...processes];

  let indexsForWholeProgram: [number, string, { indices: number[], memoryOccupied: number[] }][] = [];
  segments.forEach((segment) => {
    let indexSegment = getIndexPag(fakeArray, segment.limit);
    if (indexSegment.indices.length === 0) {
      indexsForWholeProgram = [];
      return;
    } else {
      indexSegment.indices.forEach((index) => {
        let processCopy = { ...fakeArray[index] };
        processCopy.id = 1; // Modificar la copia
        fakeArray[index] = processCopy;
      });
      indexsForWholeProgram.push([segment.id, segment.name, indexSegment]);
    }
  });
  return indexsForWholeProgram;
};