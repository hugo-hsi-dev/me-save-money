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
