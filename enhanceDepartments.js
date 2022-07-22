const fs = require("fs");

const departments = JSON.parse(fs.readFileSync("./dist/departments.json"));

const enhancedDepartments = departments.map((department) => {
  const regex = /([a-zA-Z])(-?[\d|.]+),?(-?[\d|.]+)/g;
  const points = [...department.originalPath.matchAll(regex)]
    .map((match) => ({
      command: match[1],
      x: Number(match[2], 0),
      y: Number(match[3], 0),
    }))
    .filter((point) => ["l", "L", "m", "M"].includes(point.command)); // to fix later
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (["l", "L"].includes(point.command)) {
      point.x += points[i - 1].x;
      point.y += points[i - 1].y;
    }
  }
  const avg = {
    x: points.reduce((acc, point) => point.x + acc, 0) / points.length,
    y: points.reduce((acc, point) => point.y + acc, 0) / points.length,
  };
  return {
    ...department,
    center: avg,
  };
});

fs.writeFileSync(
  "./dist/departments.json",
  JSON.stringify(enhancedDepartments)
);
