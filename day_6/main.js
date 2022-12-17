const { input, testInput } = require("./input");

const markerLength = 14;

const detectMarker = (string) => {
  let pos = 0;
  let marker = "";
  for (i = 0; i < string.length; i++) {
    const chars = string.slice(i, i + markerLength);
    if (areCharactersUnique(chars)) {
      pos = i;
      marker = chars;
      break;
    }
  }
  console.log(`Marker ${marker} found at position ${pos + markerLength}.`);
};

const areCharactersUnique = (chars) => {
  const dict = {};
  return chars.split("").every((char) => {
    if (dict[char]) {
      return false;
    }
    dict[char] = true;
    return true;
  });
};

detectMarker(input);
