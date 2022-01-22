import { RecurringFundingFrequency } from '../../user-recurring-funding-setting/entities/userRecurringFundingSetting.entity';

export const calcNextExecutionDate = (
  frequency: RecurringFundingFrequency,
  day?: number
): Date => {
  switch (frequency) {
    case RecurringFundingFrequency.Daily:
      return addDays(new Date().toUTCString(), 1);
    case RecurringFundingFrequency.Weekly:
      return getNextDate(day);
    case RecurringFundingFrequency.Biweekly:
      return addDays(getNextDate(day).toUTCString(), 7);
    case RecurringFundingFrequency.Monthly:
      return getNextMonthDay(new Date(), day);
    default:
      return new Date();
  }
};

export const addDays = (currentDate: string, days: number): Date => {
  const result = new Date(currentDate);
  result.setDate(result.getDate() + days);
  return result;
};

export const getNextDate = (dayOfWeek: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + ((((7 - d.getDay()) % 7) + dayOfWeek) % 7));
  return d;
};

export const getNextMonthDay = (currentDate: Date, day: number): Date => {
  if (new Date().getUTCDay() < day) {
    return new Date(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      day
    );
  }
  if (currentDate.getUTCMonth() === 11) {
    return new Date(currentDate.getUTCFullYear() + 1, 0, day);
  }
  return new Date(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth() + 1,
    day
  );
};
