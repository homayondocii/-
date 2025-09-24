// FIX: Created the TypeScript declaration file for 'jalali-moment' to resolve type errors
// and provide type safety for Jalali calendar functionalities.

declare module "jalali-moment" {
  import * as moment from "moment";
  
  export = moment;

  type JUnitOfTime = "jYear" | "jMonth";

  namespace moment {
    function jIsLeapYear(year: number): boolean;
    function jDaysInMonth(year: number, month: number): number;
    
    interface Moment {
      clone(): Moment;

      jYear(y: number): Moment;
      jYear(): number;

      jMonth(M: number | string): Moment;
      jMonth(): number;

      jDate(d: number): Moment;
      jDate(): number;

      jDayOfYear(d: number): Moment;
      jDayOfYear(): number;

      jWeek(w: number): Moment;
      jWeek(): number;

      jWeekYear(y: number): Moment;
      jWeekYear(): boolean;

      startOf(unit: JUnitOfTime): Moment;

      endOf(unit: JUnitOfTime): Moment;

      format(format?: string): string;
    }
  }
}
