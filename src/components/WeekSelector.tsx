import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getWeekNumber, getTotalWeeks } from '../utils/dateUtils';

interface WeekSelectorProps {
  currentDate: Date;
  onWeekChange: (weekNum: number, year: number) => void;
}

export function WeekSelector({ currentDate, onWeekChange }: WeekSelectorProps) {
  const weekNumber = getWeekNumber(currentDate);
  const year = currentDate.getFullYear();
  const totalWeeks = getTotalWeeks(year);
  
  const handlePrevWeek = () => {
    if (weekNumber === 1) {
      // Go to last week of previous year
      const prevYear = year - 1;
      const lastWeek = getTotalWeeks(prevYear);
      onWeekChange(lastWeek, prevYear);
    } else {
      onWeekChange(weekNumber - 1, year);
    }
  };

  const handleNextWeek = () => {
    if (weekNumber === totalWeeks) {
      // Go to first week of next year
      onWeekChange(1, year + 1);
    } else {
      onWeekChange(weekNumber + 1, year);
    }
  };

  const handleWeekSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWeek = parseInt(event.target.value);
    onWeekChange(selectedWeek, year);
  };

  const handleYearSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(event.target.value);
    onWeekChange(weekNumber, selectedYear);
  };

  // Generate year options (current year ± 2 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => year - 2 + i);

  return (
    <div className="flex items-center justify-center gap-4 mb-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-4 rounded-lg shadow-lg">
      <button
        onClick={handlePrevWeek}
        className="p-2 rounded-full hover:bg-white/10 text-pink-400 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
      
      <div className="flex items-center gap-3">
        <Calendar className="text-purple-400" size={20} />
        <select
          value={weekNumber}
          onChange={handleWeekSelect}
          className="bg-black/20 text-purple-400 rounded-lg px-3 py-1 border border-purple-400/20 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
        >
          {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => (
            <option key={week} value={week}>Week {week}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={handleYearSelect}
          className="bg-black/20 text-purple-400 rounded-lg px-3 py-1 border border-purple-400/20 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
        >
          {yearOptions.map(yearOption => (
            <option key={yearOption} value={yearOption}>{yearOption}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleNextWeek}
        className="p-2 rounded-full hover:bg-white/10 text-pink-400 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  );
}
