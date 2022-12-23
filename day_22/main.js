const util = require("util");
const { input, testInput } = require("./input");

const tiles = {
  void: 0,
  ground: 1,
  wall: 2,
};

const directions = [
  {
    x: 1,
    y: 0,
  },
  {
    x: 0,
    y: 1,
  },
  {
    x: -1,
    y: 0,
  },
  {
    x: 0,
    y: -1,
  },
];

// parse map with void borders (add 1 line in every side)
const parseMap = (input) => {
  const splitInput = input.split("\n");
  const maxLength = splitInput.reduce(
    (acc, val) => (acc < val.length ? val.length : acc),
    0
  );
  const getNewLine = () => new Array(maxLength + 2).fill(tiles.void);
  const matrix = splitInput.map((line) => {
    const lineArr = getNewLine();
    line.split("").forEach((char, index) => {
      switch (char) {
        case ".":
          lineArr[index + 1] = tiles.ground;
          break;
        case "#":
          lineArr[index + 1] = tiles.wall;
          break;
        default:
          break;
      }
    });
    return lineArr;
  });
  matrix.unshift(getNewLine());
  matrix.push(getNewLine());
  return matrix;
};

const parseInstructions = (instructions) => {
  const arr = [];
  let valueString = "";
  instructions.split("").forEach((char) => {
    if (/\d/.test(char)) {
      valueString += char;
    } else {
      arr.push(parseInt(valueString));
      valueString = "";
      arr.push(char);
    }
  });
  if (valueString.length > 0) {
    arr.push(parseInt(valueString));
  }
  return arr;
};

const warpIfPossible = (matrix, coords, direction) => {
  const currentCoords = { ...coords };
  if (direction.x > 0) {
    // right
    currentCoords.x = 1;
  } else if (direction.x < 0) {
    // left
    currentCoords.x = matrix[0].length - 2;
  } else if (direction.y < 0) {
    // up
    currentCoords.y = matrix.length - 2;
  } else {
    // down
    currentCoords.y = 1;
  }
  let exit = false;
  let res = true;
  while (!exit) {
    const currentTile = matrix[currentCoords.y][currentCoords.x];
    if (currentTile === tiles.ground) {
      coords.x = currentCoords.x;
      coords.y = currentCoords.y;
      exit = true;
    } else if (currentTile === tiles.void) {
      currentCoords.x += direction.x;
      currentCoords.y += direction.y;
    } else if (currentTile === tiles.wall) {
      exit = true;
      res = false;
    }
  }
  return res;
};

const move = (matrix, coords, direction, distance) => {
  for (let i = 0; i < distance; i++) {
    const nextCoords = { x: coords.x + direction.x, y: coords.y + direction.y };
    const nextTile = matrix[nextCoords.y][nextCoords.x];
    let keepLoop = true;

    switch (nextTile) {
      case tiles.void:
        const warped = warpIfPossible(matrix, coords, direction);
        if (!warped) keepLoop = false;
        break;
      case tiles.ground:
        coords.x = nextCoords.x;
        coords.y = nextCoords.y;
        break;
      case tiles.wall:
        keepLoop = false;
        break;
    }

    if (!keepLoop) break;
  }
};

const simulate = ({ instructions, map }) => {
  const matrix = parseMap(map);
  const instructionsArr = parseInstructions(instructions);
  const coords = {
    x: matrix[1].indexOf(tiles.ground),
    y: 1,
  };
  let directionIndex = 0;
  instructionsArr.forEach((instruction) => {
    switch (instruction) {
      case "R":
        directionIndex = (directionIndex + 1) % directions.length;
        break;
      case "L":
        directionIndex--;
        if (directionIndex < 0) directionIndex = directions.length - 1;
        break;
      default:
        move(matrix, coords, directions[directionIndex], instruction);
    }
  });
  return { ...coords, directionIndex };
};

const getPassword = (input) => {
  const simulationRes = simulate(input);
  return (
    simulationRes.y * 1000 + simulationRes.x * 4 + simulationRes.directionIndex
  );
};

console.log(getPassword(input));

// use this line for in-depth debugging
// console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
