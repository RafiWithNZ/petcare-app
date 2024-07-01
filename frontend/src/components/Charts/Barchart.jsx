import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const IncomeBarChart = ({ data }) => {
  const chartData = [
    { name: "Harian", Income: data.dailyIncome },
    { name: "Mingguan", Income: data.weeklyIncome },
    { name: "Bulanan", Income: data.monthlyIncome },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Income" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default IncomeBarChart;
