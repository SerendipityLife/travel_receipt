'use client';

import { useMemo, useState } from 'react';

export interface DateRangePickerProps {
  start?: string; // YYYY-MM-DD
  end?: string;   // YYYY-MM-DD
  onChange: (start: string, end: string) => void;
  className?: string;
}

function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseYMD(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split('-').map((v) => Number(v));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export default function DateRangePicker({ start, end, onChange, className }: DateRangePickerProps) {
  const today = new Date();
  const initial = start ? parseYMD(start)! : new Date(today.getFullYear(), today.getMonth(), 1);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth()); // 0-11

  const startDate = parseYMD(start || '');
  const endDate = parseYMD(end || '');

  const firstDay = new Date(viewYear, viewMonth, 1);
  const firstWeekday = firstDay.getDay(); // 0 Sun - 6 Sat
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = useMemo(() => {
    const items: Array<{ key: string; date: Date | null }> = [];
    const leading = firstWeekday;
    for (let i = 0; i < leading; i++) items.push({ key: `empty-prev-${i}`, date: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(viewYear, viewMonth, d);
      items.push({ key: toYMD(dt), date: dt });
    }
    // ensure 6x7 grid for consistent height
    while (items.length % 7 !== 0) items.push({ key: `empty-next-${items.length}`, date: null });
    return items;
  }, [firstWeekday, daysInMonth, viewYear, viewMonth]);

  const moveMonth = (diff: number) => {
    const next = new Date(viewYear, viewMonth + diff, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const isSameDay = (a: Date | null, b: Date | null) => {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  const isBetween = (d: Date, s: Date | null, e: Date | null) => {
    if (!s || !e) return false;
    const x = d.getTime();
    return x >= s.getTime() && x <= e.getTime();
  };

  const handlePick = (d: Date) => {
    if (!startDate || (startDate && endDate)) {
      onChange(toYMD(d), '');
      return;
    }
    // start exists but end empty
    if (d.getTime() < startDate.getTime()) {
      onChange(toYMD(d), toYMD(startDate));
    } else if (d.getTime() === startDate.getTime()) {
      onChange(toYMD(d), toYMD(d));
    } else {
      onChange(toYMD(startDate), toYMD(d));
    }
  };

  const weeksLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <button className="px-2 py-1 rounded-lg border text-sm" onClick={() => moveMonth(-1)}>
          이전달
        </button>
        <div className="font-semibold">
          {viewYear}년 {viewMonth + 1}월
        </div>
        <button className="px-2 py-1 rounded-lg border text-sm" onClick={() => moveMonth(1)}>
          다음달
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
        {weeksLabels.map((w) => (
          <div key={w} className="text-center py-1">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map(({ key, date }) => {
          if (!date) return <div key={key} className="h-10" />;
          const selectedStart = isSameDay(date, startDate);
          const selectedEnd = isSameDay(date, endDate);
          const inRange = isBetween(date, startDate, endDate);
          const base = 'h-10 rounded-lg text-sm flex items-center justify-center cursor-pointer';
          const style = selectedStart || selectedEnd
            ? 'bg-blue-600 text-white'
            : inRange
              ? 'bg-blue-100 text-blue-700'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50';
          return (
            <button key={key} onClick={() => handlePick(date)} className={`${base} ${style}`}>
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}


