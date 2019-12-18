const input = 1*process.argv[2];
const verbose = process.argv[3] == '--verbose' || process.argv[3] == '-v';


let diagnosticProgram = [3,225,1,225,6,6,1100,1,238,225,104,0,1002,43,69,224,101,-483,224,224,4,224,1002,223,8,223,1001,224,5,224,1,224,223,223,1101,67,60,225,1102,5,59,225,1101,7,16,225,1102,49,72,225,101,93,39,224,101,-98,224,224,4,224,102,8,223,223,1001,224,6,224,1,224,223,223,1102,35,82,225,2,166,36,224,101,-4260,224,224,4,224,102,8,223,223,101,5,224,224,1,223,224,223,102,66,48,224,1001,224,-4752,224,4,224,102,8,223,223,1001,224,2,224,1,223,224,223,1001,73,20,224,1001,224,-55,224,4,224,102,8,223,223,101,7,224,224,1,223,224,223,1102,18,41,224,1001,224,-738,224,4,224,102,8,223,223,101,6,224,224,1,224,223,223,1101,68,71,225,1102,5,66,225,1101,27,5,225,1101,54,63,224,1001,224,-117,224,4,224,102,8,223,223,1001,224,2,224,1,223,224,223,1,170,174,224,101,-71,224,224,4,224,1002,223,8,223,1001,224,4,224,1,223,224,223,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,1007,226,226,224,1002,223,2,223,1006,224,329,1001,223,1,223,1007,226,677,224,102,2,223,223,1006,224,344,1001,223,1,223,108,677,677,224,102,2,223,223,1005,224,359,1001,223,1,223,1007,677,677,224,1002,223,2,223,1006,224,374,101,1,223,223,8,677,226,224,1002,223,2,223,1006,224,389,101,1,223,223,7,226,226,224,1002,223,2,223,1005,224,404,101,1,223,223,7,677,226,224,102,2,223,223,1005,224,419,1001,223,1,223,8,226,677,224,1002,223,2,223,1005,224,434,101,1,223,223,1008,226,677,224,102,2,223,223,1006,224,449,1001,223,1,223,7,226,677,224,1002,223,2,223,1006,224,464,1001,223,1,223,108,677,226,224,102,2,223,223,1005,224,479,101,1,223,223,108,226,226,224,1002,223,2,223,1006,224,494,101,1,223,223,8,226,226,224,1002,223,2,223,1005,224,509,1001,223,1,223,1107,677,226,224,102,2,223,223,1005,224,524,1001,223,1,223,1107,226,226,224,102,2,223,223,1005,224,539,1001,223,1,223,1108,677,677,224,1002,223,2,223,1006,224,554,101,1,223,223,107,226,677,224,102,2,223,223,1005,224,569,1001,223,1,223,1108,226,677,224,1002,223,2,223,1005,224,584,1001,223,1,223,1107,226,677,224,1002,223,2,223,1005,224,599,1001,223,1,223,1008,226,226,224,1002,223,2,223,1005,224,614,101,1,223,223,107,226,226,224,102,2,223,223,1006,224,629,1001,223,1,223,1008,677,677,224,1002,223,2,223,1006,224,644,101,1,223,223,107,677,677,224,1002,223,2,223,1005,224,659,101,1,223,223,1108,677,226,224,1002,223,2,223,1006,224,674,1001,223,1,223,4,223,99,226];


const testProgramm = [3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31, 1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104, 999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99];

const posModeProgramm = [3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9];
const immediateModeProgramm = [3,3,1105,-1,9,1101,0,0,12,4,12,99,1];

const intcode = function(programm) {
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
		memory[p1] = input;
		log('input: written '+ memory[p1] +' to memory['+ p1 +']');
	}
	const out = () => {
		p1 = ldi();

		let buffer1 = read(p1, 1);
		output(buffer1);
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

const output = (v) => console.log('*   '+ v);

const log = (v) => verbose && console.log('.         '+ v);

console.log(intcode(diagnosticProgram) || 'termindated');


