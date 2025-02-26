import React from "react";

const XP_Project_Chart = ({ data }) => {
  if (!data || data.transaction.length === 0 || data.object.length === 0) {
    return <p className="text-center text-danger">No XP Data Available</p>;
  }

  // Map project IDs to names
  const projectMap = data.object.reduce((acc, obj) => {
    acc[obj.id] = obj.name;
    return acc;
  }, {});

  // Sum XP per project
  const xpByProject = data.transaction.reduce((acc, tx) => {
    const projectName = projectMap[tx.objectId] || "Unknown Project";
    acc[projectName] = (acc[projectName] || 0) + tx.amount;
    return acc;
  }, {});

  // Convert XP data into array and sort in descending order
  const chartData = Object.keys(xpByProject)
    .map((project) => ({
      project,
      xp: xpByProject[project],
    }))
    .sort((a, b) => b.xp - a.xp); // Sort from highest to lowest XP

  // **Dynamic SVG Sizing**
  const barWidth = 50;
  const barSpacing = 30;
  const numBars = chartData.length;
  const width = Math.min(900, numBars * (barWidth + barSpacing)); // Adjust width dynamically
  const height = 500;
  const padding = 80;
  const maxXP = Math.max(...chartData.map(d => d.xp)) || 1;

  const xScale = (index) => padding + index * (barWidth + barSpacing);
  const yScale = (xp) => height - padding - (xp / maxXP) * (height - 2 * padding);

  // Color Palette
  const colors = ["#2C3930", "#3F4F44", "#A27B5C", "#DCD7C9"];

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4" style={{ backgroundColor: "#DCD7C9", borderRadius: "15px" }}>
        <h3 className="text-center text-dark mb-3">XP Earned by Project</h3>
        <div className="overflow-auto">
          <svg width={width} height={height} className="d-block mx-auto">
            {/* Bars */}
            {chartData.map((d, i) => (
              <rect
                key={i}
                x={xScale(i)}
                y={yScale(d.xp)}
                width={barWidth}
                height={height - padding - yScale(d.xp)}
                fill={colors[i % colors.length]}
                rx="5"
              />
            ))}

            {/* Labels Above Bars */}
            {chartData.map((d, i) => (
              <text
                key={i}
                x={xScale(i) + barWidth / 2}
                y={yScale(d.xp) - 10}
                fontSize="14"
                fill="#2C3930"
                textAnchor="middle"
              >
                {d.xp}
              </text>
            ))}

            {/* Project Names on X-Axis (Better Spacing & Rotation) */}
            {chartData.map((d, i) => (
              <text
                key={i}
                x={xScale(i) + barWidth / 2}
                y={height - padding + 30}
                fontSize="12"
                fill="#2C3930"
                textAnchor="middle"
                transform={`rotate(25, ${xScale(i) + barWidth / 2}, ${height - padding + 30})`} // Adjust rotation
              >
                {d.project}
              </text>
            ))}

            {/* XP Labels on Y-Axis */}
            <text x="5" y={yScale(maxXP)} fontSize="12" fill="#2C3930">{maxXP} XP</text>
            <text x="5" y={yScale(0)} fontSize="12" fill="#2C3930">0 XP</text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default XP_Project_Chart;
