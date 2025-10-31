import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

function LiveEarning() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [currentEarnings, setCurrentEarnings] = useState(1000);
  const currentEarningsRef = useRef(currentEarnings);

  const baseEarnings = 1000;

  useEffect(() => {
    currentEarningsRef.current = currentEarnings;
  }, [currentEarnings]);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(34,197,94,0.4)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "",
            data: [],
            borderColor: "#10b981",
            backgroundColor: gradient,
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointBackgroundColor: "#10b981",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });

    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const random = Math.random();
      let percentChange = 0;

      if (random < 0.55) percentChange = Math.random() * 4 + 1;
      else if (random < 0.8) percentChange = -(Math.random() * 2 + 0.5);

      const projected =
        currentEarningsRef.current +
        currentEarningsRef.current * (percentChange / 100);
      const maxLimit = baseEarnings * 1.05;
      const minLimit = baseEarnings * 0.95;

      if (projected >= minLimit && projected <= maxLimit) {
        setCurrentEarnings(parseFloat(projected.toFixed(2)));
        const chart = chartInstance.current;
        if (chart) {
          chart.data.labels.push(now);
          chart.data.datasets[0].data.push(projected);

          if (chart.data.labels.length > 50) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
          }

          chart.update("none"); // Use 'none' for better performance
        }
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: "90vh",
        width: "100%",
        background: "#1e293b",
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
}

export default LiveEarning;
