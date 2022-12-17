const { input, testInput } = require("./input");

const addxCycles = 2;
const firstSampleAtCycle = 40;
const sampleCycleInterval = 40;
const samplesCount = 6;

const getInstructions = (input) => input.split("\n").map((e) => e.split(" "));

const getSamples = (input) => {
  const instructions = getInstructions(input);
  const samples = [];
  let x = 1;
  let stop = false;
  let cycle = 0;
  let instructionIndex = 0;
  let addxProcessing = 0;
  let nextSampleCycle = firstSampleAtCycle;
  while (!stop) {
    cycle++;
    if (cycle === nextSampleCycle) {
      samples.push({ cycle, x });
      if (samples.length < samplesCount) {
        nextSampleCycle += sampleCycleInterval;
      }
    }
    if (addxProcessing > 0) {
      addxProcessing++;
      if (addxProcessing >= addxCycles) {
        addxProcessing = 0;
        x += parseInt(instructions[instructionIndex][1]);
        instructionIndex++;
      }
    } else if (instructions[instructionIndex][0] !== "noop") {
      addxProcessing++;
    } else {
      instructionIndex++;
    }
    if (!instructions[instructionIndex]) {
      stop = true;
    }
  }
  return samples;
};

const drawCRT = (input) => {
  const instructions = getInstructions(input);
  let x = 1;
  let stop = false;
  let cycle = 0;
  let instructionIndex = 0;
  let addxProcessing = 0;
  let nextSampleCycle = firstSampleAtCycle;
  let CRTrow = "";
  while (!stop) {
    cycle++;
    if (Math.abs(x - (cycle % sampleCycleInterval) + 1) < 2) {
      CRTrow += "# ";
    } else {
      CRTrow += ". ";
    }
    if (cycle === nextSampleCycle) {
      nextSampleCycle += sampleCycleInterval;
      console.log(CRTrow);
      CRTrow = "";
    }
    if (addxProcessing > 0) {
      addxProcessing++;
      if (addxProcessing >= addxCycles) {
        addxProcessing = 0;
        x += parseInt(instructions[instructionIndex][1]);
        instructionIndex++;
      }
    } else if (instructions[instructionIndex][0] !== "noop") {
      addxProcessing++;
    } else {
      instructionIndex++;
    }
    if (!instructions[instructionIndex]) {
      stop = true;
    }
  }
};

//console.log(getSamples(input).reduce((acc, e) => acc += e.cycle * e.x, 0))
drawCRT(input);
