const { input, testInput } = require("./input");

let tree = {
  "/": {
    _parent: null,
    _size: 0,
  },
};

let currentDir = tree;

const isNumber = (value) => typeof value === "number" && isFinite(value);

const addFile = (fileName, fileSize) => {
  if (!currentDir[fileName]) {
    const intFileSize = parseInt(fileSize);
    currentDir[fileName] = intFileSize;
    updateTreeSize(intFileSize);
  } else {
    console.warn(
      `addFile(${fileName}, ${fileSize}) called but directory already exists.`
    );
  }
};

const updateTreeSize = (newFileSize) => {
  let root = false;
  let tempDir = currentDir;
  while (!root) {
    tempDir._size += newFileSize;
    if (tempDir._parent) {
      tempDir = tempDir._parent;
    } else {
      root = true;
    }
  }
};

const addDir = (dirName) => {
  if (!currentDir[dirName]) {
    currentDir[dirName] = {
      _parent: currentDir,
      _size: 0,
    };
  } else {
    console.warn(`addDir(${dirName}) called but directory already exists.`);
  }
};

const switchDir = (dirName) => {
  switch (dirName) {
    case "/":
      currentDir = tree["/"];
      break;
    case "..":
      currentDir = currentDir._parent;
      break;
    default:
      currentDir = currentDir[dirName];
  }
};

const evaluateLine = (line) => {
  const args = line.split(" ");
  const firstArg = args[0];

  switch (args[0]) {
    case "$":
      evaluateCommand(args[1], args[2]);
      break;
    case "dir":
      addDir(args[1]);
      break;
    default:
      addFile(args[1], args[0]);
  }
};

const evaluateCommand = (command, arg) => {
  if (command === "cd") {
    switchDir(arg);
  }
};

const sumDirectoriesUnderTotalSize = (maxSize, baseDir) => {
  let sum = 0;
  for (const [key, value] of Object.entries(baseDir)) {
    if (key === "_size" && value <= maxSize) {
      sum += value;
    } else if (value && typeof value === "object" && key !== "_parent") {
      sum += sumDirectoriesUnderTotalSize(maxSize, value);
    }
  }
  return sum;
};

const getSmallestDirectoryToDeleteToFreeSpace = (
  totalSpace,
  spaceToFreeUp,
  baseDir
) => {
  const minFileSizeToDelete = Math.abs(
    baseDir._size - (totalSpace - spaceToFreeUp)
  );
  let bestDirForDeletion = baseDir;

  const searchSmallestDirectoryToDelete = (searchDir) => {
    for (const [key, value] of Object.entries(searchDir)) {
      if (
        key === "_size" &&
        value >= minFileSizeToDelete &&
        value < bestDirForDeletion._size
      ) {
        bestDirForDeletion = searchDir;
      } else if (value && typeof value === "object" && key !== "_parent") {
        searchSmallestDirectoryToDelete(value);
      }
    }
  };

  searchSmallestDirectoryToDelete(baseDir);
  return bestDirForDeletion;
};

input.split("\n").forEach((line) => evaluateLine(line));
console.log("Tree:", tree);
console.log("Sum for part 1:", sumDirectoriesUnderTotalSize(100000, tree["/"]));
console.log(
  "Sum for part 2:",
  getSmallestDirectoryToDeleteToFreeSpace(70000000, 30000000, tree["/"])._size
);
