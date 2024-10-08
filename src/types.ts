export interface Program {
  key: number;
  id: number;
  name: string;
  txt: number;
  data: number;
  bss: number;
}

export interface Segment {
  id: number;
  name: string;
  base: number;
  limit: number;
  type: 'heap' | 'stack' | 'bss' | 'data' | 'txt';
  permits: string;
}

export interface MemoryBlock {
  program: string;
  type: 'heap' | 'stack' | 'bss' | 'data' | 'txt';
  size: number;
  base: number;
}