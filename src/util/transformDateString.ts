export default function TransformDateString({
	dateValue,
	plusDate,
}: {
	dateValue: Date;
	plusDate?: number;
}) {
	const year = dateValue.getFullYear().toString();
	const month = (dateValue.getMonth() + 1).toString();
	const date = plusDate
		? (dateValue.getDate() + plusDate).toString()
		: dateValue.getDate().toString();

	const twodigitMonth = month.length < 2 ? "0" + month : month;
	const twoDigitDate = date.length < 2 ? "0" + date : date;

	const result = `${year}-${twodigitMonth}-${twoDigitDate}`;
	return result;
}

export function TransformDateTime(dateValue: Date) {
	const dateString = TransformDateString({ dateValue, plusDate: 3 });
	const hour =
		dateValue.getHours() > 9
			? dateValue.getHours()
			: "0" + dateValue.getHours();
	const minutes =
		dateValue.getMinutes() > 9
			? dateValue.getMinutes()
			: "0" + dateValue.getMinutes();

	return dateString + `T${hour}:${minutes}`;
}
