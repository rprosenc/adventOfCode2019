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
			if (line) {
				fuel_for_module = fuelForMass(line);
				fuel_for_fuel   = fuelForFuel(fuel_for_module);
				fuel_sum += fuel_for_module + fuel_for_fuel;
			}
		});

		await once(rl, 'close');

		console.log("Required total sum of fuel: " + fuel_sum);

	} catch (err) {
		console.error(err);
	}
})();


const fuelForMass = function(mass) {
	const fuel = (Math.floor(mass / 3) - 2);
	if (fuel > 0) {
		return fuel;
	}
	return 0;
}


const fuelForFuel = function(fuel_mass) {
	let needed_fuel = fuelForMass(fuel_mass);
	if (needed_fuel > 0) {
		needed_fuel += fuelForFuel(needed_fuel);
	}
	return needed_fuel;
}

