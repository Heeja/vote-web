export default function TransformDateString(
	dateValue: Date,
	type?: "fullYear" | "two-digit"
) {
	const year = dateValue.getFullYear().toString();
	const month = (dateValue.getMonth() + 1).toString();
	const date = dateValue.getDate().toString();
	// plusDate
	// 	? (dateValue.getDate() + plusDate).toString()
	// 	: dateValue.getDate().toString();

	const twodigitMonth = month.length < 2 ? "0" + month : month;
	const twoDigitDate = date.length < 2 ? "0" + date : date;

	const result = `${
		type === "two-digit" ? year.slice(2) : year
	}-${twodigitMonth}-${twoDigitDate}`;
	return result;
}
function TimeString(dateValue: Date) {
	const hour =
		dateValue.getHours() > 9
			? dateValue.getHours()
			: "0" + dateValue.getHours();
	const minutes =
		dateValue.getMinutes() > 9
			? dateValue.getMinutes()
			: "0" + dateValue.getMinutes();

	return { hour, minutes };
}

export function TransformDateTime(dateValue: Date) {
	const dateString = TransformDateString(dateValue);
	const { hour, minutes } = TimeString(dateValue);

	return dateString + `T${hour}:${minutes}`;
}

export function TransformDateTimeString(dateValue: Date) {
	const dateString = TransformDateString(dateValue);
	const { hour, minutes } = TimeString(dateValue);

	return `${dateString} ${hour}:${minutes}`;
}
