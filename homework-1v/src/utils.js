export const ONE_DAY_MILLISECONDS = 86400000;
export const now = () => Date.now() + process.env.OFFSET_DAYS  * 24 * 60 * 60 * 1000;
export const getRecentByDays = (dates, days) => dates.filter(date => (now() - date) <= ONE_DAY_MILLISECONDS * days - 1).length;
