const { nextTick } = require("process");
const util = require("util");
const { input, testInput } = require("./input");

const blocks = {
  air: {
    value: 0,
    symbol: ".",
  },
  rock: {
    value: 1,
    symbol: "#",
  },
  sand: {
    value: 2,
    symbol: "o",
  },
  source: {
    value: 3,
    symbol: "+",
  },
};

const sourceCoord = { x: 500, y: 0 };
const arrayMinX = 0;
const arrayMaxX = 1000;
const xMargin = 10; // Margin on x applied to left and right
const yMargin = 10; // Margin on y applied to top and bottom

const defineBaseParameters = (input) => {
  let minX = null;
  let maxX = null;
  let minY = 0;
  let maxY = null;
  const splitInput = input.split("\n").map((line) =>
    line.split(" -> ").map((coords) => {
      const coord = coords.split(",").map((e) => parseInt(e));
      const x = coord[0];
      const y = coord[1];
      if (minX === null || x < minX) minX = x;
      if (maxX === null || x > maxX) maxX = x;
      if (minY === null || y < minY) minY = y;
      if (maxY === null || y > maxY) maxY = y;
      return { x, y };
    })
  );
  return {
    sourceCoord,
    rockPaths: splitInput,
    minX,
    maxX,
    minY,
    maxY,
  };
};

const generateMatrix = ({ sourceCoord, rockPaths, minX, maxX, minY, maxY }) => {
  // +1s are needed to take in account max index
  const matrix = new Array(maxY - minY + 1)
    .fill()
    .map(() =>
      new Array(arrayMaxX - arrayMinX + 1).fill().map(() => blocks.air)
    );

  rockPaths.forEach((path) => {
    for (let i = 0; i < path.length - 1; i++) {
      const current = path[i];
      const next = path[i + 1];
      let currentX = current.x;
      let currentY = current.y;
      const nextX = next.x;
      const nextY = next.y;
      while (currentX !== nextX || currentY !== nextY) {
        matrix[currentY][currentX] = blocks.rock;
        if (currentX > nextX) {
          currentX--;
        } else if (currentX < nextX) {
          currentX++;
        }
        if (currentY > nextY) {
          currentY--;
        } else if (currentY < nextY) {
          currentY++;
        }
      }
      matrix[currentY][currentX] = blocks.rock;
    }
  });
  matrix[sourceCoord.y][sourceCoord.x] = blocks.source;
  return matrix;
};

const generateMatrixWithBottomFloor = ({
  sourceCoord,
  rockPaths,
  minX,
  maxX,
  minY,
  maxY,
}) => {
  // +1s are needed to take in account max index
  const matrix = new Array(maxY - minY + 1)
    .fill()
    .map(() =>
      new Array(arrayMaxX - arrayMinX + 1).fill().map(() => blocks.air)
    );

  rockPaths.forEach((path) => {
    for (let i = 0; i < path.length - 1; i++) {
      const current = path[i];
      const next = path[i + 1];
      let currentX = current.x;
      let currentY = current.y;
      const nextX = next.x;
      const nextY = next.y;
      while (currentX !== nextX || currentY !== nextY) {
        matrix[currentY][currentX] = blocks.rock;
        if (currentX > nextX) {
          currentX--;
        } else if (currentX < nextX) {
          currentX++;
        }
        if (currentY > nextY) {
          currentY--;
        } else if (currentY < nextY) {
          currentY++;
        }
      }
      matrix[currentY][currentX] = blocks.rock;
    }
  });
  matrix.push(
    matrix[0].map(() => blocks.air),
    matrix[0].map(() => blocks.rock)
  );
  matrix[sourceCoord.y][sourceCoord.x] = blocks.source;
  return matrix;
};

const renderMatrix = (matrix, { minX, maxX }) => {
  let string = "";
  matrix.forEach((row) => {
    row.slice(minX - xMargin, maxX + xMargin).forEach((block) => {
      string = string.concat(block.symbol);
    });
    string = string.concat("\n");
  });
  console.log(string);
};

const dropSand = (matrix, { sourceCoord, minX, maxX, minY, maxY }) => {
  let fallingSand = { ...sourceCoord };
  let validDrop = true; // false if dropped in void
  if (matrix[sourceCoord.y][sourceCoord.x] === blocks.sand) return false; // stop if source is blocked
  while (fallingSand) {
    const bottomY = fallingSand.y + 1;
    if (matrix[bottomY]) {
      const bottom = matrix[bottomY][fallingSand.x];
      const bottomLeft = matrix[bottomY][fallingSand.x - 1];
      const bottomRight = matrix[bottomY][fallingSand.x + 1];

      if (bottom === blocks.air) {
        fallingSand.y++;
      } else if (bottomLeft === blocks.air) {
        fallingSand.y++;
        fallingSand.x--;
      } else if (bottomRight === blocks.air) {
        fallingSand.y++;
        fallingSand.x++;
      } else {
        matrix[fallingSand.y][fallingSand.x] = blocks.sand;
        fallingSand = null;
      }
    } else {
      fallingSand = null;
      validDrop = false;
    }
  }
  return validDrop;
};

const countMaxSandUnitsUntilFall = (input) => {
  const baseParams = defineBaseParameters(input);
  // const matrix = generateMatrix(baseParams); // Part 1
  const matrix = generateMatrixWithBottomFloor(baseParams); // Part 2
  let restingSand = 0;
  let loop = true;
  while (loop) {
    loop = dropSand(matrix, baseParams);
    restingSand += loop ? 1 : 0;
  }
  renderMatrix(matrix, baseParams);
  return restingSand;
};

/*
console.log(
  util.inspect(
    generateMatrix(defineBaseParameters(testInput), {
      showHidden: false,
      depth: null,
      colors: true,
    })
  )
);
*/

console.log(countMaxSandUnitsUntilFall(input));
