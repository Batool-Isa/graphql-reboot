import React from "react";

const XPChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-danger">No XP data available</p>;
  }

  // Format XP data
  const formattedData = data.reduce((acc, item) => {
    const date = new Date(item.createdAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + item.amount;
    return acc;
  }, {});

  const chartData = Object.keys(formattedData)
    .map(date => ({ date, xp: formattedData[date] }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // SVG Chart Styling
  const width = Math.max(1200, chartData.length * 80); // Ensures horizontal scrolling
  const height = 500;
  const padding = 80;
  const maxXP = Math.max(...chartData.map(d => d.xp)) || 1;

  // Scaling functions
  const xScale = (date) => padding + ((chartData.findIndex(d => d.date === date) / (chartData.length - 1)) * (width - 2 * padding));
  const yScale = (xp) => height - padding - (xp / maxXP) * (height - 2 * padding);

  // Generate Line Path
  const linePath = chartData.map((d, i) =>
    `${i === 0 ? "M" : "L"} ${xScale(d.date)},${yScale(d.xp)}`
  ).join(" ");

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4" style={{ backgroundColor: "#DCD7C9", borderRadius: "15px" }}>
        <h3 className="text-center text-dark mb-3">XP Progress Over Time</h3>
        
        {/* Enable scrolling */}
        <div className="overflow-auto" style={{ maxWidth: "100%", whiteSpace: "nowrap" }}>
          <svg width={width} height={height} className="d-block mx-auto">
            {/* X & Y Axes */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#2C3930" strokeWidth="2" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#2C3930" strokeWidth="2" />

            {/* XP Line Path */}
            <path d={linePath} fill="none" stroke="#A27B5C" strokeWidth="3" />

            {/* Data Points */}
            {chartData.map((d, i) => (
              <circle key={i} cx={xScale(d.date)} cy={yScale(d.xp)} r="5" fill="#3F4F44" />
            ))}

            {/* Labels for XP Points */}
            {chartData.map((d, i) => (
              <text key={i} x={xScale(d.date)} y={yScale(d.xp) - 10} fontSize="12" fill="#2C3930" textAnchor="middle">
                {d.xp}
              </text>
            ))}

            {/* X-Axis Labels (Rotated for Readability) */}
            {chartData.map((d, i) => (
              <text key={i} x={xScale(d.date)} y={height - padding + 35} fontSize="12" fill="#2C3930" textAnchor="middle"
                transform={`rotate(45, ${xScale(d.date)}, ${height - padding + 35})`}>
                {d.date}
              </text>
            ))}

            {/* Y-Axis Labels */}
            <text x="5" y={yScale(maxXP)} fontSize="12" fill="#2C3930">{maxXP.toLocaleString()} XP</text>
            <text x="5" y={yScale(0)} fontSize="12" fill="#2C3930">0 XP</text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default XPChart;