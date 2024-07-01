import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const IncomeLineChart = ({ data, label }) => {
  const today = new Date();
  const chartData = data.map((income, index) => {
    let dateLabel;
    if (label === "Daily Income") {
      dateLabel = `${index + 1}`;
    } else {
      const dateObj = new Date(today.getFullYear(), index, 1);
      dateLabel = dateObj.toLocaleString("id-ID", { month: "long" });
    }
    return {
      date: dateLabel,
      income,
    };
  });

  return (
    <LineChart width={800} height={300} data={chartData}>
      <Line type="monotone" dataKey="income" stroke="#8884d8" />
      <XAxis dataKey="date" />
      <YAxis />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <Tooltip />
    </LineChart>
  );
};

export default IncomeLineChart;
