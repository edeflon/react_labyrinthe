export default class Pilone {
    key: string;
    x: string;
    y: string;

    constructor(id: number, x: string, y: string) {
        this.key = "pilone_" + id.toString();
        this.x = x;
        this.y = y;
    }
}
