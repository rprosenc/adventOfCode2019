const testing = process.argv.indexOf('--test')>0 || process.argv.indexOf('-t')>0;


asteroid_map = `
#..#.#.#.######..#.#...##
##.#..#.#..##.#..######.#
.#.##.#..##..#.#.####.#..
.#..##.#.#..#.#...#...#.#
#...###.##.##..##...#..#.
##..#.#.#.###...#.##..#.#
###.###.#.##.##....#####.
.#####.#.#...#..#####..#.
.#.##...#.#...#####.##...
######.#..##.#..#.#.#....
###.##.#######....##.#..#
.####.##..#.##.#.#.##...#
##...##.######..##..#.###
...###...#..#...#.###..#.
.#####...##..#..#####.###
.#####..#.#######.###.##.
#...###.####.##.##.#.##.#
.#.#.#.#.#.##.#..#.#..###
##.#.####.###....###..##.
#..##.#....#..#..#.#..#.#
##..#..#...#..##..####..#
....#.....##..#.##.#...##
.##..#.#..##..##.#..##..#
.##..#####....#####.#.#.#
#..#..#..##...#..#.#.#.##
`


const testMap = `
#...
####
...#
`


const makeMap = str => str
			.split("\n")
			.filter(l => l.trim())
			.map(l => l.trim().split(''));

const transpose = (map2d) => {
	const result = [];
	for(let y=0; y<map2d.length; y++) {
		for(let x=0; x<map2d[y].length; x++) {
			if (!result[x]) {
				result [x] = [];
			}

			result [x][y] = map2d[y][x];
		}
	}

	return result;
}


const newMap = (map2d) => {
	const result = [];
	for(let x=0; x<map2d.length; x++) {
		for(let y=0; y<map2d[x].length; y++) {
			if (!result[x]) {
				result [x] = [];
			}

			result [x][y] = 0;
		}
	}

	return result;
}

const allAsteroids = (map2d) => {
	const result = [];
	for(let x=0; x<map2d.length; x++) {
		for(let y=0; y<map2d[x].length; y++) {
			if (map2d[x][y] == '#') {
				result.push( [x,y] );
			}
		}
	}

	return result;
}


// find relative vectors from position px/py to all asteroids 
const allVectors = (map2d, px, py) => {
	const result = [];
	for(let x=0; x<map2d.length; x++) {
		for(let y=0; y<map2d[x].length; y++) {
			// should avoid vector [0,0]
			if (map2d[x][y] == '#' && ((x-px)||(y-py)) ) {
				result.push( [x-px, y-py] );
			}
		}
	}

	return result;
}




const alpha = (x, y) => {
	const precision = 10000;
	const length = Math.sqrt(x*x + y*y);
	//return Math.acos(x/length);

	const sin = Math.round((x/length)*precision);
	const cos = Math.round((y/length)*precision); 

	const key = sin + '/' + cos;

	return { x, y, sin, cos, length, key };
}

const quater = (x,y) => {
	if (x>=0 && y<=0) return 1;
	if (x>=0 && y>0) return 2;
	if (x<0 && y>=0) return 3;
	if (x<0 && y<0) return 4;

}

const sortFn = (a, b) => {
	const qA = quater(a.x, a.y);
	const qB = quater(b.x, b.y);

	if (qA < qB) {
		return -1;
	}
	if (qA > qB) {
		return 1;
	}

	// same fucking quater

	if (qA == 1 || qA == 4) {
		if (a.sin < b.sin) {
			return -1;
		}
		if (a.sin > b.sin) {
			return 1;
		}
		return a.length > b.length ? 1 : -1;
		
	}


	if (a.sin < b.sin) {
		return 1;
	}
	if (a.sin > b.sin) {
		return -1;
	}

	return a.length > b.length ? 1 : -1;
}


const visibleAsteroids = (mapString) => {

	// create searchable datastructures
	const yxMap = makeMap(mapString);
	const xyMap = transpose(yxMap);
	const d = Math.max(yxMap.length, xyMap.length);
	console.log(`d: ${d}`);

	// get a list of all asteroid positions
	const asteroids = allAsteroids(xyMap);
	let x,y, v;
	let vectors, alphas;
	let best = {x:0, y:0, a:0};
	//for(let i=0; i<asteroids.length; i++) {
		//[x,y] = asteroids[i];
		// final data
		x = 11;
		y = 19;

		// test data t1
		//x = 8;
		//y = 3;

		// test data tt
		//x = 11;
		//y = 13;

		// for each asteroid, get a list of relative vectors to all asteroids
		vectors = allVectors(xyMap, x, y);
		alphas = vectors.map(u=>alpha(u[0], u[1]));


		alphas.sort(sortFn);

		const result = [];
		const keys = [];

		alphas.forEach(a => {
			if (!keys.includes(a.key)) {
				result.push(a);
				keys.push(a.key);
			}
		})

		//console.log(result.map((a, i)=>({i: i+1, x:a.x, y:a.y, length: a.length})));
		result.map((a, i)=>console.log(({
			i: i+1, 
			x:a.x+x, 
			y:a.y+y, 
			sin: a.sin,
			q: quater(a.x, a.y),
			ax: a.x,
			ay: a.y
		})));
		//console.log(result[199]);
		console.log('result:');
		console.log((x+result[199].x)*100 + (y+result[199].y));

		return;

		// filter list for multiples
		//console.log(`visible asteroids loop for ${x}/${y}: ${v.length}`)
		result[y][x] = v.length;

		if (x==1 && y==0) {
			//console.log(vectors, v);
		}


		if (v.length > best.a) {
			best.x = x;
			best.y = y;
			best.a = v.length;
		}
	//}

	return best;

}

const t1 = `
.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....#...###..
..#.#.....#....##
`;

const tt = `
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`

// lazer: x = 8, y = 3;

//console.log(tt.replace(/#/g, ' X |').replace(/\./g, '   |'));
const vis = visibleAsteroids(asteroid_map);
//console.log(vis.map(line => line.join(' ').replace(/\./g, ' .')).join("\n"));
	
