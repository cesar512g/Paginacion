import React, { useState } from 'react';

interface SegmentationFormProps {
  onSegmentBitsChange: (bits: number) => void;
  onSegmentationMethodChange: (method: 'firstFit' | 'worstFit' | 'bestFit') => void;
  initialBits: number;
  initialMethod: 'firstFit' | 'worstFit' | 'bestFit';
}

const SegmentationForm: React.FC<SegmentationFormProps> = ({
  onSegmentBitsChange,
  onSegmentationMethodChange,
  initialBits,
  initialMethod
}) => {
  const [bits, setBits] = useState(initialBits);
  const [method, setMethod] = useState(initialMethod);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSegmentBitsChange(bits);
    onSegmentationMethodChange(method);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="segmentBits">
          Number of Segment Bits:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="segmentBits"
          type="number"
          value={bits}
          onChange={(e) => setBits(Number(e.target.value))}
          min="1"
          max="32"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="segmentationMethod">
          Segmentation Method:
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="segmentationMethod"
          value={method}
          onChange={(e) => setMethod(e.target.value as 'firstFit' | 'worstFit' | 'bestFit')}
        >
          <option value="firstFit">First Fit</option>
          <option value="worstFit">Worst Fit</option>
          <option value="bestFit">Best Fit</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Apply
        </button>
      </div>
    </form>
  );
};

export default SegmentationForm;