import { useState } from 'react';
import Spreadsheet, { type CellBase, type Matrix } from 'react-spreadsheet';
import type { SheetCell } from '../types';

export default function SheetBlock({
  title,
  caption,
  columnLabels,
  data,
}: {
  title?: string;
  caption?: string;
  columnLabels?: string[];
  data: SheetCell[][];
}) {
  const [sheetData, setSheetData] = useState<Matrix<CellBase>>(data);

  return (
    <div className="theory-sheet-wrap">
      {title && <h3>{title}</h3>}
      <div className="theory-sheet">
        <Spreadsheet data={sheetData} onChange={setSheetData} columnLabels={columnLabels} />
      </div>
      {caption && <p className="theory-sheet-caption">{caption}</p>}
    </div>
  );
}
