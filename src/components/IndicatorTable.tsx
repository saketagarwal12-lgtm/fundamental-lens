import type { IndicatorTable as TableModel, IndicatorRow, PeriodKey, Unit } from '../data/financialAnalysis';

// One indicator table, driving all five Financial Analysis categories (§3b).
//
// - sticky first column (Particulars) + sticky grouped header
// - grouped two-row header: Actuals (Annual) / Actuals (Quarterly) spanning their
//   period columns, then Last 12 months + 3-Year Average
// - negatives render bracketed in the Weak colour; missing values render 'NA'
// - scales to any N periods (columns are derived from the data, never hardcoded)
// - values are authored outputs, formatted as-is — nothing is computed here

const WEAK = '#FB7185';

const fmt = (value: number | null, unit?: Unit): { text: string; negative: boolean } => {
  if (value === null || value === undefined) return { text: 'NA', negative: false };
  const negative = value < 0;
  const abs = Math.abs(value);
  // Thousands separators; keep up to 2 dp without trailing zeros.
  const num = abs.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const suffix = unit === '%' ? '%' : unit === 'x' ? 'x' : '';
  const body = `${num}${suffix}`;
  return { text: negative ? `(${body})` : body, negative };
};

interface Props { table: TableModel; }

export const IndicatorTable: React.FC<Props> = ({ table }) => {
  const { annualPeriods, quarterlyPeriods, showLtm, showThreeYearAvg } = table;
  const tail: PeriodKey[] = [
    ...(showLtm ? ['LTM'] : []),
    ...(showThreeYearAvg ? ['3YAVG'] : []),
  ];
  const allCols: PeriodKey[] = [...annualPeriods, ...quarterlyPeriods, ...tail];

  const stickyFirst: React.CSSProperties = {
    position: 'sticky', left: 0, zIndex: 1, background: '#0E2224',
    boxShadow: '2px 0 0 rgba(255,255,255,0.06)',
  };
  const headCell = 'px-3 py-2 text-[11px] font-medium text-muted-text whitespace-nowrap text-right';

  // Group consecutive rows by their sub-group header (Off-Balance-Sheet).
  const groups: { group?: string; rows: IndicatorRow[] }[] = [];
  for (const row of table.rows) {
    const g = row.group && row.group !== 'ratio' ? row.group : undefined;
    const last = groups[groups.length - 1];
    if (last && last.group === g) last.rows.push(row);
    else groups.push({ group: g, rows: [row] });
  }

  return (
    <div>
      {table.note && (
        <p className="text-[11px] mb-3 px-1 leading-relaxed" style={{ color: '#FBBF24' }}>{table.note}</p>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto" style={{ maxHeight: '70vh' }}>
          <table className="text-xs border-collapse min-w-full">
            <thead className="sticky top-0" style={{ zIndex: 2 }}>
              {/* Grouped header row */}
              <tr style={{ background: '#0E2224' }}>
                <th rowSpan={2} className="px-3 py-2 text-left text-[11px] font-semibold text-primary-text align-bottom" style={stickyFirst}>
                  Particulars
                </th>
                {annualPeriods.length > 0 && (
                  <th colSpan={annualPeriods.length} className="px-3 py-1.5 text-center text-[10px] font-semibold text-muted-text uppercase tracking-wide" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    Actuals (Annual Data)
                  </th>
                )}
                {quarterlyPeriods.length > 0 && (
                  <th colSpan={quarterlyPeriods.length} className="px-3 py-1.5 text-center text-[10px] font-semibold text-muted-text uppercase tracking-wide" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                    Actuals (Quarterly)
                  </th>
                )}
                {tail.length > 0 && (
                  <th colSpan={tail.length} className="px-3 py-1.5 text-center text-[10px] font-semibold text-muted-text uppercase tracking-wide" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                    Summary
                  </th>
                )}
              </tr>
              {/* Period header row */}
              <tr style={{ background: '#0E2224', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                {allCols.map((p, i) => (
                  <th key={p} className={headCell}
                    style={{ borderLeft: (i === annualPeriods.length || i === annualPeriods.length + quarterlyPeriods.length) ? '1px solid rgba(255,255,255,0.08)' : undefined }}>
                    {p === '3YAVG' ? '3Y Avg' : p === 'LTM' ? 'Last 12m' : p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allCols.length === 0 ? (
                <tr><td className="px-3 py-4 text-muted-text" style={stickyFirst}>No periods on record.</td></tr>
              ) : groups.map((grp, gi) => (
                <GroupBlock key={grp.group ?? `g${gi}`} group={grp.group} rows={grp.rows} cols={allCols}
                  stickyFirst={stickyFirst} annualLen={annualPeriods.length} quarterlyLen={quarterlyPeriods.length} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const GroupBlock: React.FC<{
  group?: string; rows: IndicatorRow[]; cols: PeriodKey[];
  stickyFirst: React.CSSProperties; annualLen: number; quarterlyLen: number;
}> = ({ group, rows, cols, stickyFirst, annualLen, quarterlyLen }) => (
  <>
    {group && (
      <tr>
        <td colSpan={cols.length + 1} className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ ...stickyFirst, position: undefined, background: 'rgba(45,212,191,0.06)', color: '#2DD4BF', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {group}
        </td>
      </tr>
    )}
    {rows.map((row, ri) => (
      <tr key={`${row.label}-${ri}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <td className={`py-1.5 text-left text-primary-text/90 ${group ? 'pl-6 pr-3' : 'px-3'}`} style={stickyFirst}>
          {row.label}{row.unit ? <span className="text-muted-text"> ({row.unit === '₹ crs' ? '₹ crs' : row.unit})</span> : ''}
        </td>
        {cols.map((p, i) => {
          const { text, negative } = fmt(row.values[p] ?? null, row.unit);
          const na = text === 'NA';
          return (
            <td key={p} className="px-3 py-1.5 text-right font-mono-nums whitespace-nowrap"
              style={{
                color: na ? '#5A6E6D' : negative ? WEAK : '#E9F3F1',
                borderLeft: (i === annualLen || i === annualLen + quarterlyLen) ? '1px solid rgba(255,255,255,0.06)' : undefined,
              }}>
              {text}
            </td>
          );
        })}
      </tr>
    ))}
  </>
);
