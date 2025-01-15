import React, { useState, useEffect, useCallback, useMemo } from 'react';
    import { Calendar, Edit, BookOpen, CheckSquare, Sparkles, Plus } from 'lucide-react';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { formatDate, getCurrentWeekDates, getWeekNumber, getDateOfWeek, getTotalWeeks } from '../utils/dateUtils';
    import { DAYS } from '../constants/days';
    import { makeLinksClickable } from '../utils/linkUtils';

    interface WritingsProps {}

    export function Writings({ }: WritingsProps) {
      const { selectedDate, weekNumber, year, changeWeek } = useWeekSelection();
      const [selectedDay, setSelectedDay] = useState<number>(selectedDate.getDay());
      const weekDates = useMemo(() => getCurrentWeekDates(selectedDate), [selectedDate]);
      const currentDay = useMemo(() => DAYS[selectedDay], [selectedDay]);
      const currentDate = useMemo(() => formatDate(weekDates[selectedDay]), [weekDates, selectedDay]);

      const dateKey = useMemo(() => weekDates[selectedDay].toISOString().split('T')[0], [weekDates, selectedDay]);
      
      const [positiveNotes, setPositiveNotes] = useState<string[]>(() => {
        const savedNotes = localStorage.getItem(`positiveNotes-${dateKey}`);
        return savedNotes ? JSON.parse(savedNotes) : ['', '', '', '', ''];
      });
      const [freeWriting, setFreeWriting] = useState<string>(() => {
        return localStorage.getItem(`freeWriting-${dateKey}`) || '';
      });
      const [decisions, setDecisions] = useState<string>(() => {
        return localStorage.getItem(`decisions-${dateKey}`) || '';
      });

      useEffect(() => {
        const savedNotes = localStorage.getItem(`positiveNotes-${dateKey}`);
        setPositiveNotes(savedNotes ? JSON.parse(savedNotes) : ['', '', '', '', '']);
        setFreeWriting(localStorage.getItem(`freeWriting-${dateKey}`) || '');
        setDecisions(localStorage.getItem(`decisions-${dateKey}`) || '');
      }, [dateKey]);

      useEffect(() => {
        localStorage.setItem(`positiveNotes-${dateKey}`, JSON.stringify(positiveNotes));
      }, [positiveNotes, dateKey]);

      useEffect(() => {
        localStorage.setItem(`freeWriting-${dateKey}`, freeWriting);
      }, [freeWriting, dateKey]);

      useEffect(() => {
        localStorage.setItem(`decisions-${dateKey}`, decisions);
      }, [decisions, dateKey]);

      const handlePositiveNoteChange = useCallback((index: number, value: string) => {
        const newNotes = [...positiveNotes];
        newNotes[index] = value;
        setPositiveNotes(newNotes);
      }, [positiveNotes, setPositiveNotes]);

      const handleFreeWritingChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFreeWriting(e.target.value);
      }, [setFreeWriting]);

      const handleDecisionsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDecisions(e.target.value);
      }, [setDecisions]);

      const handleDayChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(parseInt(e.target.value));
      }, [setSelectedDay]);

      const handleWeekChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        changeWeek(parseInt(e.target.value), year);
      }, [changeWeek, year]);

      const currentYear = new Date().getFullYear();
      const totalWeeks = useMemo(() => getTotalWeeks(currentYear), [currentYear]);

      const handleAddPositiveNote = useCallback(() => {
        setPositiveNotes(prevNotes => [...prevNotes, '']);
      }, [setPositiveNotes]);

      return (
        <div className="p-4 md:p-6 bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 rounded-lg shadow-lg text-white space-y-6" dir="rtl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2 md:mb-0 animate-fade-in">
              <BookOpen size={32} />
              صفحة المدوّنات
            </h2>
            <div className="text-xl font-medium flex flex-col md:flex-row items-center gap-2 animate-fade-in">
              <Calendar size={20} className="inline-block align-middle ml-1" />
              <div className="relative">
                <select
                  value={weekNumber}
                  onChange={handleWeekChange}
                  className="bg-black/20 text-white rounded-lg px-2 py-1 border border-white/10 focus:border-white focus:ring-1 focus:ring-white text-sm md:text-base appearance-none pr-8"
                >
                  {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => (
                    <option key={week} value={week}>الأسبوع {week}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              <div className="relative mt-2 md:mt-0">
                <select
                  value={selectedDay}
                  onChange={handleDayChange}
                  className="bg-black/20 text-white rounded-lg px-2 py-1 border border-white/10 focus:border-white focus:ring-1 focus:ring-white text-sm md:text-base appearance-none pr-8"
                >
                  {DAYS.map((day, index) => (
                    <option key={index} value={index}>
                      {day} - {formatDate(weekDates[index])}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-black/20 p-4 md:p-6 rounded-lg animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium text-amber-400 flex items-center gap-2">
                <Sparkles size={24} />
                من نِعَم الله عليّ اليوم:
              </h3>
              <button
                onClick={handleAddPositiveNote}
                className="bg-amber-400 hover:bg-amber-500 text-black p-1 rounded-md flex items-center justify-center gap-2"
              >
                <Plus size={16} />
              </button>
            </div>
            <ul className="list-disc list-inside space-y-2">
              {positiveNotes.map((note, index) => (
                <li key={index} className="animate-row-in">
                  <textarea
                    value={note}
                    onChange={(e) => handlePositiveNoteChange(index, e.target.value)}
                    className="w-full p-1 rounded bg-black/20 border border-white/10 text-white text-sm"
                    rows={1}
                    placeholder={`اكتب هنا النقطة ${index + 1}`}
                    dir="rtl"
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-black/20 p-4 md:p-6 rounded-lg animate-fade-in">
            <h3 className="text-xl font-medium text-amber-400 mb-4 flex items-center gap-2">
              <Edit size={24} />
              الكتابة الحرة
            </h3>
            <textarea
              value={freeWriting}
              onChange={handleFreeWritingChange}
              className="w-full p-2 rounded bg-black/20 border border-white/10 text-white text-sm"
              rows={4}
              placeholder="اكتب هنا أفكارك ومشاعرك"
              dir="rtl"
            />
          </div>
          <div className="bg-black/20 p-4 md:p-6 rounded-lg animate-fade-in">
            <h3 className="text-xl font-medium text-amber-400 mb-4 flex items-center gap-2">
              <CheckSquare size={24} />
              القرارات
            </h3>
            <textarea
              value={decisions}
              onChange={handleDecisionsChange}
              className="w-full p-2 rounded bg-black/20 border border-white/10 text-white text-sm"
              rows={4}
              placeholder="اكتب هنا القرارات التي اتخذتها"
              dir="rtl"
            />
          </div>
        </div>
      );
    }
