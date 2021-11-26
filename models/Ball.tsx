import {dimension} from "../assets/dimension";

export default class Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    vMax: number[];
    size: number;
    r: number;
    r2: number;

    constructor(startx: string, starty: string, startwidth: string, startheight: string, v: number[], size: number) {
        this.x = dimension.width * ((parseFloat(startx) + (parseFloat(startwidth)/2)) / 100);
        this.y = dimension.height * ((parseFloat(starty) + (parseFloat(startheight)/2)) / 100);
        // this.x = dimension.width * ((parseFloat(startx) + (parseFloat(startwidth)/2)) / 100);
        // this.y = dimension.height * ((parseFloat(starty) + (parseFloat(startheight)/2)) / 100) + 50;
        this.vx = v[0];
        this.vy = v[1];
        this.vMax = [1, 1];
        this.size = dimension.width * (size/100);
        this.r = size/2;
        this.r2 = this.r * this.r;
        console.log("Ball set");
    }

    isWin(newX: number, newY: number, endarea: any) {
        const ballX = (newX / dimension.width) * 100;
        const ballY = (newY / dimension.height) * 100;

        const endX = parseFloat(endarea.x) + (parseFloat(endarea.width) / 2);
        const endY = parseFloat(endarea.y) + (parseFloat(endarea.height) / 2);

        const endXMin = endX - this.r;
        const endXMax = endX + this.r;
        const endYMin = endY - this.r;
        const endYMax = endY + this.r;

        // console.log(ballXMin, ballXMax, ballYMin, ballYMax);
        return (endXMin <= ballX && ballX <= endXMax) && (endYMin <= ballY && ballY <= endYMax);
    }
}
