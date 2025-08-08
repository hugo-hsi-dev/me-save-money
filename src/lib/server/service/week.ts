export class WeekService {
	// Groups the data by year and nests the data one layer down
	groupAmountSpentByYear(
		data: {
			amount: string;
			week: Date;
		}[]
	) {
		const groupedByYear = data.reduce(
			(acc: { weeks: { amount: string; week: Date }[]; year: number }[], curr) => {
				const year = new Date(curr.week).getFullYear();
				const existingYear = acc.find((y) => y.year === year);

				if (existingYear) {
					existingYear.weeks.push({
						amount: curr.amount?.toString() || '0',
						week: new Date(curr.week)
					});
				} else {
					acc.push({
						weeks: [
							{
								amount: curr.amount?.toString() || '0',
								week: new Date(curr.week)
							}
						],
						year
					});
				}

				return acc;
			},
			[]
		);
		return groupedByYear;
	}

	// Sorts the output of group amount by year
	sortGroupedAmountSpentByYear(
		data: {
			weeks: {
				amount: string;
				week: Date;
			}[];
			year: number;
		}[]
	) {
		const sortedData = data
			.sort((a, b) => b.year - a.year)
			.map((yearData) => ({
				...yearData,
				weeks: yearData.weeks.sort((a, b) => b.week.getTime() - a.week.getTime())
			}));

		return sortedData;
	}
}
