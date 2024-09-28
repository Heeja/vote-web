export default function TransformDateString(dateTypeValue: Date) {
	const year = dateTypeValue.getFullYear().toString();
	const month = dateTypeValue.getMonth().toString();
	const date = dateTypeValue.getDate().toString();

	const twodigitMonth = month.length < 2 ? "0" + month : month;
	const twoDigitDate = date.length < 2 ? "0" + date : date;

	const result = `${year}-${twodigitMonth}-${twoDigitDate}`;
	return result;
}
