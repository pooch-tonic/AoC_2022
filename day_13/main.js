const {
  input,
  testInput,
  debugInput,
  debugInput2,
  debugInput3,
} = require("./input");

const parsePairs = (input) => {
  const packets = [];
  let tempObj = {};
  input.split("\n").forEach((l, index) => {
    const line = l.trim();
    if (line.length === 0) {
      packets.push({ ...tempObj });
      tempObj = {};
    } else if (!tempObj.left) {
      tempObj.left = JSON.parse(line);
    } else {
      tempObj.right = JSON.parse(line);
    }
  });
  packets.push({ ...tempObj });
  return packets;
};

const parsePairsDebug = (input) => {
  const packets = [];
  let tempObj = {};
  input.split("\n").forEach((line, index) => {
    if (line === "true") {
      packets.push({ ...tempObj, expected: 1 });
      tempObj = {};
    } else if (line === "false") {
      packets.push({ ...tempObj, expected: -1 });
      tempObj = {};
    } else if (!tempObj.left) {
      tempObj.left = JSON.parse(line);
    } else {
      tempObj.right = JSON.parse(line);
    }
  });
  return packets;
};

// used to handle extreme cases where a 0 compared to another element is considered false instead of a number itself
const isIntOrArray = (element) =>
  Number.isInteger(element) || Array.isArray(element);

// return 1 if left is smaller, 0 if equal, -1 if right is smaller
const compare = (left, right) => {
  // console.log("received", "\n", left, "\n", right);
  const isLeftInt = Number.isInteger(left);
  const isRightInt = Number.isInteger(right);
  if (isLeftInt && !isRightInt) {
    // console.log(">> retry with left as array");
    return compare([left], right);
  } else if (isRightInt & !isLeftInt) {
    // console.log(">> retry with right as array");
    return compare(left, [right]);
  } else if (isRightInt && isLeftInt) {
    if (left < right) {
      // console.log(">>>> left is smaller");
      return 1;
    } else if (right < left) {
      // console.log(">>>> right is smaller");
      return -1;
    }
    // console.log(">> both are equal, going next");
    return 0;
  } else {
    let res = 0;
    let index = 0;
    let stop = false;
    // console.log(">> comparing arrays");

    while (!stop) {
      const nextLeft = isIntOrArray(left[index]);
      const nextRight = isIntOrArray(right[index]);
      if (!nextLeft & !nextRight) {
        stop = true;
        // console.log(">> arrays compared and both are equal, going next");
      } else if (!nextLeft && nextRight) {
        stop = true;
        res = 1;
        // console.log(">>>> left array ran out");
      } else if (!nextRight && nextLeft) {
        stop = true;
        res = -1;
        // console.log(">>>> right array ran out");
      } else {
        // console.log(">> comparing arrays at index", index);
        res = compare(left[index], right[index]);
        if (res !== 0) {
          stop = true;
        } else {
          index++;
        }
      }
    }
    return res;
  }
};

const countRightOrderPackets = (input) => {
  return parsePairs(input)
    .map((pair) => compare(pair.left, pair.right))
    .reduce((acc, value, index) => {
      if (value === 1) {
        return acc + index + 1;
      }
      return acc;
    }, 0);
};

const debug = (input) => {
  let sum = 0;
  const fails = [];
  parsePairsDebug(input).forEach((pair, index) => {
    const comp = compare(pair.left, pair.right);
    const compReversed = compare(pair.right, pair.left);
    if (comp === 1) {
      sum += index + 1;
    }
    if (!(comp === pair.expected && compReversed !== pair.expected)) {
      fails.push({ pair, index });
    }
  });
  if (fails.length > 0) {
    console.log("Sum is", sum, "- Tests failed at pairs :");
    console.log(fails.map((e) => e.pair));
  } else {
    console.log("Sum is", sum, "- All tests passed.");
  }
};

const sortPacketsWithDividers = (input) => {
  const newInput = input.split("\n").filter((e) => e.length > 0);

  newInput.push("[[2]]", "[[6]]");
  newInput.sort((a, b) => compare(JSON.parse(b), JSON.parse(a)));
  const dividerPacket2 = newInput.indexOf("[[2]]") + 1;
  const dividerPacket6 = newInput.indexOf("[[6]]") + 1;
  console.log(`Packet [[2]] is at index ${dividerPacket2}
Packet[[6]] is at index ${dividerPacket6}
The product is ${dividerPacket2 * dividerPacket6}`);
};

// console.log(countRightOrderPackets(testInput)) // should give 13
console.log("Sum of right order indices:", countRightOrderPackets(input)); // answer is between 5870 and 5985, 5904 failed. 5905 passed after fixing reduce() last arg for starting value as 0
sortPacketsWithDividers(input);
// debug(debugInput); // should give 6415
// debug(debugInput2); // should give 5292
// debug(debugInput3); // test cases compiled from Reddit
