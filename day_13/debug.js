const {
  input,
  testInput,
  debugInput,
  debugInput2,
  debugInput3,
} = require("./input");

// working code from Reddit used to generate debug test cases
const compare = ([left, right]) => {
  if ([left, right].every(Number.isInteger)) {
    if (left < right) return true;
    if (left > right) return false;
    return;
  }

  if ([left, right].every(Array.isArray)) {
    for (let i = 0; i < Math.min(left.length, right.length); i++) {
      const res = compare([left[i], right[i]]);
      if (res != null) return res;
    }

    return compare([left.length, right.length]);
  }

  return compare([[left].flat(), [right].flat()]);
};

const parsePairs = (input) => {
  const packets = [];
  let tempObj = {};
  input.split("\n").forEach((l, index) => {
    const line = l.trim();
    if (line.length === 0) {
      packets.push([tempObj.left, tempObj.right]);
      tempObj = {};
    } else if (!tempObj.left) {
      tempObj.left = JSON.parse(line);
    } else {
      tempObj.right = JSON.parse(line);
    }
  });
  packets.push([tempObj.left, tempObj.right]);
  return packets;
};

const parsePairsDebug = (input) => {
  const packets = [];
  let tempObj = {};
  input.split("\n").forEach((l, index) => {
    const line = l.trim();
    if (line.length === 0) {
      packets.push({ ...tempObj });
      tempObj = {};
    } else if (!tempObj.left) {
      tempObj.left = JSON.parse(line);
      tempObj.leftRaw = line;
    } else {
      tempObj.right = JSON.parse(line);
      tempObj.rightRaw = line;
    }
  });
  packets.push({ ...tempObj });
  return packets;
};

console.log(
  parsePairs(debugInput2).reduce(
    (acc, el, index) => acc + (compare(el) ? index + 1 : 0),
    0
  )
);

parsePairsDebug(debugInput2).forEach((e) => {
  console.log(e.leftRaw);
  console.log(e.rightRaw);
  console.log(compare([e.left, e.right]));
});
