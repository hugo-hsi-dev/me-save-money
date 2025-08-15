<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Chart from "$lib/components/ui/chart/index.js";
	import { getBudgetByAppliesTo } from "$lib/remote/budget.remote";
	import { getAmountSpentPerWeek } from "$lib/remote/transaction.remote";
	import { getLocalTimeZone } from "@internationalized/date";
    import { scaleBand } from "d3-scale";
    import { BarChart, type ChartContextValue } from "layerchart";
    import { cubicInOut } from "svelte/easing";
	import * as Select from "../ui/select";
	import { getSelectedWeekContext } from "$lib/state/selected-week.svelte";

    let context = $state<ChartContextValue>();

    const getSpent = async () => {
        // Fetch the spent amount for the week
        const years = await getAmountSpentPerWeek(getLocalTimeZone());
        const data = await Promise.all(years.map(async (data) => {
            return {
                weeks: await Promise.all(data.weeks.map(async (week) => ({
                    week: week.week,
                    budget: Number(await (async () => {
                        const budget = await getBudgetByAppliesTo(week.week);
                        return budget ? budget.amount : "0";
                        })()),
                    cost: Number(week.amount)
                }))),
                year: data.year
            };
        }));
        return data ? data[0].weeks : [];
    };

    let week = getSelectedWeekContext().nativeDate;

    const filteredData = async ({timeRange}:{timeRange: string}) => {
        const data = await getSpent()
        const filtered = data.filter((item) => {
            const referenceDate = new Date(week.toString());
            let daysToSubtract = 180;
            if (timeRange === "90d") {
                daysToSubtract = 90;
            } else if (timeRange === "30d") {
                daysToSubtract = 30;
            } else if (timeRange === "14d") {
                daysToSubtract = 2;
            }
            referenceDate.setDate(referenceDate.getDate() - daysToSubtract);
            console.log(item.week, referenceDate, new Date(week.toString()), week);
            return item.week >= referenceDate;
        });
        return filtered;
    };

    const chartConfig = {
        budget: {
            label: "Budget",
            color: "#60a5f5"
        },
        cost: {
            label: "Cost",
            color: "#FF0000"
        },
    } satisfies Chart.ChartConfig;

    let timeRange = $state("180d");

    const selectedLabel = $derived.by(() => {
        switch (timeRange) {
            case "180d":
                return "Last 6 months";
            case "90d":
                return "Last 3 months";
            case "30d":
                return "Last 30 days";
            case "14d":
                return "Last 2 weeks";
            default:
                return "Last 6 months";
        }
    });
</script>
 
<Card.Root>
    <Card.Header class="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div class="grid flex-1 gap-1 text-center sm:text-left">
        <Card.Title>Budget Used Over Time</Card.Title>
        </div>
        <Select.Root type="single" bind:value={timeRange}>
        <Select.Trigger class="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            {selectedLabel}
        </Select.Trigger>
        <Select.Content class="rounded-xl">
            <Select.Item value="180d" class="rounded-lg">Last 6 months</Select.Item>
            <Select.Item value="90d" class="rounded-lg">Last 3 months</Select.Item>
            <Select.Item value="30d" class="rounded-lg">Last 30 days</Select.Item>
            <Select.Item value="14d" class="rounded-lg">Last 2 weeks</Select.Item>
        </Select.Content>
        </Select.Root>
    </Card.Header>
    <Card.Content>
        <svelte:boundary>
            {#await filteredData({timeRange})}
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
                        key: "budget",
                        label: "Budget",
                        color: chartConfig.budget.color,
                    },
                    {
                        key: "cost",
                        label: "Cost",
                        color: chartConfig.cost.color,
                    },
                    ]}
                    seriesLayout="overlap"
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
                            dateStyle: "short"
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
                        <Chart.Tooltip
                            labelFormatter={(d) =>
                            new Date(d).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        />
                    {/snippet}
                </BarChart>
                </Chart.Container>
    
            {:catch error}
                <div>Error: {error.message}</div>
            {/await}
        </svelte:boundary>
    </Card.Content>
</Card.Root>