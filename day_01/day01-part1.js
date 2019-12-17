const { once } = require('events');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');
const filename = process.argv[2];

let fuel_sum = 0;

(async function processLineByLine() {
	try {
		const rl = createInterface({
			input: createReadStream(filename),
			crlfDelay: Infinity
		});

		rl.on('line', (line) => {
			fuel_sum += (Math.floor(line / 3) - 2);
		});

		await once(rl, 'close');

		console.log("Required total sum of fuel: " + fuel_sum);
	} catch (err) {
		console.error(err);
	}
})();

