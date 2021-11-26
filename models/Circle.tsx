export default class Circle {
    x: number;
    y: number;
    color: string;
    startLine: boolean;

    constructor(x: number, y: number, color: string, startLine: boolean) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.startLine = startLine;
    }
}
