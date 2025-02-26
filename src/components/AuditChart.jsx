import React from "react";

const AuditChart = ({data}) => {
if(data.length === 0 || !data){
    <p> No Audit Data Available</p>
}

const width = 300;
const height = 300;

const radius = Math.min(width, height) /2;

const totalAudit = data.reduce((sum,item) => sum+item.valua,0);
let startAngle = 0;
 // Convert percentage into angles for Pie Chart
 const pieSlices = data.map((slice) => {
    const sliceAngle = (slice.value / totalAudit) * 2 * Math.PI;
    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(startAngle + sliceAngle);
    const y2 = radius + radius * Math.sin(startAngle + sliceAngle);
    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
    
    const path = `M ${radius},${radius} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
    startAngle += sliceAngle;

    return { path, color: slice.color, label: slice.label, value: slice.value };
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Pie slices */}
      {pieSlices.map((slice, i) => (
        <path key={i} d={slice.path} fill={slice.color} />
      ))}

      {/* Labels */}
      {pieSlices.map((slice, i) => (
        <text
          key={i}
          x={width / 2}
          y={height / 2 + i * 20}
          fontSize="14"
          fill="red"
          textAnchor="middle"
        >
          {slice.label}: {slice.value}
        </text>
      ))}
    </svg>
  );
};
export default AuditChart;