import React, { useEffect, useState } from "react";
import { Pie, Line, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function StatsPanel() {
  const [vendorData, setVendorData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [summaryStats, setSummaryStats] = useState({});

  useEffect(() => {
    fetch("http://localhost:8000/stats")
      .then((res) => res.json())
      .then((data) => {
        console.log("Stats API Response:", data);
        setVendorData(data.top_vendors || []);
        setMonthlyData(data.top_months || []);
        setCategoryData(data.vendor_frequency || {});
        setSummaryStats({
          sum: data.total_spent,
          mean: data.average_spent,
          median: data.median_spent,
          mode: data.mode_spent,
        });
      });
  }, []);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      title: {
        color: "white",
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.2)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.2)" },
      },
    },
  };

  // 🥧 Pie Chart with Percentages
  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "#f39c12",
          "#8e44ad",
          "#2ecc71",
          "#3498db",
          "#e74c3c",
          "#1abc9c",
        ],
      },
    ],
  };

  const pieChartOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      datalabels: {
        color: "white",
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          const percentage = (value / total) * 100;
          return percentage.toFixed(1) + "%";
        },
      },
    },
  };

  // 📊 Bar Chart with Percentages
  const barChartData = {
    labels: vendorData.map((v) => v[0]),
    datasets: [
      {
        label: "Receipts Count",
        data: vendorData.map((v) => v[1]),
        backgroundColor: "#3498db",
      },
    ],
  };

  const barChartOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      datalabels: {
        anchor: "end",
        align: "top",
        color: "white",
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          const percentage = (value / total) * 100;
          return percentage.toFixed(1) + "%";
        },
      },
    },
  };

  // 📈 Line Chart for Monthly Spend
  const lineChartData = {
    labels: monthlyData.map((m) => m[0]),
    datasets: [
      {
        label: "Monthly Spend",
        data: monthlyData.map((m) => m[1]),
        borderColor: "#2ecc71",
        fill: false,
      },
    ],
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="card mt-4 p-3" style={{ maxWidth: "18rem" }}>
            <h5>Summary Statistics</h5>
            <ul className="list-group">
              <li className="list-group-item">
                Total: ₹{summaryStats.sum?.toFixed(2)}
              </li>
              <li className="list-group-item">
                Mean: ₹{summaryStats.mean?.toFixed(2)}
              </li>
              <li className="list-group-item">
                Median: ₹{summaryStats.median?.toFixed(2)}
              </li>
              <li className="list-group-item">
                Mode: ₹{summaryStats.mode ?? "N/A"}
              </li>
            </ul>
          </div>
          <div className="d-flex mt-2">
            <a
              href="http://localhost:8000/export/summary/csv"
              className="btn btn-sm btn-primary me-2"
              download
            >
              Export CSV
            </a>
            <a
              href="http://localhost:8000/export/summary/json"
              className="btn btn-sm btn-secondary"
              download
            >
              Export JSON
            </a>
          </div>
        </div>

        <div className="col-md-3 mb-4" style={{ height: "300px" }}>
          <h5>Spending by Vendor (Pie)</h5>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>

        <div className="col-md-6 mb-4" style={{ height: "300px" }}>
          <h5>Top Vendors (Bar)</h5>
          <Bar data={barChartData} options={barChartOptions} />
        </div>

        <div className="col-12 mt-3 mb-4" style={{ height: "300px" }}>
          <h5>Monthly Spend Trend (Line)</h5>
          <Line data={lineChartData} options={commonOptions} />
        </div>
      </div>
    </div>
  );
}
