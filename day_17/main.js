const util = require("util");
const { input, testInput } = require("./input");

console.log(testInput);

const rocks = [
  {
    shape: `####`,
    hitboxes: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
  },
  {
    shape: `.#.
    ###
    .#.`,
    hitboxes: [
      [1, 0],
      [0, 1],
      [2, 1],
      [1, 2],
    ],
  },
  {
    shape: `..#
    ..#
    ###`,
    hitboxes: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
  },
  {
    shape: `#
    #
    #
    #`,
    hitboxes: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
  },
  {
    shape: `##
    ##`,
    hitboxes: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  },
];

const createChunk = (width) =>
  new Array(10).fill().map(() => new Array(width).fill(false));

const createBase = (width) => [
  new Array(width).fill(true),
  ...new Array(9).fill().map(() => new Array(width).fill(false)),
];

const getHeight = (matrix) =>
  matrix.length -
  [...matrix]
    .reverse()
    .findIndex((line) => !line.every((col) => col === false)) -
  1;

const collides = (matrix, fallingRock, moveX, moveY) => {};

const simulate = (base, pattern, rockCount, spawnOffsetX, spawnOffsetY) => {
  let jetIndex = 0;
  let nRocks = 0;
  let currentRockIndex = 0;
  let fallingRock;
  let height = getHeight(base);
  while (nRocks <= rockCount) {
    // spawn if needed
    if (!fallingRock) {
      fallingRock = {
        hitboxes: rocks[currentRockIndex].hitboxes,
        x: spawnOffsetX,
        y: height + spawnOffsetY,
      };
    }
    // jet
    let moveX = 0;
    const jet = pattern.charAt(jetIndex);
    if (jet === ">") {
      moveX = 1;
    } else if (jet === "<") {
      moveX = -1;
    } else {
      console.error("unknown instruction", jet);
    }
    // collision check
  }
};

const calculateHeightForRockCount = (
  pattern,
  rockCount,
  width,
  spawnOffsetX,
  spawnOffsetY
) => {
  const base = createBase(width);
};

// use this line for in-depth debugging
// console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
