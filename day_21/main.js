const util = require("util");
const { input, testInput } = require("./input");

class Monkey {
  constructor(input, channel, part2 = false) {
    const split = input.split(" ");
    this.channel = channel;
    this.yelled = false;
    this.operandResults = {};
    this.id = split[0].replace(":", "");
    if (split.length > 2) {
      this.operand1 = split[1];
      this.operator = split[2];
      this.operand2 = split[3];
    } else {
      this.value = parseInt(split[1]);
    }
    if (this.id === "root" && part2) {
      this.checkEqual = true;
    }
  }

  notify(payload) {
    // console.log("Monkey", this.id, "received", payload);
    if (!this.yelled) {
      if (this.value) {
        this.yell();
      } else if (
        payload &&
        (payload.id === this.operand1 || payload.id === this.operand2)
      ) {
        this.operandResults[payload.id] = payload.value;
        const left = this.operandResults[this.operand1];
        const right = this.operandResults[this.operand2];
        if (left && right && this.checkEqual) {
          this.value = left - right;
          this.yell();
        } else if (left && right) {
          switch (this.operator) {
            case "+":
              this.value = left + right;
              break;
            case "-":
              this.value = left - right;
              break;
            case "*":
              this.value = left * right;
              break;
            case "/":
              this.value = left / right;
              break;
            default:
              console.error("invalid operator", this.operator);
          }
          this.yell();
        }
      }
    }
  }

  yell() {
    this.channel.push({ id: this.id, value: this.value });
    //console.log(`Monkey ${this.id} yelled ${this.value}`);
    this.yelled = true;
  }
}

const simulate = (input) => {
  const monkeys = [];
  const channel = [];
  input.split("\n").forEach((line) => monkeys.push(new Monkey(line, channel)));
  do {
    const payload = channel.shift();
    monkeys.forEach((monkey) => {
      monkey.notify(payload);
    });
  } while (channel.length > 0);
  const rootMonkey = monkeys.find((e) => e.id === "root");
  console.log("RootMonkey yelled", rootMonkey.value);
};

simulateUntilEqual = (input, startingScale) => {
  // binary search
  let currentValue = 0;
  let scale = startingScale;
  let found = false;
  while (!found) {
    let hitNegative = false;
    let testValue = 0;
    for (let i = 1; i <= 10; i++) {
      testValue = currentValue + i * scale;

      const monkeys = [];
      const channel = [];
      input
        .split("\n")
        .forEach((line) => monkeys.push(new Monkey(line, channel, true)));
      const rootMonkey = monkeys.find((e) => e.id === "root");
      const human = monkeys.find((e) => e.id === "humn");
      human.value = testValue;

      do {
        const payload = channel.shift();
        monkeys.forEach((monkey) => {
          monkey.notify(payload);
        });
      } while (channel.length > 0);

      console.log(
        `Human yelled: ${testValue}. RootMonkey yelled ${
          rootMonkey.value === 0
        } (${rootMonkey.value})`
      );

      if (rootMonkey.value === 0) {
        found = true;
        break;
      } else if (rootMonkey.value < 0) {
        hitNegative = true;
        currentValue += (i - 1) * scale;
        break;
      }
    }
    if (!found) {
      if (hitNegative) {
        scale /= 10;
      } else {
        scale *= 10;
      }
    }
  }
};

// simulate(input);
simulateUntilEqual(input, 100);

// use this line for in-depth debugging
// console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
