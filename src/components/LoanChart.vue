<template>
    <div class="chart-container loan">
      <h1 style="text-align: center; margin-bottom: -5px;">Purpose of Loans</h1>
      <div class="pie-chart">
        <Pie :data="pieChartData" :options="chartOptions" />
      </div>
    </div>
  </template>
  
  <script>
  import { Pie } from "vue-chartjs";
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
  } from "chart.js";
  import axios from "axios";
  
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement
  );
  
  export default {
    name: "ChartComponent",
    components: { Pie },
    data() {
      return {
        loans: [],
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                font: {
                  size: 14,
                  family: 'Arial, sans-serif',
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.label}: ${context.raw}`;
                },
              },
            },
          },
        },
      };
    },
    computed: {
      pieChartData() {
        const purposeCounts = this.loans.reduce((acc, loan) => {
          acc[loan.purpose] = (acc[loan.purpose] || 0) + 1;
          return acc;
        }, {});
  
        return {
          labels: Object.keys(purposeCounts),
          datasets: [
            {
              label: "Loan Purposes",
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#E0E0E0"],
              data: Object.values(purposeCounts),
            },
          ],
        };
      },
    },
    async mounted() {
      await this.fetchLoans();
    },
    methods: {
      async fetchLoans() {
        try {
          const response = await axios.get(
            "https://raw.githubusercontent.com/andreascandle/p2p_json_test/main/api/json/loans.json"
          );
          this.loans = response.data;
        } catch (error) {
          console.error("Error fetching loans:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .chart-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #f9f9f9;
  }
  
  .bar-chart, .pie-chart {
    position: relative;
    height: 500px; /* Adjust as needed */
    width: 100%; /* Ensure the chart takes full width of the container */
    background-color: #fff; /* Background color for the container */
    border-radius: 8px; /* Rounded corners for a smoother look */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
    padding: 20px; /* Add some padding around the chart */
    box-sizing: border-box; /* Ensure padding is included in the total width/height */
  }
  
  .chart-container canvas {
    max-height: 100% !important; /* Ensure the canvas fits within the container */
    max-width: 100% !important; /* Ensure the canvas fits within the container */
  }
  </style>
  