const { input, testInput } = require("./input");

const convertDrawingToArrays = (drawing) => {
  const compactString = drawing
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll("    ", "-")
    .replaceAll(" ", "");
  const lines = compactString.split("\n");
  const lineLength = lines[0].length;
  const res = new Array(lineLength);
  for (i = 0; i < lineLength; i++) {
    res[i] = [];
  }
  lines.forEach((line) => {
    line.split("").forEach((item, colIndex) => {
      if (item !== "-") res[colIndex].unshift(item);
    });
  });
  return res;
};

const convertArraysToDrawing = (arrays) => {
  let res = "";
  let maxColHeight = 0;
  arrays.forEach((col) => {
    maxColHeight = col.length > maxColHeight ? col.length : maxColHeight;
  });
  for (h = maxColHeight - 1; h >= 0; h--) {
    arrays.forEach((col) => {
      if (col[h]) {
        res += `[${col[h]}] `;
      } else {
        res += "    ";
      }
    });
    res += "\n";
  }
  for (c = 1; c <= arrays.length; c++) {
    res += ` ${c}  `;
  }
  return res;
};

const moveItems = (matrix, amount, sourceCol, destCol) => {
  for (n = 0; n < amount; n++) {
    matrix[destCol].push(matrix[sourceCol].pop());
  }
};

const moveItemsAtOnce = (matrix, amount, sourceCol, destCol) => {
  matrix[destCol].push(...matrix[sourceCol].splice(-amount, amount));
};

// MDN ref for Array.from() mapping syntax : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
const convertInstructionsToArrays = (instructions) =>
  instructions
    .split("\n")
    .map((line) => Array.from(line.matchAll(/\d+/g), (m) => parseInt(m[0])));

const stringifyTopItems = (containers) => {
  let res = "";
  containers.forEach((col) => {
    const item = col.slice(-1)[0];
    res += item || "";
  });
  return res;
};

const executeInstructions = (base, instructions) => {
  const containers1 = convertDrawingToArrays(base);
  const containers2 = containers1.map((col) => [...col]);
  const orders = convertInstructionsToArrays(instructions);
  orders.forEach((order, orderIndex) => {
    console.log(`Order no.${orderIndex + 1}`);
    moveItems(containers1, order[0], order[1] - 1, order[2] - 1);
    moveItemsAtOnce(containers2, order[0], order[1] - 1, order[2] - 1);
    console.log(convertArraysToDrawing(containers1));
    console.log(convertArraysToDrawing(containers2));
  });
  console.log("CrateMover 9000", stringifyTopItems(containers1));
  console.log("CrateMover 9001", stringifyTopItems(containers2));
};

executeInstructions(input.base, input.instructions);
