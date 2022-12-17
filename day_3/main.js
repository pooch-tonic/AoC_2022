const { input, testInput } = require("./input");

const getPriority = (item) => {
  const asciiCode = item.charCodeAt(0);
  if (asciiCode >= 65 && asciiCode <= 90) {
    return asciiCode - 38;
  }
  return asciiCode - 96;
};

const splitRucksack = (rucksack) => {
  const len = rucksack.length;
  const half = len / 2;
  return [rucksack.slice(0, half), rucksack.slice(half)];
};

const getSharedItem = (arr1, arr2) => {
  let sharedItem = null;
  arr1.split("").every((e) => {
    const index = arr2.indexOf(e);
    if (index > -1) {
      sharedItem = arr2[index];
      return false;
    }
    return true;
  });
  return sharedItem;
};

const getSharedItemInGroup = (group) => {
  const itemDict = {};
  let remainingItems = group[0].split("");
  group.slice(1).forEach((rucksack) => {
    remainingItems = [
      ...new Set(remainingItems.filter((item) => rucksack.indexOf(item) > -1)),
    ];
  });
  return remainingItems[0];
};

const getPriorityFromRucksack = (rucksack) => {
  const compartments = splitRucksack(rucksack);
  return getPriority(getSharedItem(compartments[0], compartments[1]));
};

const getPriorityFromRucksackGroup = (group) => {
  return getPriority(getSharedItemInGroup(group));
};

let total1 = 0;
let total2 = 0;
let tempGroup = [];

input.split("\n").forEach((e) => {
  tempGroup.push(e);
  total1 += getPriorityFromRucksack(e);
  if (tempGroup.length === 3) {
    total2 += getPriority(getSharedItemInGroup(tempGroup));
    tempGroup = [];
  }
});
console.log("total part 1:", total1);
console.log("total part 2:", total2);
