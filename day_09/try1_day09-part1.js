const verbose = process.argv.indexOf('--verbose')>0 || process.argv.indexOf('-v')>0;
const verboseTrace = process.argv.indexOf('--trace')>0 || process.argv.indexOf('-t')>0;

const testProgramm = [109, 1, 203, 2, 204, 2, 99];

const boostProgramm = [1102,34463338,34463338,63,1007,63,34463338,63,1005,63,53,1101,3,0,1000,109,988,209,12,9,1000,209,6,209,3,203,0,1008,1000,1,63,1005,63,65,1008,1000,2,63,1005,63,904,1008,1000,0,63,1005,63,58,4,25,104,0,99,4,0,104,0,99,4,17,104,0,99,0,0,1101,35,0,1007,1102,30,1,1013,1102,37,1,1017,1101,23,0,1006,1101,0,32,1008,1102,1,29,1000,1101,0,38,1010,1101,0,24,1002,1101,33,0,1003,1101,1,0,1021,1102,31,1,1019,1101,27,0,1014,1102,20,1,1005,1101,0,0,1020,1102,1,892,1027,1101,895,0,1026,1102,39,1,1015,1102,1,370,1029,1102,1,28,1001,1102,34,1,1012,1101,25,0,1016,1101,0,375,1028,1101,36,0,1018,1101,0,21,1004,1102,1,26,1009,1101,0,249,1022,1101,0,660,1025,1101,0,665,1024,1102,1,22,1011,1102,242,1,1023,109,5,2102,1,3,63,1008,63,31,63,1005,63,205,1001,64,1,64,1105,1,207,4,187,1002,64,2,64,109,8,21102,40,1,5,1008,1018,37,63,1005,63,227,1105,1,233,4,213,1001,64,1,64,1002,64,2,64,109,7,2105,1,3,1001,64,1,64,1106,0,251,4,239,1002,64,2,64,109,-7,1201,-7,0,63,1008,63,20,63,1005,63,271,1106,0,277,4,257,1001,64,1,64,1002,64,2,64,109,-10,1208,0,33,63,1005,63,295,4,283,1106,0,299,1001,64,1,64,1002,64,2,64,109,-6,1207,4,27,63,1005,63,319,1001,64,1,64,1105,1,321,4,305,1002,64,2,64,109,12,1207,-1,33,63,1005,63,339,4,327,1105,1,343,1001,64,1,64,1002,64,2,64,109,6,1206,6,355,1106,0,361,4,349,1001,64,1,64,1002,64,2,64,109,21,2106,0,-8,4,367,1106,0,379,1001,64,1,64,1002,64,2,64,109,-29,1202,0,1,63,1008,63,36,63,1005,63,403,1001,64,1,64,1105,1,405,4,385,1002,64,2,64,109,11,21107,41,40,-6,1005,1012,421,1105,1,427,4,411,1001,64,1,64,1002,64,2,64,109,-11,2101,0,-4,63,1008,63,33,63,1005,63,453,4,433,1001,64,1,64,1106,0,453,1002,64,2,64,109,-7,21108,42,40,10,1005,1010,469,1105,1,475,4,459,1001,64,1,64,1002,64,2,64,109,1,1201,4,0,63,1008,63,20,63,1005,63,497,4,481,1105,1,501,1001,64,1,64,1002,64,2,64,109,5,21107,43,44,5,1005,1011,523,4,507,1001,64,1,64,1106,0,523,1002,64,2,64,109,20,21108,44,44,-7,1005,1019,541,4,529,1106,0,545,1001,64,1,64,1002,64,2,64,109,2,1205,-8,561,1001,64,1,64,1106,0,563,4,551,1002,64,2,64,109,-23,2108,22,0,63,1005,63,583,1001,64,1,64,1105,1,585,4,569,1002,64,2,64,109,-6,2107,30,1,63,1005,63,605,1001,64,1,64,1105,1,607,4,591,1002,64,2,64,109,23,1205,-1,621,4,613,1105,1,625,1001,64,1,64,1002,64,2,64,109,-19,2102,1,-3,63,1008,63,29,63,1005,63,647,4,631,1106,0,651,1001,64,1,64,1002,64,2,64,109,28,2105,1,-7,4,657,1106,0,669,1001,64,1,64,1002,64,2,64,109,-17,1206,6,687,4,675,1001,64,1,64,1105,1,687,1002,64,2,64,109,2,21101,45,0,1,1008,1017,42,63,1005,63,707,1106,0,713,4,693,1001,64,1,64,1002,64,2,64,109,-6,2101,0,-3,63,1008,63,34,63,1005,63,733,1105,1,739,4,719,1001,64,1,64,1002,64,2,64,109,3,21101,46,0,1,1008,1014,46,63,1005,63,761,4,745,1106,0,765,1001,64,1,64,1002,64,2,64,109,5,21102,47,1,-7,1008,1011,47,63,1005,63,787,4,771,1105,1,791,1001,64,1,64,1002,64,2,64,109,-24,2108,24,8,63,1005,63,813,4,797,1001,64,1,64,1106,0,813,1002,64,2,64,109,5,1208,10,29,63,1005,63,829,1105,1,835,4,819,1001,64,1,64,1002,64,2,64,109,7,2107,23,-4,63,1005,63,853,4,841,1105,1,857,1001,64,1,64,1002,64,2,64,109,-2,1202,0,1,63,1008,63,21,63,1005,63,879,4,863,1105,1,883,1001,64,1,64,1002,64,2,64,109,15,2106,0,8,1106,0,901,4,889,1001,64,1,64,4,64,99,21102,1,27,1,21102,915,1,0,1105,1,922,21201,1,51839,1,204,1,99,109,3,1207,-2,3,63,1005,63,964,21201,-2,-1,1,21101,942,0,0,1106,0,922,21201,1,0,-1,21201,-2,-3,1,21101,957,0,0,1105,1,922,22201,1,-1,-2,1105,1,968,21201,-2,0,-2,109,-3,2106,0,0];


class Computer {
	constructor(programm) {
		this.memory = programm.slice(0);
		this.pc = 0;
		this.input = 0;
		this.output = 0;
	}

	getOutput() {
		return this.output;
	}

	run() {
		const that = this;

		const inputCb = (suspendCb) => {
			const input = that.input;
			that.input = null;
			return input;
		}

		const outputCb = (value, suspendCb) => {
			that.output = value;
			console.log(value);
		}

		this.pc = compute(this.memory, this.pc, inputCb, outputCb);
	}
}

const compute = function(memory, pc, inputCb, outputCb) {
	let instruction;
	let instructionLength = 4;
	let relativeBase = 0;
	let suspend = false;

	const read = (val, buffer, literal) => {
		trace('read '+ val +', '+ buffer);
		trace('relative base: '+ relativeBase);
		if (literal) {
			switch (posMode(instruction, buffer)) {
				case 0: 
				case 1: 
					trace('read literal mode 0 or 1, value: '+ val);
					return 1*(memory[val]||0);			// position mode
				case 2: 
					trace('read literal mode 2, address: '+ 
							(val + relativeBase) 
							+', value: '+ 
							(memory[val+relativeBase]||0)
					);
					return 1*(memory[val + relativeBase]||0);	// relative mode
			}
		}

		switch (posMode(instruction, buffer)) {
			case 0: 
				trace('read mode 0, address: '+ val +', value: '+ (memory[val]||0));
				return 1*(memory[val]||0);			// position mode
			case 1: 
				trace('read mode 1, value: '+ val);
				return 1*val;					// immediate mode
			case 2: 
				trace('read mode 2, address: '+ (val + relativeBase) +', value: '+ (memory[val+relativeBase]||0));
				return 1*(memory[val + relativeBase]||0);	// relative mode
		}
	}

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
		trace('posMode: ' + m);
		return m;
	}


	// load and increment
	const ldi = () => {
		if (!memory[pc]) {
			memory[pc] = 0;
		}
		trace('ldi('+ pc +'): -> '+ memory[pc] +'  ('+ memory[memory[pc]] +')');
		//console.log('ldi('+ pc +'): -> '+ memory[pc] +'  ('+ memory[memory[pc]] +')');
		return memory[pc++];
	}
	const add = () => {
		trace('add');
		p1 = ldi();
		p2 = ldi();
		p3 = ldi();

		let buffer1 = read(p1, 1);
		let buffer2 = read(p2, 2);
		let buffer3 = read(p3, 3, true);

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
		//let buffer3 = 1*p3;
		let buffer3 = read(p3, 3, true);

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
			let buffer1 = read(p1, 1, true);

			memory[buffer1] = inputValue;
			trace('input: written '+ memory[buffer1] +' to memory['+ buffer1 +']');
			//console.log('input '+p1+': written '+ memory[buffer1] +' to memory['+ buffer1 +']');
			//console.log('input: written '+ memory[buffer1] +' to memory['+ buffer1 +']');
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
		//let buffer3 = 1*p3;
		let buffer3 = read(p3, 3, true);

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
		//let buffer3 = 1*p3;
		let buffer3 = read(p3, 3, true);

		memory[buffer3] = buffer1 == buffer2 ? 1 : 0;
		trace('eq: written '+ memory[buffer3] +' to memory['+ buffer3 +']');
	}
	const rbo = () => {
		trace('rbo');
		p1 = ldi();

		let buffer1 = read(p1, 1);
		relativeBase += buffer1;
	}

	//
	// MAIN LOOP
	//
	while(!suspend) {
		if (pc < 0) { 
			log('! pc below zero: ' + pc);
			return null;
		}
		instruction = ldi(); 
		op = opCode(instruction);
		if (op == 99) {
			log('! terminating');
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
			case 9: rbo(); break;
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

const computer = new Computer(boostProgramm);
computer.input = 1;

computer.run();


