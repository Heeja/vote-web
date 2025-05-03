export const end = new Date("9999-12-31T23:59:59.999Z");
export const today = new Date();
// 날짜 계산 함수
export const addDays = (days: number) => {
	const date = new Date(today);
	date.setDate(date.getDate() + days);
	return date;
};

export const addMonths = (months: number) => {
	const date = new Date(today);
	date.setMonth(date.getMonth() + months);
	return date;
};

export const addYears = (years: number) => {
	const date = new Date(today);
	date.setFullYear(date.getFullYear() + years);
	return date;
};

export const tomorrow = () => addDays(1);
export const dayAfterTomorrow = () => addDays(2);
export const oneWeekLater = () => addDays(7);
export const twoWeeksLater = () => addDays(14);
export const oneMonthLater = () => addMonths(1);
export const threeMonthsLater = () => addMonths(3);
export const sixMonthsLater = () => addMonths(6);
export const oneYearLater = () => addYears(1);
