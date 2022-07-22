const fs = require("fs");

const departements = JSON.parse(fs.readFileSync("./departements.json"));

const enhancedDepartements = departements.map((departement) => {
  const regex = /([a-zA-Z])(-{0,1}[\d|.]+),{0,1}(-{0,1}[\d|.]+)/g;
  const points = [...departement.originalPath.matchAll(regex)]
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
    ...departement,
    center: avg,
  };
});

fs.writeFileSync("./departements.json", JSON.stringify(enhancedDepartements));
