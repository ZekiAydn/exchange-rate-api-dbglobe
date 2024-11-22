import {computed} from "vue";

export const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: getComputedStyle(document.documentElement).getPropertyValue(
                    "--text-color"
                ),
                font: {
                    size: 14,
                },
            },
        },
    },
    scales: {
        x: {
            ticks: {
                color: getComputedStyle(document.documentElement).getPropertyValue(
                    "--text-color"
                ),
            },
            grid: {
                color: getComputedStyle(document.documentElement).getPropertyValue(
                    "--border-color"
                ),
            },
        },
        y: {
            ticks: {
                color: getComputedStyle(document.documentElement).getPropertyValue(
                    "--text-color"
                ),
            },
            grid: {
                color: getComputedStyle(document.documentElement).getPropertyValue(
                    "--border-color"
                ),
            },
        },
    },
}));
