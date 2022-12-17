const util = require("util");
const { input, testInput } = require("./input");

const parseDataInput = (input) => {
  return input
    .replaceAll("Sensor at x=", "")
    .replaceAll(": closest beacon is at x=", ",")
    .replaceAll(" y=", "")
    .split("\n")
    .map((line) => {
      const values = line.split(",").map((e) => parseInt(e));
      const beacon = {
        x: values[2],
        y: values[3],
      };
      const sensor = {
        x: values[0],
        y: values[1],
      };
      return {
        sensor,
        beacon,
        distance: getDistance(sensor, beacon),
      };
    });
};

const getDistance = (a, b) => Math.abs(b.x - a.x) + Math.abs(b.y - a.y);

const getEmptyPositionsAtRow = (data, row, minRange, maxRange) => {
  const emptyPositions = new Set();
  data.forEach(({ sensor, distance }) => {
    // console.log("Sensor", sensor.x, sensor.y);
    const yMin =
      sensor.y - distance > minRange ? sensor.y - distance : minRange;
    const yMax =
      sensor.y + distance < maxRange ? sensor.y + distance : maxRange;
    const xMin =
      sensor.x - distance > minRange ? sensor.x - distance : minRange;
    const xMax =
      sensor.x + distance < maxRange ? sensor.x + distance : maxRange;
    if (row <= yMax && row >= yMin) {
      // console.log("  between yMin and yMax");
      for (let x = xMin; x <= xMax; x++) {
        if (getDistance({ x, y: row }, sensor) <= distance) {
          emptyPositions.add(`${x},${row}`);
        }
      }
    }
  });

  return emptyPositions;
};

const countEmptyPositionsAtRow = (data, row, minRange, maxRange) => {
  const emptyPositions = getEmptyPositionsAtRow(data, row, minRange, maxRange);
  data
    .map((e) => e.beacon)
    .forEach((beacon) => {
      emptyPositions.delete(`${beacon.x},${beacon.y}`);
    });
  return emptyPositions.size;
};

const getSensorAdjacentPositions = (
  { sensor, distance },
  minRange,
  maxRange
) => {
  const newDistance = distance + 1;
  const positions = [];
  const yMin = sensor.y - newDistance;
  const yMax = sensor.y + newDistance;
  const xMin = sensor.x - newDistance;
  const xMax = sensor.x + newDistance;
  const loopYMin =
    sensor.y - newDistance > minRange ? sensor.y - newDistance : minRange;
  const loopYMax =
    sensor.y + newDistance < maxRange ? sensor.y + newDistance : maxRange;
  for (let y = loopYMin; y <= loopYMax; y++) {
    const yDiff = Math.abs(sensor.y - y);
    const leftX = xMin + yDiff;
    const rightX = xMax - yDiff;
    if (leftX === rightX) {
      positions.push({ x: leftX, y });
    } else {
      if (leftX >= minRange && leftX <= maxRange) {
        positions.push({ x: leftX, y });
      }
      if (rightX >= minRange && rightX <= maxRange) {
        positions.push({ x: rightX, y });
      }
    }
  }
  return positions;
};

const renderSensors = (data, minRange, maxRange) => {
  const field = new Array(maxRange - minRange + 1)
    .fill()
    .map(() => new Array(maxRange - minRange + 1).fill("."));

  // const sample = 5;
  // data.slice(sample, sample + 1).forEach(({ sensor, beacon, distance }) => {
  data.forEach(({ sensor, beacon, distance }) => {
    if (
      sensor.x >= minRange &&
      sensor.x <= maxRange &&
      sensor.y >= minRange &&
      sensor.y <= maxRange
    )
      field[sensor.y][sensor.x] = "S";
    if (
      beacon.x >= minRange &&
      beacon.x <= maxRange &&
      beacon.y >= minRange &&
      beacon.y <= maxRange
    )
      field[beacon.y][beacon.x] = "B";

    getSensorAdjacentPositions(
      { sensor, distance },
      minRange,
      maxRange
    ).forEach((pos) => {
      field[pos.y][pos.x] = "#";
    });
  });

  field.forEach((e, index) => {
    let line = "";
    e.forEach((cell) => {
      line = line.concat(cell);
    });
    console.log(index.toString().padStart(2, " "), line);
  });
};

const isNotCovered = (position, data) => {
  return data.every(({ sensor, distance }) => {
    return !(getDistance(sensor, position) <= distance);
  });
};
const searchDistressBeacon = (input, minRange, maxRange) => {
  const data = parseDataInput(input);
  let beacon;
  data.every(({ sensor, distance }, index) => {
    console.log("Checking sensor" + index);
    return getSensorAdjacentPositions(
      { sensor, distance },
      minRange,
      maxRange
    ).every((pos) => {
      if (!isNotCovered(pos, data)) {
        return true;
      } else {
        beacon = pos;
        return false;
      }
    });
  });
  console.log(beacon);
  return beacon;
};

const getDistressBeaconFrequency = (input, minRange, maxRange) => {
  const beacon = searchDistressBeacon(input, minRange, maxRange);
  if (beacon) {
    return beacon.x * 4000000 + beacon.y;
  }
  return null;
};

// renderSensors(parseDataInput(testInput), 0, 20);

/*
console.log(
  "Empty positions at row 10 (test):",
  countEmptyPositionsAtRow(parseDataInput(testInput), 10, -5, 25)
);
*/
/*
console.log(
  "Empty positions at row 2000000:",
  countEmptyPositionsAtRow(parseDataInput(input), 2000000, 0, 4000000)
);
/*
/*
console.log(
  "Distress beacon frequency (test)",
  getDistressBeaconFrequency(testInput, 0, 20)
);
*/
console.log(
  "Distress beacon frequency",
  getDistressBeaconFrequency(input, 0, 4000000)
);

// use this line for in-depth debugging
// console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
