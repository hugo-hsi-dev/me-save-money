import { getLocalTimeZone, startOfWeek, today } from '@internationalized/date';
import { getContext, setContext } from 'svelte';

const KEY = Symbol('selected-week');

class SelectedWeekState {
	calendarDate = $state(startOfWeek(today(getLocalTimeZone()), getLocalTimeZone(), 'mon'));
	nativeDate = $derived(this.calendarDate.toDate(getLocalTimeZone()));
}

export const setSelectedWeekContext = () =>
	setContext<SelectedWeekState>(KEY, new SelectedWeekState());

export const getSelectedWeekContext = () => getContext<SelectedWeekState>(KEY);

// export function getSelectedWeek(searchParams: URLSearchParams) {
// 	const isoFrom = searchParams.get('from');
// 	const isoTo = searchParams.get('to');

// 	return {
// 		get from() {
// 			if (!isoFrom || !isoTo) {
// 				return startOfWeek(today(getLocalTimeZone()), getLocalTimeZone(), 'mon');
// 			}
// 			return parseDate(isoFrom);
// 		},
// 		get to() {
// 			if (!isoFrom || !isoTo) {
// 				return endOfWeek(today(getLocalTimeZone()), getLocalTimeZone(), 'mon');
// 			}
// 			return parseDate(isoTo);
// 		}
// 	};
// }
