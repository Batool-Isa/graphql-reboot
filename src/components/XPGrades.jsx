import React, { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const XPGrades = ({ resultArr, allProjectNames }) => {
  // Memoize calculations for efficiency
  const { totalXp, totalGrade } = useMemo(() => {
    let totalXP = 0;
    let totalG = 0;

    resultArr.forEach((project) => {
      if (project.xp) totalXP += project.xp;
      if (project.grade) totalG += project.grade;
    });

    const totalXp = { "lifetime-total": totalXP };
    const totalGrade = { "lifetime-total": totalG };

    const projectsOnly = resultArr.filter((project) => allProjectNames.includes(project.projectName));

    // Sort XP in descending order
    const orderXp = [...projectsOnly].sort((a, b) => b.xp - a.xp);
    totalXp["project-total"] = orderXp.reduce((total, num) => total + num.xp, 0).toFixed(2);
    totalXp["avg-project-xp"] = (totalXp["project-total"] / orderXp.length).toFixed(2);
    totalXp.max = orderXp[0];
    totalXp.min = orderXp[orderXp.length - 1];
    totalXp["project-xp"] = orderXp;

    // Sort Grades in descending order
    const orderGrade = [...projectsOnly].sort((a, b) => b.grade - a.grade);
    totalGrade["project-total"] = orderGrade.reduce((total, num) => total + num.grade, 0).toFixed(2);
    totalGrade.max = orderGrade[0];
    totalGrade.min = orderGrade[orderGrade.length - 1];
    totalGrade["project-grades"] = orderGrade;

    return { totalXp, totalGrade };
  }, [resultArr, allProjectNames]);

  return (
    <div className="container mt-4">
      <h3 className="fw-bold">XP & Grades Overview</h3>
      <div className="card shadow-sm p-4" style={{ backgroundColor: "#DCD7C9", borderRadius: "10px" }}>
        <div className="row text-center">
          {/* Total XP */}
          <div className="col-md-4">
            <h5 className="text-dark">Total XP</h5>
            <p className="text-muted">{totalXp["lifetime-total"].toLocaleString()} XP</p>
          </div>
          {/* Average XP per Project */}
          <div className="col-md-4">
            <h5 className="text-dark">Avg XP / Project</h5>
            <p className="text-muted">{totalXp["avg-project-xp"]} XP</p>
          </div>
          {/* Max XP Project */}
          <div className="col-md-4">
            <h5 className="text-dark">Top Project XP</h5>
            <p className="text-muted">{totalXp.max?.projectName || "N/A"} ({totalXp.max?.xp || 0} XP)</p>
          </div>
        </div>

        <hr />

        <div className="row text-center">
          {/* Total Grade */}
          <div className="col-md-4">
            <h5 className="text-dark">Total Grades</h5>
            <p className="text-muted">{totalGrade["lifetime-total"].toFixed(2)}</p>
          </div>
          {/* Max Grade Project */}
          <div className="col-md-4">
            <h5 className="text-dark">Best Project Grade</h5>
            <p className="text-muted">{totalGrade.max?.projectName || "N/A"} ({totalGrade.max?.grade || 0})</p>
          </div>
          {/* Min Grade Project */}
          <div className="col-md-4">
            <h5 className="text-dark">Lowest Project Grade</h5>
            <p className="text-muted">{totalGrade.min?.projectName || "N/A"} ({totalGrade.min?.grade || 0})</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XPGrades;
