const { input, testInput } = require("./input");

const battleScores = {
  rock: {
    rock: 3,
    paper: 0,
    scissors: 6,
    baseValue: 1,
  },
  paper: {
    rock: 6,
    paper: 3,
    scissors: 0,
    baseValue: 2,
  },
  scissors: {
    rock: 0,
    paper: 6,
    scissors: 3,
    baseValue: 3,
  },
};

const shapeFromResult = {
  A: {
    X: "scissors",
    Y: "rock",
    Z: "paper",
  },
  B: {
    X: "rock",
    Y: "paper",
    Z: "scissors",
  },
  C: {
    X: "paper",
    Y: "scissors",
    Z: "rock",
  },
};

const opponentShapes = {
  A: "rock",
  B: "paper",
  C: "scissors",
};

const myShapes = {
  X: "rock",
  Y: "paper",
  Z: "scissors",
};

const battle = (oppKey, myKey) => {
  return (
    battleScores[myShapes[myKey]][opponentShapes[oppKey]] +
    battleScores[myShapes[myKey]].baseValue
  );
};

const battle2 = (oppKey, myKey) => {
  const myShape = shapeFromResult[oppKey][myKey];
  return (
    battleScores[myShape][opponentShapes[oppKey]] +
    battleScores[myShape].baseValue
  );
};

let myScore = 0;
let myScore2 = 0;

input.split("\n").forEach((e) => {
  const opponent = e.charAt(0);
  const me = e.charAt(2);
  myScore += battle(opponent, me);
  myScore2 += battle2(opponent, me);
});

console.log("battle1:", myScore);
console.log("battle2:", myScore2);
