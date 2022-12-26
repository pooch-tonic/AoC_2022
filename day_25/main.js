const util = require("util");
const { input, testInput } = require("./input");

const base = 5;

const conversionDict = ["0", "1", "2", "=", "-"];

const convertToDecimal = (snafuNumber) => {
  let decimal = 0;
  snafuNumber.split("").forEach((e, index) => {
    const power = snafuNumber.length - index - 1;
    let multiplier;
    switch (e) {
      case "2":
        multiplier = 2;
        break;
      case "1":
        multiplier = 1;
        break;
      case "-":
        multiplier = -1;
        break;
      case "=":
        multiplier = -2;
        break;
      default:
        multiplier = 0;
    }
    decimal += Math.pow(base, power) * multiplier;
  });
  return decimal;
};

const convertToSnafu = (decimalNumber) => {
  let res = "";
  let power = 0;
  while (convertToDecimal(res) !== decimalNumber) {
    const dictIndex =
      Math.round(
        (parseInt(decimalNumber) % Math.pow(base, power + 1)) /
          Math.pow(base, power)
      ) % base;
    res = conversionDict[dictIndex] + res;
    power++;
  }
  return res;
};

const sumAll = (input) => {
  let sum = 0;
  return input.split("\n").reduce((acc, val) => acc + convertToDecimal(val), 0);
};

console.log(convertToSnafu(sumAll(input)));

// use this line for in-depth debugging
// console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
