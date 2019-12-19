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
		this.satelites = [];
		this.orbiting = null;
	}

	addSatelite(planet) {
		this.satelites.push(planet);
	}

	orbitsAround(planet) {
		this.orbiting = planet;
		planet.addSatelite(this);
	}

	is(other) {
		return this.name == other.name;
	}

	getAllOrbits() {
		return this.orbiting ? this.orbiting.getAllOrbits() + 1 : 0;
	}

	searchRouteTo(destination, from) {
		if (this.orbiting && this.orbiting.is(destination)) {
			return [this.orbiting];
		}

		if (this.satelites.indexOf(destination) >= 0) {
			return [ this.satelites[this.satelites.indexOf(destination)] ];
		}

		const self = this;
		const pathToDestination = this.satelites.concat(this.orbiting?[this.orbiting]:[]).filter(p => p !== from)
			.map(p => p.searchRouteTo(destination, self)).flat();

		return pathToDestination.length ? pathToDestination.concat(this) : [];
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

		const you = index.get('YOU');
		const santa = index.get('SAN');

		console.log(you.searchRouteTo(santa).length-2)

	} catch (err) {
		console.error(err);
	}
})();


