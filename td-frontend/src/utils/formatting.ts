import moment from 'moment';
import { isNull } from './utility';

export const formatDate = (n?: Date): string =>
   !isNull(n) && moment.utc(n).isValid() ? moment.utc(n).format('Do MMMM  YYYY') : '';

export const isDatePassed = (n?: Date): boolean => moment.utc(n).isBefore(moment.utc(), 'day');

export const stringToDate = (n?: string | Date): Date => {
   if (!n) return new Date();
   // If it's already a Date object, return it
   if (n instanceof Date) return n;
   // If it's a string, extract just the date part (YYYY-MM-DD) to avoid timezone issues
   if (typeof n === 'string') {
      const datePart = n.split('T')[0];
      return moment.utc(datePart).toDate();
   }
   return new Date();
};

export const getCurrentDate = (): string => moment().format('YYYY-MM-DD');

/**
 * Converts a date to a Date object at midnight UTC to preserve the selected date regardless of timezone.
 * This ensures that when a user selects a date (e.g., December 18th), it's preserved as that exact date.
 * @param date - Date object, string, or null/undefined
 * @returns Date object at midnight UTC, or null if date is null/undefined
 */
export const dateToMidnightUTC = (date?: Date | string | null): Date | null => {
   if (!date) return null;
   
   // Convert to Date object if it's a string
   const dateObj = date instanceof Date ? date : new Date(date);
   
   // Extract date components (year, month, day) from the date
   // This preserves the selected date regardless of timezone
   const year = dateObj.getFullYear();
   const month = dateObj.getMonth();
   const day = dateObj.getDate();
   
   // Create new date at midnight UTC using the extracted components
   return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
};

/**
 * Converts a date to ISO string at midnight UTC to preserve the selected date regardless of timezone.
 * This ensures that when a user selects a date (e.g., December 18th), it's sent to the backend as that exact date.
 * @param date - Date object, string, or null/undefined
 * @returns ISO string at midnight UTC, or undefined if date is null/undefined
 */
export const dateToMidnightUTCISO = (date?: Date | string | null): string | undefined => {
   const dateAtMidnightUTC = dateToMidnightUTC(date);
   return dateAtMidnightUTC ? dateAtMidnightUTC.toISOString() : undefined;
};
