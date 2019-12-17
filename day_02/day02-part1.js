let gravityAssistProgramm = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,10,1,19,1,6,19,23,1,23,13,27,2,6,27,31,1,5,31,35,2,10,35,39,1,6,39,43,1,13,43,47,2,47,6,51,1,51,5,55,1,55,6,59,2,59,10,63,1,63,6,67,2,67,10,71,1,71,9,75,2,75,10,79,1,79,5,83,2,10,83,87,1,87,6,91,2,9,91,95,1,95,5,99,1,5,99,103,1,103,10,107,1,9,107,111,1,6,111,115,1,115,5,119,1,10,119,123,2,6,123,127,2,127,6,131,1,131,2,135,1,10,135,0,99,2,0,14,0]

// fix 1202 program alerm
gravityAssistProgramm[1] = 12;
gravityAssistProgramm[2] = 2;


let program2 = [1,0,0,0,99];
let program3 = [2,3,0,3,99];
let program4 = [2,4,4,5,99,0];
let program5 = [1,1,1,4,99,5,6,0,99];

const intcode = function(programm) {
	let memory = programm.splice(0);

	let inAddress1, inAddress2, outAddress;
	let instructionLength = 4;

	//console.log('rogramm length: '+memory.length);
	for(let ic=0; pc<memory.length; ic+=instructionLength) {
		//console.log('pc: '+pc+' -> '+memory[pc]);
		switch(memory[pc]) {
			case 1:
				instructionLength = 4;
				inAddress1 = memory[ic+1];
				inAddress2 = memory[ic+2];
				outAddress = memory[ic+3];

				memory[outAddress] = memory[inAddress1] + memory[inAddress2];
				break;
			case 2:
				instructionLength = 4;
				inAddress1 = memory[ic+1];
				inAddress2 = memory[ic+2];
				outAddress = memory[ic+3];

				memory[outAddress] = memory[inAddress1] * memory[inAddress2];
				break;
			case 99:
				instructionLength = 1;
				return memory[0];
				return;
			default:
				return 'broken';

		}

	}
}

console.log('p[0] of gravity assist program: ' + intcode(gravityAssistProgramm));
//console.log('p2: '+ program2.join(',') + ' -> ' + intcode(program2));
//console.log('p3: '+ program3.join(',') + ' -> ' + intcode(program3));
//console.log('p4: '+ program4.join(',') + ' -> ' + intcode(program4));
//console.log('p5: '+ program5.join(',') + ' -> ' + intcode(program5));

