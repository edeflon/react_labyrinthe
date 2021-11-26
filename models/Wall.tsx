import {dimension} from "../assets/dimension";

export default class Wall {
    key: string;
    x: string;
    y: string;
    width: string;
    height: string;
    show: boolean;

    constructor(id: number, x: string, y: string, width: string, height: string, show: boolean) {
        this.key = "wall_" + id.toString();
        this.x = x;
        this.y = y ;
        this.width = width;
        this.height = height;
        this.show = show;
    }
}
