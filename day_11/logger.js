const colors = require("./colors")

class Logger {
    constructor(verbose, verboseTrace, title, color) {
        this.verbose = verbose;
        this.verboseTrace = verboseTrace;
        this.title = title || 'Default';
        this.title += ':' + '               '.substr(0,10-this.title.length);
        this.color = color || 0;
    }

    log(v) {
        this.verbose && console.log.apply(this, [this.renderTitle(), ...arguments]);
    }

    trace(t, m) {
        arguments[0] = colors.Bright + arguments[0] + colors.Reset; //bright
        this.verboseTrace && console.log.apply(this, [this.renderTitle(), ...arguments]);
    }

    renderTitle() {
        return [colors.Fg.White, colors.Fg.Yellow, colors.Fg.Green, colors.Fg.Blue, colors.Fg.Magenta, colors.Fg.Cyan, colors.Fg.Red, colors.Bg.White+colors.Fg.Black][this.color] + this.title + colors.Reset;
    }

}

module.exports = { Logger };
