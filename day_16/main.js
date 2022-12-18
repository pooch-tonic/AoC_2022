const util = require("util");
const { input, testInput } = require("./input");

const parseInput = (input) => {
  const valves = input
    .replaceAll("Valve ", "")
    .replaceAll(" has flow rate=", ", ")
    .replaceAll("; tunnel leads to valve ", ", ")
    .replaceAll("; tunnels lead to valves ", ", ")
    .split("\n")
    .map((line) => {
      const arr = line.split(", ");
      return {
        id: arr[0],
        flowRate: parseInt(arr[1]),
        tunnels: arr.slice(2).map((e) => ({ id: e, cost: 1 })),
      };
    });
  return valves;
};

const getMostPressureInTime = (input, time, startingValveId) => {
  const valves = parseInput(input);
};

// console.log(parseInput(testInput));

// use this line for in-depth debugging
console.log(
  util.inspect(parseInput(testInput), {
    showHidden: false,
    depth: null,
    colors: true,
  })
);
