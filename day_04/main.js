const { input, testInput } = require("./input");

const getAssignments = (line) =>
  line.split(",").map((pair) => pair.split("-").map((e) => parseInt(e)));

const doesOneContainOther = ([a, b]) => {
  const aMin = a[0];
  const aMax = a[1];
  const bMin = b[0];
  const bMax = b[1];
  const ahasb = aMin <= bMin && aMax >= bMax;
  const bhasa = bMin <= aMin && bMax >= aMax;
  if (ahasb || bhasa) return true;
  return false;
};

const inRange = (n, a, b) => {
  return n >= a && n <= b;
};

const doesOverlap = ([a, b]) => {
  const aMin = a[0];
  const aMax = a[1];
  const bMin = b[0];
  const bMax = b[1];
  const cond1 = inRange(aMin, bMin, bMax);
  const cond2 = inRange(aMax, bMin, bMax);
  const cond3 = inRange(bMin, aMin, aMax);
  const cond4 = inRange(bMax, aMin, aMax);

  if (cond1 || cond2 || cond3 || cond4) return true;
  return false;
};

const checkContainment = (line) => doesOneContainOther(getAssignments(line));

const checkOverlap = (line) => doesOverlap(getAssignments(line));

let total1 = 0;
let total2 = 0;

input.split("\n").forEach((line) => {
  total1 += checkContainment(line);
  total2 += checkOverlap(line);
});

console.log("total1", total1);
console.log("total2", total2);
