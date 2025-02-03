/**
 * Function that returns difference in seconds from two dates
 * @param date1 First date to compare
 * @param date2 Second date to compare
 * @returns number Seconds difference
 */
export function secondsDifference(date1:Date, date2:Date){
    var diff = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(diff / 1000);
}

/**
 * Function that returns difference in minutes from two dates
 * @param date1 First date to compare
 * @param date2 Second date to compare
 * @returns number Minutes difference
 */
export function minutesDifference(date1:Date, date2:Date){
    var diff = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(diff / (1000 * 60));
}

/**
 * Function that returns difference in days from two dates
 * @param date1 First date to compare
 * @param date2 Second date to compare
 * @returns number Minutes difference
 */
export function daysDifference(date1:Date, date2:Date){
    var diff = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(diff / (1000 * 3600 * 24));
}