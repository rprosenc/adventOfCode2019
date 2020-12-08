const colors = require("./colors")


class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(pos) {
        return pos.x === this.x && pos.y === this.y;
    }

    serialize() {
        return this.x + '|' + this.y;
    }
}

class Color {
    constructor(color) {
        this.color = color ? 1 : 0;
        // if (color === 3) {
        //     this.color = 0;
        // }
    }

    serialize() {
        return this.color;
    }

}

class Hull {
    constructor(logger, initColor) {
        this.tiles = {}
        this.logger = logger;

        if (initColor) {
            this.tiles['0|0'] = initColor;
        }

    }

    /**
     *
     * @returns {number}
     */
    getColoredTiles() {
        let tiles = 0;
        for (const positionKey in this.tiles) {
            tiles++;
        }

        return tiles;
    }

    /**
     *
     * @param position
     * @returns {Color}
     */
    getColor(position) {
        this.logger.trace('getColor', 'for position', position);
        const color = this.tiles[position.serialize()];
        this.logger.trace('getColor', 'got color', color, 'return', color ? color : new Color(0));
        return color ? color : new Color(0);
    }

    hasColor(position) {
        const color = this.tiles[position.serialize()];
        return color !== undefined;
    }

    /**
     *
     * @param position Position
     * @param color Color
     */
    paint(position, color) {
        this.tiles[position.serialize()] = color;
    }

    getHullSize() {
        // got these from running it
        let [minX, maxX, minY, maxY] = [0, 0, 0, 0];

        // get dimensions
        for (const pos in this.tiles) {
            let [x, y] = pos.split('|').map(d => parseInt(d));

            minX = x < minX ? x : minX;
            maxX = maxX > x ? maxX : x;

            minY = y < minY ? y : minY;
            maxY = maxY > y ? maxY : y;
        }
        return [minX-1, maxX+1, minY-1, maxY+1]
    }

    render(robot) {
        let [minX, maxX, minY, maxY] = this.getHullSize();

        // got these from running it
        // let [minX, maxX, minY, maxY] = [-47, 20, -36, 24];

        let screen = '';
        screen += '\n';
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                let pos = new Position(x, y);
                if (robot.position.equals(pos)) {
                    screen += colors.Fg.Green + colors.Dim + colors.Reverse + robot.render2Byte() + colors.Reset;
                } else {
                    if (this.hasColor(pos)) {
                        let color = this.getColor(pos).serialize();
                        if (color > 1) {
                            screen += colors.Fg.Red + colors.Bg.Red // mark red
                        }
                        screen += (color ? '██' : '▒▒') + colors.Reset;  // paint and reset color
                    } else {
                        screen += '░░';
                    }
                }
            }
            screen += '\n';
        }

        return screen;
    }

    renderCompact(robot) {
        // let [minX, maxX, minY, maxY] = this.getHullSize();

        // got these from running it
        let [minX, maxX, minY, maxY] = [-47, 20, -36, 24];

        let screen = '';
        screen += '\n';
        for (let y = minY; y <= maxY; y+=2) {
            for (let x = minX; x <= maxX; x++) {
                let pos = new Position(x, y);
                if (robot.position.equals(pos)) {
                    screen += robot.render();
                } else {
                    let xy1 = this.getColor(new Position(x, y)).serialize();
                    let xy2 = (y+1>maxY) ? 0 : this.getColor(new Position(x, y+1)).serialize();
                    let dixel = 2*xy1 + xy2;
                    if (dixel > 3 || dixel < 0) console.log('fuck', dixel, x,y, xy1, xy2);
                    screen += [' ','▄','▀','█'][dixel];
                }
            }
            screen += '\n';
        }

        return screen;
    }
}


module.exports = {Position, Color, Hull};