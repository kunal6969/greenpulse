import React, { useContext } from 'react';
import { Play, Pause, Calendar, Clock } from 'lucide-react';
import { SimulationContext } from '../../contexts/SimulationContext';

// Helper to format Date to YYYY-MM-DD for the date input
const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    // Adjust for timezone offset to display the correct local date in the input
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
};

// Helper to format Date to HH:mm for the time input
const formatTimeForInput = (date: Date | null): string => {
    if (!date) return '';
    // Adjust for timezone offset to display the correct local time in the input
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[1].slice(0, 5);
};

const TimeControl: React.FC = () => {
  const { simulationTime, isPaused, togglePlayPause, setSpecificTime, dataStartDate, dataEndDate } = useContext(SimulationContext);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateValue = e.target.value;
    if (!newDateValue) return;

    // Create a new Date from current time to preserve hours/minutes
    const newDate = new Date(simulationTime.getTime());
    
    // Split 'YYYY-MM-DD' and apply it to the new Date object
    const [year, month, day] = newDateValue.split('-').map(Number);
    
    // Set parts; month is 0-indexed in JavaScript's Date
    newDate.setFullYear(year, month - 1, day);

    if (!isNaN(newDate.getTime())) {
      setSpecificTime(newDate);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeValue = e.target.value;
    if (!newTimeValue) return;
    
    // Create a new Date from current time to preserve year/month/day
    const newDate = new Date(simulationTime.getTime());

    // Split 'HH:mm' and apply it
    const [hour, minute] = newTimeValue.split(':').map(Number);

    // Set parts, resetting seconds/ms for clean, hourly data
    newDate.setHours(hour, minute, 0, 0);

    if (!isNaN(newDate.getTime())) {
      setSpecificTime(newDate);
    }
  };

  return (
    <div className="flex items-center flex-wrap justify-end gap-2 bg-bg-secondary p-2 rounded-lg border border-border-color">
      <button 
        onClick={togglePlayPause} 
        className="p-2 text-primary hover:bg-primary/20 rounded-md transition-colors"
        aria-label={isPaused ? 'Play simulation' : 'Pause simulation'}
      >
        {isPaused ? <Play size={20} /> : <Pause size={20} />}
      </button>
      <div className="flex items-center space-x-2">
        <Calendar size={18} className="text-text-secondary"/>
        <input 
          type="date"
          value={formatDateForInput(simulationTime)}
          onChange={handleDateChange}
          min={formatDateForInput(dataStartDate)}
          max={formatDateForInput(dataEndDate)}
          className="bg-transparent text-text-primary text-sm font-mono focus:outline-none w-auto"
          disabled={!dataStartDate || !dataEndDate}
          aria-label="Select date"
        />
      </div>
      <div className="flex items-center space-x-2">
         <Clock size={18} className="text-text-secondary"/>
         <input 
          type="time"
          value={formatTimeForInput(simulationTime)}
          onChange={handleTimeChange}
          className="bg-transparent text-text-primary text-sm font-mono focus:outline-none w-auto"
          disabled={!dataStartDate || !dataEndDate}
          aria-label="Select time"
        />
      </div>
    </div>
  );
};

export default TimeControl;