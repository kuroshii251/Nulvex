"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function SignupsChart({
  data,
}: {
  data: { date: string; users: number }[];
}) {
  return (
    <>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(76,150,255,0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#66768a", fontSize: 11 }}
              axisLine={{ stroke: "rgba(76,150,255,0.14)" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#66768a", fontSize: 11 }}
              axisLine={{ stroke: "rgba(76,150,255,0.14)" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#0a1019",
                border: "1px solid rgba(76,150,255,0.2)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#e7edf5" }}
              itemStyle={{ color: "#00e5ff" }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#00e5ff"
              strokeWidth={2}
              dot={{ fill: "#00e5ff", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>

  );
}