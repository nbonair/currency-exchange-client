import React from 'react';

export default function SkeletonRow({isHeader = false }) {
  const CellTag = isHeader ? 'th' : 'td';

  return (
    <tr className="animate-pulse">
        <CellTag className="border px-4 py-2">
          <div className="h-4 bg-gray-200 rounded mx-auto"></div>
        </CellTag>
        <CellTag className="border px-4 py-2">
          <div className="h-4 bg-gray-200 rounded mx-auto"></div>
        </CellTag>
    </tr>
  );
}
