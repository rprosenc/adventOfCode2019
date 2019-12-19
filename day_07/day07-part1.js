const verbose = process.argv[2] == '--verbose' || process.argv[2] == '-v';


let testProgramm1 = [3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0]

let amplifierControllerProgramm = [3,8,1001,8,10,8,105,1,0,0,21,30,51,76,101,118,199,280,361,442,99999,3,9,102,5,9,9,4,9,99,3,9,102,4,9,9,1001,9,3,9,102,2,9,9,101,2,9,9,4,9,99,3,9,1002,9,3,9,1001,9,4,9,102,5,9,9,101,3,9,9,1002,9,3,9,4,9,99,3,9,101,5,9,9,102,4,9,9,1001,9,3,9,1002,9,2,9,101,4,9,9,4,9,99,3,9,1002,9,2,9,1001,9,3,9,102,5,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,99];


const intcode = function(programm, inputCb, outputCb) {
	let memory = programm.slice(0);

	let stack;
	let instructionLength = 4;
	let instructionValue;

	let pc = 0;

	const read = (val, buffer) => 1 * (posMode(i, buffer) ? memory[val] : val);

	// load and increment
	const ldi = () => {
		log('pc: '+ pc +' -> '+ memory[pc] +'  ('+ memory[memory[pc]] +')');
		return memory[pc++];
	}
	const add = () => {
		p1 = ldi();
		p2 = ldi();
		p3 = ldi();

		let buffer1 = read(p1, 1);
		let buffer2 = read(p2, 2);
		let buffer3 = 1*p3;

		memory[buffer3] = buffer1 + buffer2;
		log('add');
		log('  buffer1: '+ buffer1);
		log('  buffer2: '+ buffer2);
		log('  written '+ memory[buffer3] +' to memory['+ buffer3 +']');
	}
	const mul = () => {
		p1 = ldi();
		p2 = ldi();
		p3 = ldi();

		let buffer1 = read(p1, 1);
		let buffer2 = read(p2, 2);
		let buffer3 = 1*p3;

		memory[buffer3] = buffer1 * buffer2;
		log('mul');
		log('  buffer1: '+ buffer1);
		log('  buffer2: '+ buffer2);
		log('  written '+ memory[buffer3] +' to memory['+ buffer3 +']');
	}
	const inp = () => {
		p1 = ldi();
		memory[p1] = inputCb();
		log('input: written '+ memory[p1] +' to memory['+ p1 +']');
	}
	const out = () => {
		p1 = ldi();

		let buffer1 = read(p1, 1);
		outputCb(buffer1);
	}
	const jmt = () => {
		p1 = ldi();
		p2 = ldi();
		
		let buffer1 = read(p1, 1);
		let buffer2 = read(p2, 2);
		if (buffer1 != 0) {
			pc = buffer2;
			log('jmt: set pc to '+ pc);
		} else {
			log('jmt: did nothing');
		}
	}
	const jmf = () => {
		p1 = ldi();
		p2 = ldi();
		
		let buffer1 = read(p1, 1);
		let buffer2 = read(p2, 2);
		if (buffer1 == 0) {
			pc = buffer2;
			log('jmf: set pc to '+ pc);
		} else {
			log('jmf: did nothing');
		}
	}
	const lt = () => {
		p1 = ldi();
		p2 = ldi();
		p3 = ldi();
		
		let buffer1 = read(p1, 1);
		let buffer2 = read(p2, 2);
		let buffer3 = 1*p3;

		memory[buffer3] = buffer1 < buffer2 ? 1 : 0;
		log('lt: written '+ memory[buffer3] +' to memory['+ buffer3 +']');
	}
	const eq = () => {
		p1 = ldi();
		p2 = ldi();
		p3 = ldi();
		
		let buffer1 = read(p1, 1);
		let buffer2 = read(p2, 2);
		let buffer3 = 1*p3;

		memory[buffer3] = buffer1 == buffer2 ? 1 : 0;
		log('eq: written '+ memory[buffer3] +' to memory['+ buffer3 +']');
	}


	//
	// MAIN LOOP
	//
	while(true) {
		i = ldi(); 
		op = opCode(i);
		if (op == 99) {
			return 'terminated';
		}

		if (pc >= programm.length) {
			return '!pc out of bounds ('+ pc +')';
		}

		switch(op) {
			case 1:	add(); break;
			case 2: mul(); break;
			case 3:	inp();  break;
			case 4: out(); break;
			case 5: jmt(); break;
			case 6: jmf(); break;
			case 7: lt(); break;
			case 8: eq(); break;
			default: return '!illegal instruction ('+ op +')';
		}
	}
}

// last tow digits of instruction value
const opCode = v => {
	log('opCode('+ v +') -> ' + (v%100));
	return v % 100;
}

// v .. instruction value
// p .. parameter number, starting with 1
const posMode = (v,p) => {
	let m = 1 * ( (''+v).split('').reverse().splice(2)[p-1] || 0 );
	return !m;
}

// debugging log()
const log = (v) => verbose && console.log('.         '+ v);


let phaseSignal= 0;
const getNewPhaseSignal = () => (phaseSignal<100000) ? phaseSignal++ : null;

let wire = 0;
let bestThrust = 0;
let bestPhase = 0;

let phase = 0;
let phaseSettings = [];
const cache = {};
let cacheHits = 0;
while(phase !== null) {
	phase = getNewPhaseSignal();
	wire = 0;

	// phase ending in at least two zeros, NEXT
	if (phase%100 == 0) {
		continue;
	}

	phaseSettings = (''+(phase/10000.0)).replace('.','').split('');

	// last zero might got lost...
	if (phaseSettings.length == 4) {
		phaseSettings.push('0');
	}
  	
	// found either digit higher than 4, or a digit twice
 	if (phaseSettings.filter((s,i) => s>4 || phaseSettings.lastIndexOf(s)>i ).length > 0) {
		continue;
	};

	console.log(phaseSettings);
	for(let i=0;i<5;i++) {
		let signal = 1*phaseSettings[i] || 0;
		let inputs = [wire,signal]
		let cacheKey = inputs.join('--');
		if (cache[cacheKey] != null) {
			wire = cache[cacheKey];
			cacheHits++;
		} else {
			intcode(amplifierControllerProgramm, ()=>inputs.pop(), (v)=>wire=v);
			cache[cacheKey] = wire;
		}

	}
	if (wire > bestThrust) {
		bestThrust = wire;
		bestPhase = phaseSettings.join('');
		//console.log(phase+ ': ' + wire);
	}
}

console.log('cache size: '+ Object.keys(cache).length);
console.log('cache hits: '+ cacheHits);
console.log('cache hit ratio: '+ Math.round((cacheHits*100) / (Object.keys(cache).length+cacheHits)) +'%');
console.log();
console.log('bestThrust: '+ bestThrust);
console.log('bestPhase: '+ bestPhase);

console.log('---');


