const { input, testInput } = require("./input");

const directions = {
  UP: "UP",
  DOWN: "DOWN",
  RIGHT: "RIGHT",
  LEFT: "LEFT",
};

const convertInputToMatrix = (input) =>
  input.split("\n").map((line) => line.split("").map((tree) => parseInt(tree)));

const isTreeVisibleFromDirection = (matrix, row, col, direction) => {
  const treeHeight = matrix[row][col];
  if (direction === directions.UP) {
    if (row === 0) return true;
    for (let r = 0; r < row; r++) {
      if (matrix[r][col] >= treeHeight) return false;
    }
    return true;
  }
  if (direction === directions.LEFT) {
    if (col === 0) return true;
    for (let c = 0; c < col; c++) {
      if (matrix[row][c] >= treeHeight) return false;
    }
    return true;
  }
  const maxRowIndex = matrix.length - 1;
  if (direction === directions.DOWN) {
    if (row === maxRowIndex) return true;
    for (let r = maxRowIndex; r > row; r--) {
      if (matrix[r][col] >= treeHeight) return false;
    }
    return true;
  }
  const maxColIndex = matrix[0].length - 1;
  if (direction === directions.RIGHT) {
    if (col === maxColIndex) return true;
    for (let c = maxColIndex; c > col; c--) {
      if (matrix[row][c] >= treeHeight) return false;
    }
    return true;
  }
};

const getScenicScoreForTree = (matrix, row, col) => {
  let up = 0;
  let down = 0;
  let right = 0;
  let left = 0;
  const maxRowIndex = matrix.length - 1;
  const maxColIndex = matrix[0].length - 1;
  const treeHeight = matrix[row][col];

  for (let r = row - 1; r >= 0; r--) {
    up++;
    if (matrix[r][col] >= treeHeight) break;
  }
  for (let r = row + 1; r <= maxRowIndex; r++) {
    down++;
    if (matrix[r][col] >= treeHeight) break;
  }
  for (let c = col - 1; c >= 0; c--) {
    left++;
    if (matrix[row][c] >= treeHeight) break;
  }
  for (let c = col + 1; c <= maxColIndex; c++) {
    right++;
    if (matrix[row][c] >= treeHeight) break;
  }
  // console.log(`[${row}:${col}]`, up, down, right, left)
  return up * down * right * left;
};

const isTreeVisible = (matrix, row, col) => {
  const up = isTreeVisibleFromDirection(matrix, row, col, directions.UP);
  const down = isTreeVisibleFromDirection(matrix, row, col, directions.DOWN);
  const right = isTreeVisibleFromDirection(matrix, row, col, directions.RIGHT);
  const left = isTreeVisibleFromDirection(matrix, row, col, directions.LEFT);
  // console.log(`[${row}:${col}]${up ? ' up' : ''}${down ? ' down' : ''}${right ? ' right' : ''}${left ? ' left' : ''}`)
  return {
    up,
    down,
    right,
    left,
    visible: up || down || right || left,
  };
};

const countVisibleTrees = (matrix) => {
  let sum = 0;
  matrix.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (isTreeVisible(matrix, rowIndex, colIndex).visible) {
        sum++;
      }
    });
  });
  return sum;
};

const getBestViewTree = (matrix) => {
  let bestScore = 0;
  matrix.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const score = getScenicScoreForTree(matrix, rowIndex, colIndex);
      if (score > bestScore) {
        bestScore = score;
      }
    });
  });
  return bestScore;
};

const matrix = convertInputToMatrix(input);
console.log("Visible trees:", countVisibleTrees(matrix));
console.log("Best scenic score:", getBestViewTree(matrix));
