const { once } = require('events');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');
const filename = process.argv[2];

class Index {
	constructor() {
		this.planets = {};
	}
	

	get(name) {
		if (!this.planets[name]) {
			this.planets[name] = new Planet(name);
		}
		return this.planets[name];
	}

	getSumOrbits() {
		let sum = 0;
		const plantes = this.planets;
		Object.keys(this.planets).forEach(p => sum += plantes[p].getAllOrbits())
		return sum;
	}
}

class Planet {
	constructor(name) {
		this.name = name;
	}

	orbitsAround(planet) {
		this.inOrbit = planet;
	}

	getAllOrbits() {
		return this.inOrbit ? this.inOrbit.getAllOrbits() + 1 : 0;
	}
}

const index = new Index();

(async function processLineByLine() {
	try {
		const rl = createInterface({
			input: createReadStream(filename),
			crlfDelay: Infinity
		});

		rl.on('line', (line) => {
			if (line && line.indexOf(')' > 0)) {
				const [orbited, orbiter] = line.split(')');

				index.get(orbiter).orbitsAround(index.get(orbited));
			}
		});

		await once(rl, 'close');

		console.log('Total: ' + index.getSumOrbits());

	} catch (err) {
		console.error(err);
	}
})();


