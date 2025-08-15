<script lang="ts">
    import * as Chart from "$lib/components/ui/chart/index.js";
	import { getBudgetByAppliesTo } from "$lib/remote/budget.remote";
	import { getAmountSpentPerWeek } from "$lib/remote/transaction.remote";
	import { getLocalTimeZone } from "@internationalized/date";
    import { scaleBand } from "d3-scale";
    import { BarChart } from "layerchart";

    const getSpent = async () => {
        // Fetch the spent amount for the week
        const years = await getAmountSpentPerWeek(getLocalTimeZone());
        const data = await Promise.all(years.map(async (data) => {
            return {
                weeks: await Promise.all(data.weeks.map(async (week) => ({
                    week: week.week,
                    budget: await (async () => {
                        const budget = await getBudgetByAppliesTo(week.week);
                        return budget ? budget.amount : "0";
                        })(),
                    cost: week.amount
                }))),
                year: data.year
            };
        }));
        return data[0].weeks;
    };
    
    const chartConfig = {
        budget: {
            label: "Budget",
            color: "#2563eb"
        },
        cost: {
            label: "Cost",
            color: "#60a5fa"
        }
    } satisfies Chart.ChartConfig;
</script>
 
<Chart.Container config={chartConfig} class="min-h-[100px] w-full">
    <svelte:boundary>
        {#await getSpent()}
            <p>Loading</p>
        {:then chartData}
                <BarChart
                data={chartData}
                xScale={scaleBand().padding(0.25)}
                x="week"
                axis="x"
                y="cost"
                seriesLayout="group"
                tooltip={false}
                series={[
                {
                    key: "budget",
                    label: chartConfig.budget.label,
                    color: chartConfig.budget.color
                },
                {
                    key: "cost",
                    label: chartConfig.cost.label,
                    color: chartConfig.cost.color
                }
                ]}
                />
        {:catch error}
            <div>Error: {error.message}</div>
        {/await}
    </svelte:boundary>

</Chart.Container>