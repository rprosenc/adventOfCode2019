const verbose = process.argv.indexOf('--verbose')>0 || process.argv.indexOf('-v')>0;
const verboseTrace = process.argv.indexOf('--trace')>0 || process.argv.indexOf('-t')>0;

const testProgramm1 = [3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26, 27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5];
const testProgramm2 = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54, -5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4, 53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10];

const amplifierControllerProgramm = [3,8,1001,8,10,8,105,1,0,0,21,30,51,76,101,118,199,280,361,442,99999,3,9,102,5,9,9,4,9,99,3,9,102,4,9,9,1001,9,3,9,102,2,9,9,101,2,9,9,4,9,99,3,9,1002,9,3,9,1001,9,4,9,102,5,9,9,101,3,9,9,1002,9,3,9,4,9,99,3,9,101,5,9,9,102,4,9,9,1001,9,3,9,1002,9,2,9,101,4,9,9,4,9,99,3,9,1002,9,2,9,1001,9,3,9,102,5,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,99];



class Amplifier {
	constructor(programm, phase) {
		this.memory = programm.slice(0);
		this.pc = 0;
		this.phase = phase;
		this.input = 0;
		this.phaseInitialized = false;
		this.output = 0;
		this.running = true; // aaah. not nice, but easy
	}

	getOutput() {
		return this.output;
	}

	isRunning() {
		return this.pc !== null;
	}

	run() {
		const that = this;
		const inputCb = (suspendCb) => {
			if (that.input === null) {
				suspendCb();
			}
			if (that.phaseInitialized) {
				log('phase '+ that.phase +' input: ' + that.input);
				const input = that.input;
				that.input = null;
				return input;
			} else {
				that.phaseInitialized = true;
				log('phase '+ that.phase +' initializing phase');
				return that.phase;
			}
		}
		const outputCb = (value, suspendCb) => {
			log('phase '+ that.phase +' output: ' + value);
			that.output = value;
			suspendCb();
		}
		this.pc = compute(this.memory, this.pc, inputCb, outputCb);
	}
}

const intcode = function(programm, inputCb, outputCb) {
	let memory = programm.slice(0);
	return compute(memory, 0, inputCb, outputCb);

}

const compute = function(memory, pc, inputCb, outputCb) {

	let stack;
	let instructionLength = 4;
	let instruction;
	let suspend = false;

	const read = (val, buffer) => 1 * (posMode(instruction, buffer) ? memory[val] : val);

	const doSuspend = () => suspend = true;

	// last tow digits of instruction value
	const opCode = v => {
		trace('opCode('+ v +') -> ' + (v%100));
		return v % 100;
	}

	// v .. instruction value
	// p .. parameter number, starting with 1
	const posMode = (v,p) => {
		let m = 1 * ( (''+v).split('').reverse().splice(2)[p-1] || 0 );
		return !m;
	}


	// load and increment
	const ldi = () => {
		trace('ldi('+ pc +'): -> '+ memory[pc] +'  ('+ memory[memory[pc]] +')');
		return memory[pc++];
	}
	const add = () => {
		trace('add');
		p1 = ldi();
		p2 = ldi();
		p3 = ldi();

		let buffer1 = read(p1, 1);
		let buffer2 = read(p2, 2);
		let buffer3 = 1*p3;

		memory[buffer3] = buffer1 + buffer2;
		trace('  buffer1: '+ buffer1);
		trace('  buffer2: '+ buffer2);
		trace('  written '+ memory[buffer3] +' to memory['+ buffer3 +']');
	}
	const mul = () => {
		trace('mul');
		p1 = ldi();
		p2 = ldi();
		p3 = ldi();

		let buffer1 = read(p1, 1);
		let buffer2 = read(p2, 2);
		let buffer3 = 1*p3;

		memory[buffer3] = buffer1 * buffer2;
		trace('  buffer1: '+ buffer1);
		trace('  buffer2: '+ buffer2);
		trace('  written '+ memory[buffer3] +' to memory['+ buffer3 +']');
	}
	const inp = () => {
		trace('inp');
		const inputValue = inputCb(doSuspend);
		if (inputValue !== null) {
			p1 = ldi();
			memory[p1] = inputValue;
			trace('input: written '+ memory[p1] +' to memory['+ p1 +']');
		}
	}
	const out = () => {
		trace('out');
		p1 = ldi();

		let buffer1 = read(p1, 1);
		outputCb(buffer1, doSuspend);
	}
	const jmt = () => {
		trace('jmt');
		p1 = ldi();
		p2 = ldi();
		
		let buffer1 = read(p1, 1);
		let buffer2 = read(p2, 2);
		if (buffer1 != 0) {
			pc = buffer2;
			trace('jmt: set pc to '+ pc);
		} else {
			trace('jmt: did nothing');
		}
	}
	const jmf = () => {
		trace('jmf');
		p1 = ldi();
		p2 = ldi();
		
		let buffer1 = read(p1, 1);
		let buffer2 = read(p2, 2);
		if (buffer1 == 0) {
			pc = buffer2;
			trace('jmf: set pc to '+ pc);
		} else {
			trace('jmf: did nothing');
		}
	}
	const lt = () => {
		trace('lt');
		p1 = ldi();
		p2 = ldi();
		p3 = ldi();
		
		let buffer1 = read(p1, 1);
		let buffer2 = read(p2, 2);
		let buffer3 = 1*p3;

		memory[buffer3] = buffer1 < buffer2 ? 1 : 0;
		trace('lt: written '+ memory[buffer3] +' to memory['+ buffer3 +']');
	}
	const eq = () => {
		trace('eq');
		p1 = ldi();
		p2 = ldi();
		p3 = ldi();
		
		let buffer1 = read(p1, 1);
		let buffer2 = read(p2, 2);
		let buffer3 = 1*p3;

		memory[buffer3] = buffer1 == buffer2 ? 1 : 0;
		trace('eq: written '+ memory[buffer3] +' to memory['+ buffer3 +']');
	}


	//
	// MAIN LOOP
	//
	while(!suspend) {
		instruction = ldi(); 
		op = opCode(instruction);
		if (op == 99) {
			log('! terminating');
			return null;
		}

		if (pc >= memory.length) {
			log('! pc out of bounds');
			return null;
		}

		switch(op) {
			case 1:	add(); break;
			case 2: mul(); break;
			case 3:	inp(); break;
			case 4: out(); break;
			case 5: jmt(); break;
			case 6: jmf(); break;
			case 7: lt(); break;
			case 8: eq(); break;
			default: 
				log('! illegal instruction');
				return null;
		}
	}

	if (suspend) {
		log('! suspending');
		return pc;
	}
}

// debugging log()
const log = (v) => verbose && console.log('.         '+ v);
const trace = (t) => verboseTrace && console.log('*        '+ t);

const getAllPhaseSettings = () => {
	let phaseSignal= 0;
	const getNewPhaseSignal = () => (phaseSignal<100000) ? phaseSignal++ : null;

	const allPhaseSettings = [];

	phase = 0;
	while(phase !== null) {
		phase = getNewPhaseSignal();

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
		if (phaseSettings.filter((s,i) => s<5 || phaseSettings.lastIndexOf(s)>i ).length > 0) {
			continue;
		};

		allPhaseSettings.push(phaseSettings);
	}

	return allPhaseSettings;
}


const setUpAmplifiers = (phaseSet) => {
	const amplifiers = [];

	// set up mplifiers
	log('initialize amplifiers for '+ phaseSet);
	for(let i=0;i<5;i++) {
		let phase = 1*phaseSet[i] || 0;
		log('create new Amplifier with phase '+ phase);
		amplifiers[i] = new Amplifier(amplifierControllerProgramm, phase)
	}

	amplifiers[0].input = 0;
	return amplifiers;
}


let bestThrust = 0;
let bestPhase = 0;

const allPhaseSettings = getAllPhaseSettings();

let amplifiers;
for(let i=0; i<allPhaseSettings.length; i++) {
	amplifiers = setUpAmplifiers(allPhaseSettings[i]);

	// wire feedback loop
	log('iteration ' + allPhaseSettings[i].join(''));
	log('running: ' + amplifiers.map(a=>a.isRunning()));
	let fl = 1;
	while(amplifiers[4].isRunning() && fl < 1000) {
		log('feedback loop: ' + fl);
		amplifiers[0].run();
		amplifiers[1].input = amplifiers[0].output;
		amplifiers[1].run();
		amplifiers[2].input = amplifiers[1].output;
		amplifiers[2].run();
		amplifiers[3].input = amplifiers[2].output;
		amplifiers[3].run();
		amplifiers[4].input = amplifiers[3].output;
		amplifiers[4].run();
		amplifiers[0].input = amplifiers[4].output;
		log('outputs: '+ amplifiers.map(a=>a.output));
		fl++;
	}
	log('result: ' + amplifiers[4].output);

	if (amplifiers[4].output> bestThrust) {
		bestThrust = amplifiers[4].output;
		bestPhase = allPhaseSettings[i].join('');
	}
}

console.log();
console.log('bestThrust: '+ bestThrust);
console.log('bestPhase: '+ bestPhase);

console.log('---');


