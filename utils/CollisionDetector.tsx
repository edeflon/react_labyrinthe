import React from 'react';
import {dimension} from "../assets/dimension";
import Wall from "../models/Wall";
import Hole from "../models/Hole";

// Représentation d'un rectangle
class Rect {
    x1: number;
    x2: number;
    y1: number;
    y2: number;

    constructor(x1: number, x2: number, y1: number, y2: number) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
}

// Classe en charge des collisions
export default class CollisionDetector {
    walls: Wall[] = [];
    holes: Hole[] = [];
    ballR = 0;

    constructor(level: any) {
        // Récupération des éléments du labyrinthe (murs, pièges)
        const interior_walls = level.interior_vertical_wall.concat(level.interior_horizontal_wall);
        const lab_walls = interior_walls.concat(level.exterior_walls);

        let idwall = 0;
        lab_walls.map((wall: any) => {
            this.walls[idwall] = new Wall(wall.id, wall.x, wall.y, wall.width, wall.height, false);
            idwall += 1;
        });

        let idhole = 0;
        level.holes.map((hole: any) => {
            this.holes[idhole] = new Hole(idhole, hole.x, hole.y, hole.rx, hole.ry, false);
            idhole += 1;
        });
    }

    // Retourne le rectangle autour de la balle
    xyr2Rect(x: number, y: number, r: number): Rect {
        const ballXPercent = (x / dimension.width) * 100;
        const ballYPercent = (y / dimension.height) * 100;

        return new Rect(
            ballXPercent - r * 2,
            ballXPercent + r * 2,
            ballYPercent - r,
            ballYPercent + r
        )
    }

    // Recherche d'une collision entre un piège et la balle
    isCollisionHole(ballX: number, ballY: number, ballR: number) {
        const ballRect = this.xyr2Rect(ballX, ballY, ballR)

        for (let i = 0; i < this.holes.length; i++) {
            const holeXMin = (parseFloat(this.holes[i].x) - parseFloat(this.holes[i].rx) / 2);
            const holeXMax = (parseFloat(this.holes[i].x) + parseFloat(this.holes[i].rx) / 2);
            const holeYMin = (parseFloat(this.holes[i].y) - parseFloat(this.holes[i].ry) / 2);
            const holeYMax = (parseFloat(this.holes[i].y) + parseFloat(this.holes[i].ry) / 2);

            if (
                holeXMin < ballRect.x2 && holeXMax > ballRect.x1 &&
                holeYMin < ballRect.y2 && holeYMax > ballRect.y1
            ) {
                return true;
            }
        }
        return false;
    }

    // Recherche d'une collision entre un mur et la balle
    isCollision(ballX: number, ballY: number, ballR: number) {
        const ballRect = this.xyr2Rect(ballX, ballY, ballR);

        for (let i = 0; i < this.walls.length; i++) {
            const wallX = parseFloat(this.walls[i].x);
            const wallY = parseFloat(this.walls[i].y);
            const wallWidth = parseFloat(this.walls[i].width);
            const wallHeight = parseFloat(this.walls[i].height);

            if (
                wallX < ballRect.x2 && wallX + wallWidth > ballRect.x1 &&
                wallY < ballRect.y2 && wallY + wallHeight > ballRect.y1
            ) {
                return this.getCollisionType(ballRect, wallX, wallY, wallWidth, wallHeight);
            }
        }

        return "";
    }

    // Recupère le type de collision (verticale ou horizontale)
    getCollisionType(ballRect: Rect, wallX: number, wallY: number, wallWidth: number, wallHeight: number) {
        const colx1 = ballRect.x2 - wallX;
        const colx2 = (wallX + wallWidth) - ballRect.x1;
        const coly1 = ballRect.y2 - wallY;
        const coly2 = (wallY + wallHeight) - ballRect.y1;

        if ((colx1 < colx2 && colx1 < coly1 && colx1 < coly2) || (colx2 < colx1 && colx2 < coly1 && colx2 < coly2)) {
            return "V";
        }
        if ((coly1 < colx2 && coly1 < colx1 && coly1 < coly2) || (coly2 < colx1 && coly2 < coly1 && coly2 < colx2)) {
            return "H";
        }
    }
}
