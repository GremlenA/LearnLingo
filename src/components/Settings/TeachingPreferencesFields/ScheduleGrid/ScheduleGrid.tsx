import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import css from './ScheduleGrid.module.css';

const DAYS = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

const TIME_SLOTS = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];

export const ScheduleGrid = () => {
  const { control } = useFormContext();

  return (
    <div className={css.scheduleCard}>
      <div className={css.header}>
        <h2 className={css.title}>Availability & Schedule</h2>
        <span className={css.subtitle}>Tap a slot to mark it as available</span>
      </div>

      <Controller
        name="availability"
        control={control}
        render={({ field }) => {
          // field.value содержит текущий объект расписания, например: { monday: ['09:00'], ... }
          const schedule = field.value || {};

          // Функция переключения слота
          const toggleSlot = (dayKey: string, time: string) => {
            const currentDaySlots = schedule[dayKey] || [];
            
            // Если время уже есть в массиве — удаляем его, если нет — добавляем
            const newDaySlots = currentDaySlots.includes(time)
              ? currentDaySlots.filter((slot: string) => slot !== time)
              : [...currentDaySlots, time];

            // Обновляем весь объект availability и передаем в форму
            field.onChange({
              ...schedule,
              [dayKey]: newDaySlots,
            });
          };

          return (
            <div className={css.gridWrapper}>
              <div className={css.grid}>
                {DAYS.map((day) => (
                  <div key={day.key} className={css.dayColumn}>
                    <span className={css.dayLabel}>{day.label}</span>
                    
                    <div className={css.slotsWrapper}>
                      {TIME_SLOTS.map((time) => {
                        // Проверяем, выбран ли этот слот в текущий день
                        const isSelected = (schedule[day.key] || []).includes(time);
                        
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => toggleSlot(day.key, time)}
                            className={`${css.slotBtn} ${isSelected ? css.selected : css.unselected}`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};