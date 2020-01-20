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



// simple, just test all multiples if any of them equals
const isMultiple = (vBase, vMult, d) => { 
	const [xb, yb] = vBase;  // -4/0
	const [xm, ym] = vMult;  // -5/0

	return alpha(xb, yb) == alpha(xm, ym);
	

	/*
	// all good if the same
	if (xb==xm && yb==ym) {
		return false;
	}
	for (let i=2; i<=d; i++) {

		if (xb*i == xm && yb*i == ym) {
			//console.log(`${xm}/${ym} is ${i} multiple of ${xb}/${yb}`)
			return true; 
		}
	}

	// x-axis is 0
	if (xb == 0 && xm == 0) {
		// y+
		if (yb > 0 && ym > yb) {
			return true;
		}

		// y-
		if (yb < 0 && ym < yb) {
			return true;
		}

	}

	// y-axis is zero
	if (yb ==0 && ym == 0) {
		// x+
		if (xb > 0 && xm > xb) {
			return true;
		}

		// x-
		if (xb < 0 && xm < xb) {
			return true;
		}
	
	}

	return false;
	*/
}

const isMultipleOLD = (vBase, vMult) => { 
	const [xb, yb] = vBase;
	const [xm, ym] = vMult;

	const oneLessZero = (a,b) => (a<0 || b<0) && !(a<0 && b<0)
	const bothNegative = (a,b) => (a<0 && b<0)
	const bothPositive = (a,b) => (a>0 && b>0)

	// identity -> NOT multiple
	if (xb==xm && yb==ym) return false;

	// if one axis has different signs, not multiple (in the sense of hiding other asteroids)
	if (oneLessZero(xb, xm) || oneLessZero(yb, ym)) {
		return false;
	}

	
	// x-axis is zero, vmult mult be same sign and farther away from 0 than vbase
	if (!xb && !xm) { 
		if (bothPositive(yb, ym)) {
			return ym > yb;
		}
		if (bothNegative(yb, ym)) {
			return ym < yb;
		}
		return false;
	}
	// y-axis is zero, vmult mult be same sign and farther away from 0 than vbase
	if (!yb && !ym) { 
		if (bothPositive(xb, xm)) {
			return xm > xb;
		}
		if (bothNegative(xb, xm)) {
			return xm < xb;
		}
		return false;
	}

	// if there is any zero left, -> not multiple
	if (!xb || !yb || !xm || !ym) {
		return false;
	}


	// calculate regular multplicity for all other cases, take care that values differ (because i.e. 1%1 returns zero)
	return !(xm % xb + ym%yb) && xb!=xm && yb!=ym; 
};

const filterMultiples = (vectors, d) => {
	let v;
	const multiples = [];
	for(let i=0; i<vectors.length; i++) {
		for(let j=0; j<vectors.length; j++) {
			if (i==j) continue;
			if (isMultiple(vectors[i], vectors[j], d)) {
				multiples.push(vectors[j]);
			}
		}	
	}

	return vectors.filter(v=>multiples.indexOf(v)<0);

/*
	let prevLength = 0;
	let result = vectors.slice();
	for(let i=0; i<result.length; i++) {
		v = result[i];
		[x,y] = v;
		prevLength = result.length;
		result = result.filter( rv => !isMultiple(v, rv)  );
		if (result.length != prevLength) {
			// something was filtered out -> reset the loop
			i = 0;
		}
		//if (!result.filter( rv => isMultiple(v, rv, d)  ).length) {
			//result.push(v);
		//}
	}
	return result;
*/
}

const alpha = (x, y) => {
	const precision = 10000;
	const length = Math.sqrt(x*x + y*y);
	//return Math.acos(x/length);

	return Math.round((x/length)*precision) + ':' + Math.round((y/length)*precision); 

}


const visibleAsteroids = (mapString) => {

	// create searchable datastructures
	const yxMap = makeMap(mapString);
	const xyMap = transpose(yxMap);
	const d = Math.max(yxMap.length, xyMap.length);
	console.log(`d: ${d}`);

	const result = [...yxMap];

	// get a list of all asteroid positions
	const asteroids = allAsteroids(xyMap);
	let x,y, v;
	let vectors, alphas;
	let best = {x:0, y:0, a:0};
	for(let i=0; i<asteroids.length; i++) {
		[x,y] = asteroids[i];

		// for each asteroid, get a list of relative vectors to all asteroids
		vectors = allVectors(xyMap, x, y);
		alphas = vectors.map(u=>alpha(u[0], u[1]));

		v = Array.from(new Set(alphas));

		// filter list for multiples
		//v = filterMultiples(vectors, d);
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
	}

	console.log(best);
	return result;

}




if (testing) {

	let testData = [
		// identity
		{b: [-1, -1], m: [-1, -1], expect: false},
		{b: [1, 1], m: [1, 1], expect: false},
		{b: [-1, 1], m: [-1, 1], expect: false},
		{b: [1, -1], m: [1, -1], expect: false},

		{b: [ 0, -1], m: [-1, -1], expect: false},
		{b: [-1,  0], m: [-1, -1], expect: false},
		{b: [ 0, -1], m: [ 0, -1], expect: false},
		{b: [-1,  0], m: [ 0, -1], expect: false},
		{b: [ 0, -1], m: [-1,  0], expect: false},
		{b: [-1,  0], m: [-1,  0], expect: false},

		{b: [ 0,  1], m: [ 1,  1], expect: false},
		{b: [ 1,  0], m: [ 1,  1], expect: false},
		{b: [ 0,  1], m: [ 0,  1], expect: false},
		{b: [ 1,  0], m: [ 0,  1], expect: false},
		{b: [ 0,  1], m: [ 1,  0], expect: false},
		{b: [ 1,  0], m: [ 1,  0], expect: false},

		{b: [-4,  0], m: [-2,  0], expect: false},
		{b: [-2,  0], m: [-4,  0], expect: true},
		{b: [ 0, -4], m: [ 0, -2], expect: false},
		{b: [ 0, -2], m: [ 0, -4], expect: true},

		{b: [ 4,  0], m: [ 2,  0], expect: false},
		{b: [ 2,  0], m: [ 4,  0], expect: true},
		{b: [ 0,  4], m: [ 0,  2], expect: false},
		{b: [ 0,  2], m: [ 0,  4], expect: true},


		{b: [-4, -2], m: [-2, -1], expect: false},
		{b: [-2, -1], m: [-4, -2], expect: true},
		{b: [-2, -4], m: [-1, -2], expect: false},
		{b: [-1, -2], m: [-2, -4], expect: true},

		{b: [ 4,  2], m: [ 2,  1], expect: false},
		{b: [ 2,  1], m: [ 4,  2], expect: true},
		{b: [ 2,  4], m: [ 1,  2], expect: false},
		{b: [ 1,  2], m: [ 2,  4], expect: true},

		// test for testMap
		// vectors from 0/0
		{b: [ 0,  1], m: [ 1,  1], expect: false},
		{b: [ 0,  1], m: [ 2,  1], expect: false},
		{b: [ 0,  1], m: [ 3,  1], expect: false},
		{b: [ 0,  1], m: [ 3,  2], expect: false},

		{b: [ 1,  1], m: [ 0,  1], expect: false},
		{b: [ 1,  1], m: [ 2,  1], expect: false},
		{b: [ 1,  1], m: [ 3,  1], expect: false},
		{b: [ 1,  1], m: [ 3,  2], expect: false},

		{b: [ 2,  1], m: [ 0,  1], expect: false},
		{b: [ 2,  1], m: [ 1,  1], expect: false},
		{b: [ 2,  1], m: [ 3,  1], expect: false},
		{b: [ 2,  1], m: [ 3,  2], expect: false},

		{b: [ 3,  1], m: [ 0,  1], expect: false},
		{b: [ 3,  1], m: [ 1,  1], expect: false},
		{b: [ 3,  1], m: [ 2,  1], expect: false},
		{b: [ 3,  1], m: [ 3,  2], expect: false},

		{b: [ 3,  2], m: [ 0,  1], expect: false},
		{b: [ 3,  2], m: [ 1,  1], expect: false},
		{b: [ 3,  2], m: [ 2,  1], expect: false},
		{b: [ 3,  2], m: [ 3,  1], expect: false},

		{b: [ 0,  2], m: [-1, -1], expect: false},
		{b: [ 0,  2], m: [-1,  0], expect: false},
		{b: [ 0,  2], m: [ 1,  0], expect: false},
		{b: [ 0,  2], m: [ 2,  0], expect: false},
		{b: [ 0,  2], m: [ 2,  1], expect: false},

		{b: [ 0,  2], m: [ 2,  1], expect: false},
	];
	
	console.log('test isMultiple');
	console.log(testData.map(d=>isMultiple(d.b,d.m, 10) == d.expect ? null : d).filter(e=>e));



} else {

const t1 = `
.#..#
.....
#####
....#
...##
`;

const t2 = `
......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####
`;

const t3=`
#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.
`;

const t4=`
.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..
`;

const tt=`
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
###.##.####.##.#..##
`;

	//console.log(tt.replace(/#/g, ' X |').replace(/\./g, '   |'));
	const vis = visibleAsteroids(asteroid_map);
	//console.log(vis.map(line => line.join(' ').replace(/\./g, ' .')).join("\n"));
	
}
