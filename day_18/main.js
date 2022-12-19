const util = require("util");
const { input, testInput } = require("./input");

const calculateSurfaceArea = (input) => {
  let surfaceArea = 0;
  const cubes = new Set();
  input.split("\n").forEach((e) => {
    cubes.add(e);
  });
  cubes.forEach((cube) => {
    let uncoveredFaces = 6;
    const [x, y, z] = cube.split(",").map((e) => parseInt(e));
    if (cubes.has(`${x + 1},${y},${z}`)) uncoveredFaces--;
    if (cubes.has(`${x - 1},${y},${z}`)) uncoveredFaces--;
    if (cubes.has(`${x},${y + 1},${z}`)) uncoveredFaces--;
    if (cubes.has(`${x},${y - 1},${z}`)) uncoveredFaces--;
    if (cubes.has(`${x},${y},${z + 1}`)) uncoveredFaces--;
    if (cubes.has(`${x},${y},${z - 1}`)) uncoveredFaces--;
    surfaceArea += uncoveredFaces;
  });
  return surfaceArea;
};

console.log(calculateSurfaceArea(testInput));

// use this line for in-depth debugging
// console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
