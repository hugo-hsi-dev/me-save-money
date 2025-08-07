import {
	endOfWeek,
	getLocalTimeZone,
	parseDate,
	startOfWeek,
	today
} from '@internationalized/date';

export function getSelectedWeek(searchParams: URLSearchParams) {
	const isoFrom = searchParams.get('from');
	const isoTo = searchParams.get('to');

	return {
		get from() {
			if (!isoFrom || !isoTo) {
				return startOfWeek(today(getLocalTimeZone()), getLocalTimeZone(), 'mon');
			}
			return parseDate(isoFrom);
		},
		get to() {
			if (!isoFrom || !isoTo) {
				return endOfWeek(today(getLocalTimeZone()), getLocalTimeZone(), 'mon');
			}
			return parseDate(isoTo);
		}
	};
}
