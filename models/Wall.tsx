import {dimension} from "../assets/dimension";

// Modèle d'un mur
export default class Wall {
    key: string;
    x: string; // Position x
    y: string; // Position y
    width: string; // largeur
    height: string; // hauteur
    show: boolean; // affichage

    constructor(id: number, x: string, y: string, width: string, height: string, show: boolean) {
        this.key = "wall_" + id.toString();
        this.x = x;
        this.y = y ;
        this.width = width;
        this.height = height;
        this.show = show;
    }
}
