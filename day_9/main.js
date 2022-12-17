const { input, testInput } = require("./input");

const directions = {
  U: { x: 0, y: 1 },
  D: { x: 0, y: -1 },
  R: { x: 1, y: 0 },
  L: { x: -1, y: 0 },
};

const totalKnots = 10;

const knots = new Array(totalKnots).fill().map((e, id) => ({ id, x: 0, y: 0 }));

const getInstructions = (input) => input.split("\n");

const updateKnotPosition = (previousKnot, currentKnot) => {
  const xDiff = previousKnot.x - currentKnot.x;
  const yDiff = previousKnot.y - currentKnot.y;
  const distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

  if (distance >= 2) {
    const xMove = xDiff === 0 ? 0 : xDiff / Math.abs(xDiff);
    const yMove = yDiff === 0 ? 0 : yDiff / Math.abs(yDiff);
    currentKnot.x += xMove;
    currentKnot.y += yMove;
  }
};

const calculateTailPath = (instructions) => {
  const tailLogs = {};
  instructions.forEach((instruction) => {
    const [direction, steps] = instruction.split(" ");
    const velocity = directions[direction];
    for (let step = 0; step < steps; step++) {
      knots[0].x += velocity.x;
      knots[0].y += velocity.y;
      knots.slice(1).forEach((e, i) => {
        updateKnotPosition(knots[i], e);
      });
      const lastKnot = knots[knots.length - 1];
      tailLogs[`${lastKnot.x}:${lastKnot.y}`] = true;
    }
  });
  console.log(Object.keys(tailLogs).length);
};

const getTailPathFromInput = (input) => {
  const instructions = getInstructions(input);
  calculateTailPath(instructions);
};

getTailPathFromInput(input);
