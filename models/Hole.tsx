export default class Hole {
    key: string;
    radialKey: string;
    fillId: string;
    x: string;
    y: string;
    rx: string;
    ry: string
    show: boolean;

    constructor(id: number, x: string, y: string, rx: string, ry: string, display: boolean) {
        this.key = "hole_" + id.toString();
        this.radialKey = "grad_" + this.key;
        this.fillId = "url(#" + this.radialKey + ")";
        this.x = x;
        this.y = y;
        this.rx = rx;
        this.ry = ry;
        this.show = display;
    }
}
