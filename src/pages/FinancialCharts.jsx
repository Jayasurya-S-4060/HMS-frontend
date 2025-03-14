import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const FinancialCharts = ({ chartData }) => {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <h3>Financial Trends Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#82ca9d"
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ff7300"
              name="Expenses"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialCharts;
