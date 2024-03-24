import { Point } from './point.js';

/**
 * Enum of 4 possible directions
 * @readonly
 * @enum {string}
 */
export const Direction = {
    UP: '↑',
    DOWN: '↓',
    LEFT: '←',
    RIGHT: '→',
};

const wallAttributeName = 'data-wall';
const startPointAttributeName = 'data-start';
const endPointAttributeName = 'data-end';

export class Maze {
    #container;
    #width;
    #height;
    #walls;
    /**
     * @type {Point}
     */
    #startPoint;
    /**
     * @type {Point}
     */
    #endPoint;

    /**
     * @param {HTMLElement} container
     * @param {number} width
     * @param {number} height
     */
    constructor(container, width, height) {
        this.#container = container;
        this.#width = width;
        this.#height = height;
        this.#walls = new Array(width)
            .fill()
            .map(() => new Array(height).fill().map(() => false));
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    get startPoint() {
        return this.#startPoint;
    }

    set startPoint(value) {
        if (this.#startPoint) {
            this.#setCellAttribute(
                this.#startPoint,
                startPointAttributeName,
                false,
            );
        }
        this.#startPoint = value;

        if (value) {
            this.#setCellAttribute(value, startPointAttributeName, true);
            this.setBlocked(value, false);
        }
    }

    get endPoint() {
        return this.#endPoint;
    }

    set endPoint(value) {
        if (this.#endPoint) {
            this.#setCellAttribute(
                this.#endPoint,
                endPointAttributeName,
                false,
            );
        }

        this.#endPoint = value;

        if (value) {
            this.#setCellAttribute(value, endPointAttributeName, true);
            this.setBlocked(value, false);
        }
    }

    /**
     * @param {Point} point
     * @returns {boolean}
     */
    isBlocked(point) {
        if (!point.inBounds(this.#width, this.#height)) return true;

        return this.#walls[point.y][point.x];
    }

    /**
     * @param {Point} point
     * @param {boolean} isBlocked
     */
    setBlocked(point, isBlocked) {
        if (point.equals(this.#startPoint)) return;
        if (point.equals(this.#endPoint)) return;

        this.#walls[point.y][point.x] = isBlocked;

        this.#setCellAttribute(point, wallAttributeName, isBlocked);
    }

    /**
     * @param {Point} point
     */
    toggleBlocked(point) {
        const isBlocked = this.isBlocked(point);
        this.setBlocked(point, !isBlocked);
    }

    initialize() {
        this.#container.innerHTML = '';

        for (let j = 0; j < this.#height; j++) {
            const rowElement = document.createElement('div');

            for (let i = 0; i < this.#width; i++) {
                const cellElement = this.#createCellElement(new Point(i, j));
                cellElement.style.setProperty('--i', i);
                rowElement.appendChild(cellElement);
            }

            rowElement.style.setProperty('--j', j);
            this.#container.appendChild(rowElement);
        }

        this.#container.oncontextmenu = (e) => e.preventDefault();
    }

    #createCellElement(point) {
        const cellElement = document.createElement('button');

        /**
         * @param {MouseEvent} e
         */
        const drawEventHandler = (e) => {
            if (e.buttons === 1) {
                this.setBlocked(point, true);
                this.save();
            }
            if (e.buttons === 2) {
                this.setBlocked(point, false);
                this.save();
            }
        };

        cellElement.onmousedown = drawEventHandler;
        cellElement.onmouseenter = drawEventHandler;

        return cellElement;
    }

    #setCellAttribute(point, attrName, attrValue) {
        const node = this.#container.childNodes[point.y].childNodes[point.x];

        if (attrValue == undefined || attrValue === false) {
            node.removeAttribute(attrName);
            return;
        }

        if (attrValue === true) {
            node.setAttribute(attrName, '');
            return;
        }

        node.setAttribute(attrName, attrValue);
    }

    /**
     * @returns {string}
     */
    export() {
        let str = `${this.width}x${this.height}\n`;

        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                const point = new Point(i, j);

                if (this.isBlocked(point)) {
                    str += 'w';
                } else if (this.startPoint.equals(point)) {
                    str += 'o';
                } else if (this.endPoint.equals(point)) {
                    str += 'x';
                } else {
                    str += ' ';
                }
            }
            str += '\n';
        }

        return str;
    }

    /**
     * @param {string} str
     */
    import(str) {
        const [sizeStr, ...rowStrs] = str.split('\n');

        const size = sizeStr.split('x');
        this.#width = parseInt(size[0]);
        this.#height = parseInt(size[1]);

        this.#walls = new Array(this.#width)
            .fill()
            .map(() => new Array(this.#height).fill().map(() => false));

        this.initialize();

        for (let j = 0; j < this.height; j++) {
            const rowStr = rowStrs[j];

            for (let i = 0; i < this.width; i++) {
                const cell = rowStr[i];
                const point = new Point(i, j);

                switch (cell) {
                    case 'w':
                        this.setBlocked(point, true);
                        break;
                    case ' ':
                        this.setBlocked(point, false);
                        break;
                    case 'o':
                        this.startPoint = point;
                        break;
                    case 'x':
                        this.endPoint = point;
                        break;
                }
            }
        }
    }

    save() {
        const str = this.export();
        localStorage.setItem('maze', str);
    }

    load() {
        const str = localStorage.getItem('maze');
        this.import(str);
    }

    get hasSaved() {
        return localStorage.getItem('maze') !== null;
    }
}
