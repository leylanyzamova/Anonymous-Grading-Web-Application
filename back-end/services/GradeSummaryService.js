import Grade from "../entities/Grades.js";

async function calculateFinalGrade(deliverableId) {
  const grades = await Grade.findAll({
    where: { DeliverableID: deliverableId },
  });

  if (grades.length < 3) {
    return {
      finalGrade: null,
      status: "insufficient_grades",
      count: grades.length,
    };
  }

  const values = grades.map(g => parseFloat(g.Value));
  values.sort((a, b) => a - b);

  // lowest & highest çıkar
  values.shift();
  values.pop();

  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;

  return {
    finalGrade: Number(avg.toFixed(2)),
    status: "ok",
    count: grades.length,
  };
}

export { calculateFinalGrade };
