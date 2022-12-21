const util = require("util");
const { input, testInput, testInput2 } = require("./input");

const debug = `[8, 2, 32, -41, 6, 29, -4, 6, -8, 8, -3, -8, 3, -5, 0, -1, 2, 1, 10, -9]
[2, 32, -41, 6, 29, -4, 6, -8, 8, 8, -3, -8, 3, -5, 0, -1, 2, 1, 10, -9]
[32, -41, 2, 6, 29, -4, 6, -8, 8, 8, -3, -8, 3, -5, 0, -1, 2, 1, 10, -9]
[-41, 2, 6, 29, -4, 6, -8, 8, 8, -3, -8, 3, -5, 32, 0, -1, 2, 1, 10, -9]
[2, 6, 29, -4, 6, -8, 8, 8, -3, -8, 3, -5, 32, 0, -1, 2, -41, 1, 10, -9]
[2, 29, -4, 6, -8, 8, 8, 6, -3, -8, 3, -5, 32, 0, -1, 2, -41, 1, 10, -9]
[2, -4, 6, -8, 8, 8, 6, -3, -8, 3, -5, 29, 32, 0, -1, 2, -41, 1, 10, -9]
[2, 6, -8, 8, 8, 6, -3, -8, 3, -5, 29, 32, 0, -1, 2, -41, -4, 1, 10, -9]
[2, -8, 8, 8, 6, -3, -8, 6, 3, -5, 29, 32, 0, -1, 2, -41, -4, 1, 10, -9]
[2, 8, 8, 6, -3, -8, 6, 3, -5, 29, 32, 0, -8, -1, 2, -41, -4, 1, 10, -9]
[2, 8, 6, -3, -8, 6, 3, -5, 29, 32, 8, 0, -8, -1, 2, -41, -4, 1, 10, -9]
[2, 8, 6, -8, 6, 3, -5, 29, 32, 8, 0, -8, -1, 2, -41, -4, 1, 10, -9, -3]
[2, 8, 6, 6, 3, -5, 29, 32, 8, 0, -8, -1, 2, -41, -8, -4, 1, 10, -9, -3]
[2, 8, 6, 6, -5, 29, 32, 3, 8, 0, -8, -1, 2, -41, -8, -4, 1, 10, -9, -3]
[2, 8, 6, 6, 29, 32, 3, 8, 0, -8, -1, 2, -41, -8, -4, 1, 10, -9, -5, -3]
[2, 8, 6, 6, 29, 32, 3, 8, 0, -8, -1, 2, -41, -8, -4, 1, 10, -9, -5, -3]
[2, 8, 6, 6, 29, 32, 3, 8, 0, -1, -8, 2, -41, -8, -4, 1, 10, -9, -5, -3]
[2, 8, 6, 6, 29, 32, 3, 8, 0, -1, -8, -41, -8, 2, -4, 1, 10, -9, -5, -3]
[2, 8, 6, 6, 29, 32, 3, 8, 0, -1, -8, -41, -8, 2, -4, 10, 1, -9, -5, -3]
[2, 8, 6, 6, 29, 32, 10, 3, 8, 0, -1, -8, -41, -8, 2, -4, 1, -9, -5, -3]
[2, 8, 6, 6, 29, 32, 10, 3, -9, 8, 0, -1, -8, -41, -8, 2, -4, 1, -5, -3]`;

const parseInput = (input) =>
  input.split("\n").map((e, index) => ({ id: index, value: parseInt(e) }));

const mix = (input) => {
  let parsed = parseInput(input);
  const len = parsed.length;

  const deb = debug
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll(" ", "")
    .split("\n");
  // console.log(parsed);
  for (let i = 0; i < len; i++) {
    let currentId;
    let currentIndex;
    let currentValue;
    parsed.every(({ id, value }, index) => {
      if (id === i) {
        currentId = id;
        currentIndex = index;
        currentValue = value;
        return false;
      }
      return true;
    });
    let destIndex = currentIndex + currentValue;
    if (destIndex <= 0) {
      destIndex = len + (destIndex % len) - Math.floor(currentValue / len);
    } else if (destIndex >= len) {
      destIndex = (destIndex % len) + Math.floor(currentValue / len);
    }
    const swap = parsed.splice(currentIndex, 1);
    // console.log({ id: i, currentIndex, currentValue, destIndex });
    parsed = [
      ...parsed.slice(0, destIndex),
      swap[0],
      ...parsed.slice(destIndex),
    ];
    const arr = parsed.map((e) => e.value);
    console.log("\n                 " + arr.toString().replaceAll(",", ", "));
    if (arr.toString() !== deb[i + 1]) {
      console.log(
        "Error, expected:",
        deb[i + 1].toString().replaceAll(",", ", ")
      );
    }
  }
  return parsed;
};

const getGrooveCoordinates = (input) => {
  const mixed = mix(input);
  let sum = 0;
  for (let i = 1; i <= 3; i++) {
    const startIndex = mixed.findIndex((e) => e.value === 0);
    sum += mixed[(startIndex + i * 1000) % mixed.length].value;
  }
  return sum;
};

console.log(getGrooveCoordinates(testInput2));

// use this line for in-depth debugging
// console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
