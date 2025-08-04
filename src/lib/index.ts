// place files you want to import through the `$lib` alias in this folder.

export function formatRelativeDate(timestamp: string): string {
	const now = Date.now();
	const date = new Date(timestamp);
	const diff = Math.floor((now - date.getTime()) / 1000);

	if (diff < 60) return diff <= 10 ? 'few moments ago' : `${diff} seconds ago`;

	const minutes = Math.floor(diff / 60);
	if (minutes < 60) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;

	const days = Math.floor(hours / 24);
	if (days <= 3) return days === 1 ? '1 day ago' : `${days} days ago`;

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
export function sleep(ms: number = 3000): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export function getPreviousMonday(date: Date): Date {
  const result = new Date(date)
  const dayOfWeek = result.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  let daysToSubtract: number

  if (dayOfWeek === 1) {
    // If it's Monday and we want to include the same day, return the same Monday
    daysToSubtract = 0
  } else if (dayOfWeek === 0) {
    // If it's Sunday, go back 6 days to get Monday
    daysToSubtract = 6
  } else {
    // For Tuesday through Saturday, go back (dayOfWeek - 1) days
    daysToSubtract = dayOfWeek - 1
  }

  result.setDate(result.getDate() - daysToSubtract)
  return result
}
