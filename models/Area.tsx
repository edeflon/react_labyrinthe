export default class Area {
    key: string;
    x: string;
    y: string;
    width: string;
    height: string;
    color: string;

    constructor(id: number, x: string, y: string, width: string, height: string, color: string) {
        this.key = "area_" + id.toString();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}
