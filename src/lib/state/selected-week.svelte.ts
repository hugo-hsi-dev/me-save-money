import {
	endOfWeek,
	getLocalTimeZone,
	parseDate,
	startOfWeek,
	today
} from '@internationalized/date';
import { page } from '$app/state';

export function getSelectedWeek() {
	const isoFrom = $derived(page.url.searchParams.get('from'));
	const isoTo = $derived(page.url.searchParams.get('to'));

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
