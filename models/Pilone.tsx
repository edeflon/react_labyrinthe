// Modèle d'un Pilone
export default class Pilone {
    key: string;
    x: string; // Position x
    y: string; // Position y

    constructor(id: number, x: string, y: string) {
        this.key = "pilone_" + id.toString();
        this.x = x;
        this.y = y;
    }
}
