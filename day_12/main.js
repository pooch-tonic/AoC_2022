const { input, testInput } = require("./input");

const createGraph = (input) => {
  const graph = [];
  input.split("\n").forEach((row, rowIndex) => {
    row.split("").forEach((letter, colIndex) => {
      const base = {
        id: `${rowIndex}-${colIndex}`,
        row: rowIndex,
        col: colIndex,
      };
      if (letter === "S") {
        graph.push({ start: true, height: "a".charCodeAt(), ...base });
      } else if (letter === "E") {
        graph.push({ end: true, height: "z".charCodeAt(), ...base });
      } else {
        graph.push({ path: true, height: letter.charCodeAt(0), ...base });
      }
    });
  });
  graph.forEach((node) => {
    if (!node.end) {
      const neighbors = [
        graph.find((e) => e.id === `${node.row - 1}-${node.col}`),
        graph.find((e) => e.id === `${node.row}-${node.col + 1}`),
        graph.find((e) => e.id === `${node.row + 1}-${node.col}`),
        graph.find((e) => e.id === `${node.row}-${node.col - 1}`),
      ];
      node.neighbors =
        neighbors.filter((e) => !!e && e.height - node.height < 2) || [];
    }
  });
  return graph;
};

const explore = (track, shortestPathObj, node) => {
  track.push(node);
  if (node.end) {
    console.log(track.map((t) => t.id));
    if (
      shortestPathObj.steps === 0 ||
      track.length < shortestPathObj.path.length
    ) {
      shortestPathObj.steps = track.length - 1;
      shortestPathObj.path = track;
    }
  } else {
    node.neighbors.forEach((neighbor) => {
      if (track.every((k) => k.id !== neighbor.id)) {
        explore([...track], shortestPathObj, neighbor);
      }
    });
  }
};

const findShortestPath = (graph) => {
  const startNode = graph.find((e) => e.start);
  const endNode = graph.find((e) => e.end);
  const track = [];
  const shortestPathObj = { steps: 0, path: [] };
  explore(track, shortestPathObj, startNode);
  return shortestPathObj;
};

console.log(findShortestPath(createGraph(input)).steps);
