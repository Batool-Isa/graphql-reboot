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
    <div className="container mt-5">
      <h3 className="fw-bold text-center mb-4">XP & Grades Overview</h3>
      <div className="card shadow-lg p-4" style={{ backgroundColor: "#F5F5F5", borderRadius: "15px" }}>
        <div className="row text-center">
          {/* Max XP Project */}
          <div className="col-md-4">
            <div className="p-3 border rounded bg-light">
              <h5 className="text-primary">Top Project XP</h5>
              <p className="text-dark fw-semibold">
                {totalXp.max?.projectName || "N/A"} ({totalXp.max?.xp || 0} XP)
              </p>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row text-center">
          {/* Total Grade */}
          <div className="col-md-4">
            <div className="p-3 border rounded bg-light">
              <h5 className="text-success">Total Grades</h5>
              <p className="text-dark fw-semibold">
                {totalGrade["lifetime-total"].toFixed(2)}
              </p>
            </div>
          </div>
          {/* Max Grade Project */}
          <div className="col-md-4">
            <div className="p-3 border rounded bg-light">
              <h5 className="text-success">Best Project Grade</h5>
              <p className="text-dark fw-semibold">
                {totalGrade.max?.projectName || "N/A"} ({totalGrade.max?.grade || 0})
              </p>
            </div>
          </div>
          {/* Min Grade Project */}
          <div className="col-md-4">
            <div className="p-3 border rounded bg-light">
              <h5 className="text-danger">Lowest Project Grade</h5>
              <p className="text-dark fw-semibold">
                {totalGrade.min?.projectName || "N/A"} ({totalGrade.min?.grade || 0})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XPGrades;
