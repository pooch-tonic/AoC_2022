const { input } = require("./input");

const getElvesArray = (input) => {
  const res = [];
  let currentElfSum = 0;
  input.split("\n").forEach((line) => {
    if (line.length === 0) {
      res.push(currentElfSum);
      currentElfSum = 0;
    } else {
      currentElfSum += parseInt(line);
    }
  });
  return res;
};

const elvesArray = getElvesArray(input);
console.log(
  "Biggest sum for 1 elf",
  elvesArray.reduce((acc, val) => (acc > val ? acc : val))
);
console.log(
  "Top 3 elves sum",
  elvesArray
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, val) => acc + val)
);
