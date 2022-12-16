const { input, testInput, debugInput, debugInput2, debugInput3 } = require('./input')

const parsePairs = input => {
	const packets = []
	let tempObj = {}
	input.split('\n').forEach((l, index) => {
		const line = l.trim()
		if (line.length === 0) {
			packets.push({ ...tempObj })
			tempObj = {}
		} else if (!tempObj.left) {
			tempObj.left = JSON.parse(line)
		} else {
			tempObj.right = JSON.parse(line)
		}
	})
	packets.push({ ...tempObj })
	return packets
}

const parsePairsDebug = input => {
	const packets = []
	let tempObj = {}
	input.split('\n').forEach((line, index) => {
		if (line === 'true') {
			packets.push({ ...tempObj, expected: 1 })
			tempObj = {}
		} else if (line === 'false') {
			packets.push({ ...tempObj, expected: -1 })
			tempObj = {}
		} else if (!tempObj.left) {
			tempObj.left = JSON.parse(line)
		} else {
			tempObj.right = JSON.parse(line)
		}
	})
	return packets
}

// used to handle extreme cases where a 0 compared to another element is considered false instead of a number itself
const isIntOrArray = element => Number.isInteger(element) || Array.isArray(element)

// return 1 if left is smaller, 0 if equal, -1 if right is smaller
const compare = (left, right) => {
	console.log('received', '\n', left, '\n', right)
	const isLeftInt = Number.isInteger(left)
	const isRightInt = Number.isInteger(right)
	if (isLeftInt && !isRightInt) {
		console.log('>> retry with left as array')
		return compare([left], right)
	} else if (isRightInt &! isLeftInt) {
		console.log('>> retry with right as array')
		return compare(left, [right])
	} else if (isRightInt && isLeftInt) {
		if (left < right) {
			console.log('>>>> left is smaller')
			return 1	
		} else if (right < left) {
			console.log('>>>> right is smaller')
			return -1
		}
		console.log('>> both are equal, going next')
		return 0
	} else {
		let res = 0
		let index = 0
		let stop = false
			console.log('>> comparing arrays')
		
		while (!stop) {
			const nextLeft = isIntOrArray(left[index])
			const nextRight = isIntOrArray(right[index])
			console.log('nextLeft', nextLeft, left[index], '\nnextRight', nextRight, right[index])
			if (!nextLeft &! nextRight) {
				stop = true
				console.log(">> arrays compared and both are equal, going next")
			} else if (!nextLeft && nextRight) {
				stop = true
				res = 1
				console.log(">>>> left array ran out")
			} else if (!nextRight && nextLeft) {
				stop = true
				res = -1
				console.log(">>>> right array ran out")
			} else {
				console.log(">> comparing arrays at index", index)
				res = compare(left[index], right[index])
				if (res !== 0) {
					stop = true
				} else {
					index++
				}
			}
		}
		return res
	}
}

const countRightOrderPackets = input => {
	return parsePairs(input)
		.map(pair => compare(pair.left, pair.right))
		.reduce((acc, value, index) => {
			if (value === 1) {
				return acc + index + 1
			}
			return acc
		})
}

const debug = input => {
	return parsePairsDebug(input)
		.map(pair => compare(pair.left, pair.right) === pair.expected)
}

// console.log(countRightOrderPackets(input))
// console.log(countRightOrderPackets(testInput))
// console.log(countRightOrderPackets(debugInput2))
/*
console.log(countRightOrderPackets(`[[[1,6,[1,9,0,9],6]]]
[[],[[[5,6,3],6,[6,5,3,3]],8,3],[],[4]]`))
*/
/*
console.log(countRightOrderPackets(`[[1],2]
[[[1]],1]`))
*/
console.log(debug(debugInput3))
/* console.log(debug(`[[[1,0,[6,3,1,8]]]]
[[[1]],[[2,[2,2,9,1],[7],6,3],[[],0],6,[[2,2],10],[4,5,[1,4]]]]
false`)) */
/*
[[[1,6,[1,9,0,9],6]]]
[[],[[[5,6,3],6,[6,5,3,3]],8,3],[],[4]]
*/
// answer is between 5870 and 5985, 5904 failed