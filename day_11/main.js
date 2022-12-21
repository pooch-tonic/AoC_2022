const { input, testInput } = require("./input");

class Monkey {
  constructor(args, monkeys, id) {
    this.id = id;
    this.items = args[1]
      .replaceAll(",", "")
      .split(" ")
      .slice(4)
      .map((e, i) => ({ id: `${this.id}_${i}`, value: parseInt(e) }));
    this.inspectCount = 0;
    // this.calculateWorryLevel = Function('old', `return Math.floor((${args[2].split('=')[1].trimStart()}) / 3)`)
    this.calculateWorryLevel = Function(
      "old",
      `return ${args[2].split("=")[1].trimStart()}`
    );
    this.divider = parseInt(args[3].split(" ").pop());
    this.trueDest = parseInt(args[4].split(" ").pop());
    this.falseDest = parseInt(args[5].split(" ").pop());
    this.monkeys = monkeys;
  }

  inspectItems() {
    const itemsToThrow = [];
    this.items.forEach((item, index) => {
      // item.value = this.calculateWorryLevel(item.value % 969960)
      item.value = this.calculateWorryLevel(item.value);
      if (item.value % this.divider === 0) {
        itemsToThrow.push({ item, dest: this.trueDest });
      } else {
        itemsToThrow.push({ item, dest: this.falseDest });
      }
    });
    itemsToThrow.forEach((entry) => {
      this.throwItem(entry.item, entry.dest);
      this.inspectCount++;
    });
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(item) {
    this.items.splice(
      this.items.findIndex((e) => e.id === item.id),
      1
    );
  }

  throwItem(item, monkeyIndex) {
    this.monkeys[monkeyIndex].addItem(item);
    this.removeItem(item);
  }
}

const parseMonkeys = (input) => {
  const monkeys = [];
  const splitInput = input.split("\n");
  const monkeysCount = splitInput.length / 7;
  for (let i = 0; i < monkeysCount; i++) {
    monkeys.push(new Monkey(splitInput.slice(i * 7, i * 7 + 6), monkeys, i));
  }
  return monkeys;
};

const executeRounds = (rounds, monkeys) => {
  for (let i = 1; i <= rounds; i++) {
    monkeys.forEach((monkey) => {
      monkey.inspectItems();
    });
  }
};

const getMonkeyBusinessLevel = (rounds, input) => {
  const monkeys = parseMonkeys(input);
  console.log(monkeys);
  const inspectCounts = [];
  executeRounds(rounds, monkeys);
  monkeys.forEach((monkey, index) => {
    // console.log(monkey.calculateWorryLevel)
    console.log(
      "Monkey " +
        index +
        ": " +
        monkey.items.map((e) => e.value) +
        " (" +
        monkey.inspectCount +
        ")"
    );
    inspectCounts.push(monkey.inspectCount);
  });
  return inspectCounts
    .sort((a, b) => a - b)
    .slice(-2)
    .reduce((acc, val) => acc * val);
};

console.log(getMonkeyBusinessLevel(1, testInput));
