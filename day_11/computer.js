class IntCode {
    constructor(programm, logger) {
        this.memory = programm.slice(0);
        this.pc = 0;
        this.relBase = 0;
        this.status = 1;
        this.input = 0;
        this.output = 0;

        this.logger = logger;
        this.inputFn = ( ) => 0;
        this.outputFn = ( ) => undefined;
    }

    setInputFn(inputFn) {
        this.inputFn = inputFn;
    }

    setOutputFn(outputFn) {
        this.outputFn = outputFn;
    }

    getOutput() {
        return this.output;
    }

    isRunning() {
        return this.pc !== null;
    }

    run() {
        const that = this;
        const ctrl = {
            getPC: ()=>that.pc,
            setPC: pc=>that.pc = pc,
            getRelBase: ()=>that.relBase,
            addRelBase: relBase=>that.relBase+=relBase,
            input: (doSuspendCb)=>that.inputFn(),
            output: (output, doSuspendCb) => that.outputFn(output),
        }
        this.status = compute(this.memory, ctrl, this.logger);
    }
}

const compute = function(memory, ctrl, logger) {
    let instruction;
    let suspend = false;

    const readAdr = (val, buffer) => {
        logger.trace('readAddr', 'start reading address', val, 'with posmode according to buffer', buffer);
        switch(posMode(instruction, buffer)) {
            case 0:	// position mode
                return memory[val] || 0;
            case 1: // immediate mode
                logger.trace('readAddr', 'case1, val:'+ val +', buffer:'+ buffer);
                return val;
            case 2:	// offset mode
                //console.log('relmode, relBase: '+ ctrl.getRelBase() +', val: '+ val);
                return memory[ctrl.getRelBase() + val] || 0;
        }
        logger.log('! posMode unknown ('+ instruction +')');
    }

    const writeAdr = (val, buffer) => {
        logger.trace('writeAdr', 'start value', val, 'with posmode according to buffer', buffer);
        switch(posMode(instruction, buffer)) {
            case 0:	// position mode
            case 1:
                logger.trace('writeAdr', 'position mode 0 or 1, return', val);
                return val || 0;
            case 2:	// offset mode
                //console.log('(write to ) relmode, relBase: '+ ctrl.getRelBase() +', val: '+ val);
                logger.trace('writeAdr', 'offset mode', 1*ctrl.getRelBase() + 1*val);
                return 1*ctrl.getRelBase() + 1*val;
        }
        logger.log('! posMode unknown ('+ instruction +')');
    }

    const doSuspend = () => suspend = true;

    // last tow digits of instruction value
    const opCode = v => {
        logger.trace('opCode('+ v +')', ' -> ' + (v%100));
        return v % 100;
    }

    // v .. instruction value
    // p .. parameter number, starting with 1
    const posMode = (v,p) => {
        let m = 1 * ( (''+v).split('').reverse().splice(2)[p-1] || 0 );
        return m;
    }


    // load and increment
    const ldi = () => {
        let pc = ctrl.getPC();
        logger.trace('ldi(', pc, ')', ' -> ', memory[pc], '  referenced: ', memory[memory[pc]]);
        const value = memory[pc++];
        ctrl.setPC(pc);
        return value;
    }
    const add = () => {
        logger.trace('add', 'read next 3 instructions ');
        p1 = ldi();
        p2 = ldi();
        p3 = ldi();

        let buffer1 = readAdr(p1, 1);
        let buffer2 = readAdr(p2, 2);
        let buffer3 = writeAdr(p3, 3);

        memory[buffer3] = buffer1 + buffer2;
        logger.trace('add', 'buffer1: '+ buffer1);
        logger.trace('add', 'buffer2: '+ buffer2);
        logger.trace('add', 'written ', memory[buffer3], ' to memory[', buffer3, ']');
    }
    const mul = () => {
        logger.trace('mul', 'read next 3 instructions ');
        p1 = ldi();
        p2 = ldi();
        p3 = ldi();

        let buffer1 = readAdr(p1, 1);
        let buffer2 = readAdr(p2, 2);
        let buffer3 = writeAdr(p3, 3);

        memory[buffer3] = buffer1 * buffer2;
        logger.trace('mul', 'buffer1: '+ buffer1);
        logger.trace('mul', 'buffer2: '+ buffer2);
        logger.trace('mul', 'written ', memory[buffer3], ' to memory[', buffer3, ']');
    }
    const inp = () => {
        logger.trace('inp', 'get input value');
        const inputValue = ctrl.input(doSuspend);
        logger.trace('inp', 'got input', inputValue);
        if (inputValue !== null) {
            //console.log('got input: '+ inputValue);
            logger.trace('inp', 'load address to write into buffer');
            p1 = ldi();
            let buffer1 = writeAdr(p1, 1);

            memory[buffer1] = inputValue;
            logger.trace('inp', 'written ', memory[buffer1], ' to memory[', buffer1, ']');
        }
    }
    const out = () => {
        logger.trace('out', 'read next instruction');
        p1 = ldi();

        let buffer1 = writeAdr(p1, 1);

        logger.trace('out', 'outputFn from buffer1 (', buffer1, '):',memory[buffer1]);
        ctrl.output(memory[buffer1], doSuspend);
    }
    const jmt = () => {
        logger.trace('jmt', 'read next 2 instructions');
        p1 = ldi();
        p2 = ldi();

        let buffer1 = readAdr(p1, 1);
        let buffer2 = readAdr(p2, 2);
        if (buffer1 !== 0) {
            ctrl.setPC(buffer2);
            logger.trace('jmt', 'set pc to '+ ctrl.getPC());
        } else {
            logger.trace('jmt', 'did nothing');
        }
    }
    const jmf = () => {
        logger.trace('jmf', 'read next 2 instructions');
        p1 = ldi();
        p2 = ldi();

        let buffer1 = readAdr(p1, 1);
        let buffer2 = readAdr(p2, 2);
        if (buffer1 !== 0) {
            logger.trace('jmf', 'did nothing');
        } else {
            ctrl.setPC(buffer2);
            logger.trace('jmf', 'set pc to ' + ctrl.getPC());
        }
    }
    const lt = () => {
        logger.trace('lt', 'read next 3 instructions');
        p1 = ldi();
        p2 = ldi();
        p3 = ldi();

        let buffer1 = readAdr(p1, 1);
        let buffer2 = readAdr(p2, 2);
        let buffer3 = writeAdr(p3, 3);

        memory[buffer3] = buffer1 < buffer2 ? 1 : 0;
        logger.trace('lt', 'written '+ memory[buffer3] +' to memory['+ buffer3 +']');
    }
    const eq = () => {
        logger.trace('eq', 'read next 3 instructions');
        p1 = ldi();
        p2 = ldi();
        p3 = ldi();

        let buffer1 = readAdr(p1, 1);
        let buffer2 = readAdr(p2, 2);
        let buffer3 = writeAdr(p3, 3);

        memory[buffer3] = buffer1 === buffer2 ? 1 : 0;
        logger.trace('eq','written '+ memory[buffer3] +' to memory['+ buffer3 +']');
    }
    const rbo = () => {
        logger.trace('rbo', 'read next instruction');

        p1 = ldi();

        let buffer1 = readAdr(p1, 1);

        ctrl.addRelBase(buffer1);

        logger.trace('rbo', 'changed relative base to '+ ctrl.getRelBase());
    }


    //
    // MAIN LOOP
    //
    while(!suspend) {
        instruction = ldi();
        op = opCode(instruction);
        if (op === 99) {
            logger.log('! terminating');
            return null;
        }

        if (ctrl.getPC() >= memory.length) {
            logger.log('! pc out of bounds');
            return null;
        }

        //logger.log(memory.map((val,i)=>i+':'+val).join(','));
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
                logger.log('! illegal instruction: '+ instruction +' (op='+ op +')');
                return null;
        }
    }

    if (suspend) {
        logger.log('! suspending');
        return ctrl.getPC();
    }

}

module.exports = { IntCode };
