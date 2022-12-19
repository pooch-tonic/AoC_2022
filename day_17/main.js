const util = require("util");
const { input, testInput } = require("./input");

const chunkSize = 20;
const maxArraySize = 100;

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
  new Array(chunkSize).fill().map(() => new Array(width).fill(false));

const createBase = (width) => [
  new Array(width).fill(true),
  ...new Array(chunkSize - 1).fill().map(() => new Array(width).fill(false)),
];

const getHeight = (matrix, cumulatedHeight) =>
  cumulatedHeight +
  matrix.length -
  [...matrix]
    .reverse()
    .findIndex((line) => !line.every((col) => col === false)) -
  1;

const collides = (matrix, fallingRock) =>
  !fallingRock.hitboxes.every((hitbox) => {
    const hitboxCoord = {
      x: fallingRock.x + hitbox[0],
      y: fallingRock.y + hitbox[1],
    };
    if (
      hitboxCoord.y < 1 ||
      hitboxCoord.x < 0 ||
      hitboxCoord.x >= matrix[0].length ||
      matrix[hitboxCoord.y][hitboxCoord.x]
    ) {
      // console.log("  >> collides", hitboxCoord);

      return false;
    }
    // console.log("  >> does not collide", hitboxCoord);
    return true;
  });

const move = (matrix, fallingRock, moveX, moveY) => {
  const previewRock = { ...fallingRock };
  let couldMove = false;
  // check horizontal move
  previewRock.x += moveX;
  // console.log(">> checking x collision");
  if (collides(matrix, previewRock)) {
    previewRock.x = fallingRock.x;
  } else {
    fallingRock.x = previewRock.x;
    couldMove = true;
  }
  // check vertical move
  previewRock.y += moveY;
  // console.log(">> checking y collision");
  if (collides(matrix, previewRock)) {
    previewRock.y = fallingRock.y;
    couldMove = false;
  } else {
    fallingRock.y = previewRock.y;
    couldMove = true;
  }
  return couldMove;
};

const render = (matrix, fallingRock) => {
  let string = "";
  const renderMatrix = matrix.map((line) => line.map((e) => (e ? 1 : 0)));
  fallingRock.hitboxes.forEach((hitbox) => {
    renderMatrix[fallingRock.y + hitbox[1]][fallingRock.x + hitbox[0]] = 2;
  });
  renderMatrix.forEach((line) => {
    let lineString = "";
    line.forEach((col) => {
      let symbol;
      switch (col) {
        case 0:
          symbol = ".";
          break;
        case 1:
          symbol = "#";
          break;
        case 2:
          symbol = "@";
          break;
        default:
          break;
      }
      lineString = lineString.concat(symbol);
    });
    string = lineString.concat("\n", string);
  });
  console.log(string);
};

const simulate = (base, pattern, rockCount, spawnOffsetX, spawnOffsetY) => {
  let jetIndex = 0;
  let nRocks = 0;
  let currentRockIndex = 0;
  let cumulatedHeight = 0;
  let fallingRock;
  let height = getHeight(base, cumulatedHeight);
  while (nRocks < rockCount) {
    process.stdout.write(
      "Processing rock: " +
        nRocks +
        " (" +
        Math.floor(nRocks / rockCount) +
        "%)\r"
    );
    // spawn if needed
    if (!fallingRock) {
      fallingRock = {
        hitboxes: rocks[currentRockIndex].hitboxes,
        x: spawnOffsetX,
        y: height - cumulatedHeight + spawnOffsetY + 1, // + 1 needed here because height returns the array length - 1
      };
      // console.log("generated rock", fallingRock);
    }
    // add buffer for additional height if needed
    if (base.length + cumulatedHeight - height < chunkSize) {
      base.push(...createChunk(base[0].length));
      // console.log("added Chunk", base.length);
      if (base.length > maxArraySize) {
        base.splice(0, chunkSize);
        // console.log("removed oldest chunk", base.length);
        fallingRock.y = fallingRock.y - chunkSize;
        cumulatedHeight += chunkSize;
      }
    }

    // render(base, fallingRock);
    // jet
    let moveX = 0;
    const moveY = -1;
    const jet = pattern.charAt(jetIndex % pattern.length);
    if (jet === ">") {
      moveX = 1;
    } else if (jet === "<") {
      moveX = -1;
    }
    jetIndex++;
    // move with collision check, if the move is not possible then freeze rock
    if (!move(base, fallingRock, moveX, moveY)) {
      fallingRock.hitboxes.forEach((hitbox) => {
        base[fallingRock.y + hitbox[1]][fallingRock.x + hitbox[0]] = true;
      });
      // set new height
      height = getHeight(base, cumulatedHeight);
      // allow next rock generation
      fallingRock = null;
      nRocks++;
      currentRockIndex = (currentRockIndex + 1) % rocks.length;
    }
  }
  console.log(
    "All rocks have been processed                                                                                "
  );
  return height;
};

const calculateHeightForRockCount = (
  pattern,
  rockCount,
  width,
  spawnOffsetX,
  spawnOffsetY
) => {
  const base = createBase(width);
  return simulate(base, pattern, rockCount, spawnOffsetX, spawnOffsetY);
};

console.log(calculateHeightForRockCount(input, 1000000000000, 7, 2, 3));
//console.log(calculateHeightForRockCount(input, 1000000000000, 7, 2, 3));

// console.log(testInput.charAt(1));
// use this line for in-depth debugging
// console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
