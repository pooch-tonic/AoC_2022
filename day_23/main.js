const util = require("util");
const { input, testInput } = require("./input");

const directions = {
  N: { x: 0, y: 1 },
  S: { x: 0, y: -1 },
  W: { x: -1, y: 0 },
  E: { x: 1, y: 0 },
  NE: { x: 1, y: 1 },
  NW: { x: -1, y: 1 },
  SE: { x: 1, y: -1 },
  SW: { x: -1, y: -1 },
};

const checkOrder = [
  ["N", "NE", "NW"],
  ["S", "SE", "SW"],
  ["W", "NW", "SW"],
  ["E", "NE", "SE"],
];

class Elf {
  constructor({ id, x, y, elves }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.elves = elves;
    this.checkIndex = 0;
  }

  checkAround() {
    let canMove = true;
    const neighbors = this.elves.filter(
      (elf) =>
        elf.id !== this.id &&
        Math.abs(elf.x - this.x) <= 1 &&
        Math.abs(elf.y - this.y) <= 1
    );
    const len = checkOrder.length;
    if (neighbors && neighbors.length > 0) {
      let chosenDirection;
      for (let i = 0; i < len; i++) {
        const currentIndex = (this.checkIndex + i) % len;
        const isSideEmpty = checkOrder[currentIndex].every((orthDir) =>
          neighbors.every((neighbor) => {
            if (
              neighbor.x === this.x + directions[orthDir].x &&
              neighbor.y === this.y + directions[orthDir].y
            ) {
              return false;
            }
            return true;
          })
        );
        if (isSideEmpty) {
          chosenDirection = directions[checkOrder[currentIndex][0]];
          break;
        }
      }
      if (chosenDirection) {
        this.destCoord = {
          x: this.x + chosenDirection.x,
          y: this.y + chosenDirection.y,
        };
      } else {
        canMove = false;
        this.destCoord = null;
      }
    } else {
      canMove = false;
      this.destCoord = null;
    }
    this.checkIndex = (this.checkIndex + 1) % len;
    // console.log("  canMove", canMove);
    return canMove;
  }

  move() {
    if (this.destCoord) {
      const dupeDestElf = this.elves
        .filter((elf) => elf.id !== this.id)
        .find(
          (elf) =>
            elf.destCoord &&
            elf.destCoord.x === this.destCoord.x &&
            elf.destCoord.y === this.destCoord.y
        );
      // console.log(!!dupeDestElf);
      if (!dupeDestElf) {
        this.x = this.destCoord.x;
        this.y = this.destCoord.y;
        this.destCoord = null;
        return true;
      }
      this.destCoord = null;
      return false;
    }
    return false;
  }

  isPosition({ x, y }) {
    return this.x === x && this.y === y;
  }
}

const parseElves = (input) => {
  const elves = [];
  input.split("\n").forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char === "#") {
        elves.push(new Elf({ id: `${x}-${y}`, x, y: -y, elves }));
      }
    });
  });
  return elves;
};

const simulate = (input, rounds) => {
  const elves = parseElves(input);
  let noMove = false;
  // while (!noMove) {
  render(elves);
  for (let i = 0; i < rounds; i++) {
    const moveLog = [];
    elves.forEach((elf) => {
      // console.log("checking new elf");
      // check around
      elf.checkAround();
      // console.log("  curr:", { x: elf.x, y: elf.y });
      // console.log("  dest:", elf.destCoord);
    });
    elves.forEach((elf) => {
      // try to move and return if moved or not
      moveLog.push(elf.move());
    });
    noMove = moveLog.every((e) => e === false);
    // console.log("noMove:", noMove, moveLog);
    render(elves);
  }
  return elves;
};

const render = (elves) => {
  let minX = null;
  let maxX = null;
  let minY = null;
  let maxY = null;

  elves.forEach(({ x, y }) => {
    if (maxX === null || x > maxX) maxX = x;
    if (maxY === null || y > maxY) maxY = y;
    if (minX === null || x < minX) minX = x;
    if (minY === null || y < minY) minY = y;
  });

  let str = "";
  for (let y = maxY; y >= minY; y--) {
    let line = "";
    for (let x = minX; x <= maxX; x++) {
      if (elves.some((elf) => elf.isPosition({ x, y }))) {
        line = line.concat("#");
      } else {
        line = line.concat(".");
      }
    }
    str = str.concat(line + "\n");
  }
  console.log(str);
};

const calculateEmptyGroundTiles = (input, rounds) => {
  const finalElves = simulate(input, rounds);
  // console.log(finalElves.map((elf) => ({ x: elf.x, y: elf.y })));
  let minX = null;
  let maxX = null;
  let minY = null;
  let maxY = null;

  finalElves.forEach(({ x, y }) => {
    if (maxX === null || x > maxX) maxX = x;
    if (maxY === null || y > maxY) maxY = y;
    if (minX === null || x < minX) minX = x;
    if (minY === null || y < minY) minY = y;
  });
  return Math.abs(maxX - minX) * Math.abs(maxY - minY);
};

console.log(calculateEmptyGroundTiles(testInput, 10));

// use this line for in-depth debugging
// console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
