import React from "react";

const XP_Project_Chart = ({ data }) => {
  if (!data || data.transaction.length === 0 || data.object.length === 0) {
    return <p className="text-center text-danger">No XP Data Available</p>;
  }

  // Map project IDs to names (only "project" types)
  const projectMap = data.object
    .filter(obj => obj.type === "project")
    .reduce((acc, obj) => {
      acc[obj.id] = obj.name;
      return acc;
    }, {});

  // Sum XP per project
  const xpByProject = data.transaction.reduce((acc, tx) => {
    if (projectMap[tx.objectId]) {
      const projectName = projectMap[tx.objectId];
      acc[projectName] = (acc[projectName] || 0) + tx.amount;
    }
    return acc;
  }, {});

  // Convert XP data into array, sort in descending order & format XP to KB
  const chartData = Object.keys(xpByProject)
    .map(project => ({
      project,
      xp: (xpByProject[project] / 1000).toFixed(2), // Convert XP to KB
    }))
    .sort((a, b) => b.xp - a.xp); // Sort from highest to lowest XP

  // Ensure Small XP Bars Are Visible
  const barWidth = 50;
  const barSpacing = 40;
  const numBars = chartData.length;
  const width = Math.max(1800, numBars * (barWidth + barSpacing)); // Extended width
  const height = 500;
  const padding = 100;
  const maxXP = Math.max(...chartData.map(d => parseFloat(d.xp))) || 1;
  const minXP = Math.min(...chartData.map(d => parseFloat(d.xp))) || 0.01;

  const minBarHeight = 15; // **Force small bars to be visible**

  const xScale = index => padding + index * (barWidth + barSpacing);
  
  // **Fix: Prevent Invisible Bars Using Math.max()**
  const yScale = xp => 
    height - padding - Math.max((xp / maxXP) * (height - 2 * padding), minBarHeight);

  // Color Palette
  const colors = ["#2C3930", "#3F4F44", "#A27B5C", "#DCD7C9"];

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4" style={{ backgroundColor: "#DCD7C9", borderRadius: "15px" }}>
        <h3 className="text-center text-dark mb-3">XP Earned by Project</h3>
        
        {/* Ensure Full Scrollability */}
        <div style={{ overflowX: "auto", whiteSpace: "nowrap", maxWidth: "100%" }}>
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
                {d.xp} KB
              </text>
            ))}

            {/* Project Names on X-Axis (Rotated for better spacing) */}
            {chartData.map((d, i) => (
              <text
                key={i}
                x={xScale(i) + barWidth / 2}
                y={height - padding + 35}
                fontSize="12"
                fill="#2C3930"
                textAnchor="middle"
                transform={`rotate(25, ${xScale(i) + barWidth / 2}, ${height - padding + 35})`} // Adjust rotation
              >
                {d.project}
              </text>
            ))}

            {/* Y-Axis Labels */}
            <text x="5" y={yScale(maxXP)} fontSize="12" fill="#2C3930">{maxXP} KB</text>
            <text x="5" y={yScale(minXP)} fontSize="12" fill="#2C3930">0 KB</text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default XP_Project_Chart;