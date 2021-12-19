import {io} from "socket.io-client";
import Circle from "../models/Circle";
import {PlayerType} from "../enum/PlayerType";

const socket = io('http://10.7.147.141:3000', {transports: ['websocket']}); // Création de la socket

// Classe en charge des communications avec la socket
export const SocketService = {
    // Envoie et réception des dessins
    sendCircles(circles: Circle[]) {
        socket.emit("sendCircles", circles);
    },
    receiveCircles(callback: Function) {
        socket.on('receiveCircles', (circles) => {
            callback(circles);
        });
    },

    // Envoie et réception de la position de la balle
    sendBallPosition(ballPosition: [number, number]) {
        socket.emit("sendBallPosition", ballPosition);
    },
    receiveBallPosition(callback: Function) {
        socket.on("receiveBallPosition", (ballPosition) => {
            callback(ballPosition);
        });
    },

    // Signaux pour changer de niveau
    sendToNextLevel(){
        socket.emit("sendToNextLevel");
    },
    goToNextLevel(callback: Function){
        socket.on("goToNextLevel", () => { callback() })
    },

    // Définition des joueurs
    setPlayerType(type: PlayerType) {
        socket.emit("playerConnexion", type);
    },

    // Statut des joueurs
    setDrawerConnected(callback: Function) {
        socket.on('drawerConnected', () => {
            callback();
        });
    },
    setDrawerDisconnected(callback: Function) {
        socket.on('drawerDisconnected', () => {
            callback();
        });
    },
    setControllerConnected(callback: Function) {
        socket.on('controllerConnected', () => {
            callback();
        });
    },
    setControllerDisconnected(callback: Function) {
        socket.on('controllerDisconnected', () => {
            callback();
        });
    },

    // Statut de la partie
    onGameReady(callback: Function) {
        socket.on('gameReady', () => {
            callback();
        });
    },
    onGameStop(callback: Function) {
        socket.on('gameStop', () => {
            callback();
        });
    }
}
