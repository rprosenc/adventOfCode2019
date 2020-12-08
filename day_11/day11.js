const data = require("./program");
const loggers = require("./logger");
const computers = require("./computer");
const ship = require("./hull")

const { execSync } = require('child_process');

const verbose = process.argv.indexOf('--verbose')>0 || process.argv.indexOf('-v')>0;
const verboseTrace = process.argv.indexOf('--trace')>0 || process.argv.indexOf('-t')>0;
const animated = process.argv.indexOf('--animated')>0 || process.argv.indexOf('-a')>0;
const compressed = process.argv.indexOf('--compressed')>0 || process.argv.indexOf('-c')>0;
const startWhite = process.argv.indexOf('--startWhite')>0 || process.argv.indexOf('-w')>0;
const sleep = ((argSleep = process.argv.indexOf('--sleep'))>=0 ) ? process.argv[argSleep+1] : 0.01;



class Robot {
    constructor(computer, hull, logger) {
        const that = this;
        this.direction = 0; // 0->up, 1->right, 2->bottom, 3->left

        // initialize local state
        this.position = new ship.Position(0, 0);
        this.hull = hull;
        this.computer = computer;
        this.instruction = 0;
        this.logger = logger;

        this.frameDamper = animated ? 0 : 1000000; // show every nth frame
        this.frame = 0;

        // wire up computer
        this.computer.setInputFn(() => that.readCam());
        this.computer.setOutputFn((val) => that.computerOutput(val));
    }

    display() {
        if (this.frame === 0) {
            console.log(this.hull.render(this));
            execSync('clear');
            execSync('sleep ' + sleep);
        }
        if (this.frameDamper) {
            this.frame = ++this.frame % this.frameDamper;
        }
    }

    displayCompact() {
        console.log(this.hull.renderCompact(this));
    }

    readCam() {
        this.logger.trace('readCam', 'get color');
        const color = this.hull.getColor(this.position);
        this.logger.trace('readCam', 'got color', color);
        return color.serialize();
    }

    computerOutput(val) {
        this.logger.log('computerOutput(' + val + ')');
        if (this.instruction) {
            this.turn(val);
            this.display();
            this.move();
            this.display();
        } else {
            this.paint(val);
            this.display();
        }

        // flip instruction
        this.instruction ^= 1;
    }

    turn(right) {
        this.logger.log('turn(' + right + ')');
        // right==0 -> turn left, right==1 -> turn right
        this.direction = (4 + this.direction + (right ? 1 : -1)) % 4;	// mod does not convert negative numbers,
        // thus a shift of 4 to the positive is needed
    }

    move() {
        this.logger.log('move dir:' + this.direction);
        switch (this.direction) {
            case 0:	// up
                this.position.y -= 1
                break;
            case 1:	// right
                this.position.x += 1
                break;
            case 2:	// down
                this.position.y += 1
                break;
            case 3:	// left
                this.position.x -= 1
                break;
        }
        this.logger.log('position:' + this.position.serialize());
    }

    paint(color) {
        this.logger.trace('paint', this.position, color);
        color>1 && console.log('paint ' + this.position.serialize() + ' ' + color);
        this.hull.paint(this.position, new ship.Color(color))
    }

    render() {
        return ['^', '>', 'v', '<'][this.direction];
    }

    render2Byte() {
        return ['/\\', ' >', '\\/', '< '][this.direction];
    }

    start() {
        this.computer.run();
    }
}

const program = data.code;
const intCodeLogger = new loggers.Logger(verbose, verboseTrace, 'IntCode', 1);
const robotLogger = new loggers.Logger(verbose, verboseTrace, 'Robot', 2);
const hullLogger = new loggers.Logger(verbose, verboseTrace, 'Hull', 3);
const computer = new computers.IntCode(program, intCodeLogger);
const hull = new ship.Hull(hullLogger, startWhite ? new ship.Color(1) : null);
const robot = new Robot(computer, hull, robotLogger)
robot.start();
robot.frame = 0;

console.log('Colored tiles: ', hull.getColoredTiles());
compressed ? robot.displayCompact() : robot.display();


// correct solution: KRZEAJHB

/*
this sucks... output needs to be stitched together manually, as the computer fucks it up

the output looks (after manual stitching) like this (means KRZEAJHB)

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░████▒▒▒▒██▒▒██████▒▒▒▒████████▒▒████████▒▒▒▒████▒▒▒▒▒▒▒▒████▒▒██▒▒▒▒██▒▒██████▒▒████░░
░░░░██▒▒██▒▒▒▒██▒▒▒▒██▒▒▒▒▒▒▒▒██▒▒██▒▒▒▒▒▒▒▒██▒▒▒▒██▒▒▒▒▒▒▒▒██▒▒██▒▒▒▒██▒▒██▒▒▒▒██████░░
░░██████▒▒▒▒▒▒██▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒██████▒▒▒▒██▒▒▒▒██▒▒▒▒▒▒▒▒██▒▒████████▒▒██████▒▒▒▒██░░
░░████▒▒██▒▒▒▒██████▒▒▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒▒▒▒▒████████▒▒▒▒▒▒▒▒██▒▒██▒▒▒▒██▒▒██▒▒▒▒██▒▒██░░
░░████▒▒██▒▒▒▒██▒▒██▒▒▒▒██▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒██▒▒▒▒██▒▒██▒▒▒▒██▒▒██▒▒▒▒██▒▒██▒▒▒▒██▒▒██░░
░░████▒▒▒▒██▒▒██▒▒▒▒██▒▒████████▒▒████████▒▒██▒▒▒▒██▒▒▒▒████▒▒▒▒██▒▒▒▒██▒▒██████▒▒▒▒██░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░


or this, for another program (means RKURGKGK):

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░████████▒▒▒▒██▒▒▒▒██▒▒██▒▒▒▒██▒▒██████▒▒▒▒▒▒████▒▒▒▒██▒▒▒▒██▒▒▒▒████▒▒▒▒██▒▒▒▒██████░░
░░░░██▒▒▒▒██▒▒██▒▒██▒▒▒▒██▒▒▒▒██▒▒██▒▒▒▒██▒▒██▒▒▒▒██▒▒██▒▒██▒▒▒▒██▒▒▒▒██▒▒██▒▒██▒▒██< ░░
░░/\██▒▒▒▒██▒▒████▒▒▒▒▒▒██▒▒▒▒██▒▒██▒▒▒▒██▒▒██▒▒▒▒▒▒▒▒████▒▒▒▒▒▒██▒▒▒▒▒▒▒▒████▒▒▒▒▒▒██░░
░░████████▒▒▒▒██▒▒██▒▒▒▒██▒▒▒▒██▒▒██████▒▒▒▒██▒▒████▒▒██▒▒██▒▒▒▒██▒▒████▒▒██▒▒██▒▒▒▒██░░
░░████▒▒██▒▒▒▒██▒▒██▒▒▒▒██▒▒▒▒██▒▒██▒▒██▒▒▒▒██▒▒▒▒██▒▒██▒▒██▒▒▒▒██▒▒▒▒██▒▒██▒▒██▒▒▒▒ >░░
░░████▒▒▒▒██▒▒██▒▒▒▒██▒▒▒▒████▒▒▒▒██▒▒▒▒██▒▒▒▒██████▒▒██▒▒▒▒██▒▒▒▒██████▒▒██▒▒▒▒██▒▒██░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

which should look like this:
                        .███..█..█.█..█.███...██..█..█..██..█..█...
                        .█..█.█.█..█..█.█..█.█..█.█.█..█..█.█.█....
                        .█..█.██...█..█.█..█.█....██...█....██.....
                        .███..█.█..█..█.███..█.██.█.█..█.██.█.█....
                        .█.█..█.█..█..█.█.█..█..█.█.█..█..█.█.█....
                        .█..█.█..█..██..█..█..███.█..█..███.█..█...


 */
console.log('---');


