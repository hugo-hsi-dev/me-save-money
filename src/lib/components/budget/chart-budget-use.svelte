<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Chart from "$lib/components/ui/chart/index.js";
	import { getBudgetByAppliesTo } from "$lib/remote/budget.remote";
	import { getAmountSpentPerWeek } from "$lib/remote/transaction.remote";
	import { getLocalTimeZone } from "@internationalized/date";
    import { scaleBand } from "d3-scale";
    import { BarChart, type ChartContextValue } from "layerchart";
    import { cubicInOut } from "svelte/easing";

    let context = $state<ChartContextValue>();

    const getSpent = async () => {
        // Fetch the spent amount for the week
        const years = await getAmountSpentPerWeek(getLocalTimeZone());
        const data = await Promise.all(years.map(async (data) => {
            return {
                weeks: await Promise.all(data.weeks.map(async (week) => ({
                    week: week.week,
                    budget: Math.max(0, Number(await (async () => {
                        const budget = await getBudgetByAppliesTo(week.week);
                        return budget ? budget.amount : "0";
                        })()) - Number(week.amount)),
                    cost: Number(week.amount)
                }))),
                year: data.year
            };
        }));
        console.log(data)
        return data[0].weeks;
    };
    
    const chartConfig = {
        cost: {
            label: "Cost",
            color: "#FF0000"
        },
        budget: {
            label: "Budget",
            color: "#60a5f5"
        }
    } satisfies Chart.ChartConfig;
</script>
 
<Card.Root>
    <Card.Header>
        <Card.Title>Budget Over Time</Card.Title>
    </Card.Header>
    <Card.Content>
        <svelte:boundary>
            {#await getSpent()}
                <p>Loading</p>
            {:then chartData}
    
                <Chart.Container config={chartConfig}>
                <BarChart
                    data={chartData}
                    xScale={scaleBand().padding(0.25)}
                    x="week"
                    axis="x"
                    rule={false}
                    series={[
                    {
                        key: "cost",
                        label: "Cost",
                        color: chartConfig.cost.color,
                        props: { rounded: "bottom" },
                    },
                    {
                        key: "budget",
                        label: "Budget",
                        color: chartConfig.budget.color,
                    },
                    ]}
                    seriesLayout="stack"
                    grid={false}
                    highlight={false}
                    props={{
                    bars: {
                        stroke: "none",
                        initialY: context?.height,
                        initialHeight: 0,
                        motion: {
                        y: { type: "tween", duration: 500, easing: cubicInOut },
                        height: { type: "tween", duration: 500, easing: cubicInOut },
                        },
                    },
                    xAxis: {
                        format: (d) =>
                        new Date(d).toLocaleDateString("en-US", {
                            weekday: "short",
                        }),
                        tickLabelProps: {
                        svgProps: {
                            y: 13,
                        },
                        },
                    },
                    }}
                >
                    {#snippet tooltip()}
                        <Chart.Tooltip />
                    {/snippet}
                </BarChart>
                </Chart.Container>
    
            {:catch error}
                <div>Error: {error.message}</div>
            {/await}
        </svelte:boundary>
    </Card.Content>
</Card.Root>