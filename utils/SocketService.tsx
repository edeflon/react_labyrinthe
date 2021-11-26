import {io} from "socket.io-client";
import Circle from "../models/Circle";
import {PlayerType} from "../enum/PlayerType";

const socket = io('http://192.168.1.96:3000', {transports: ['websocket']});


export const SocketService = {
    sendCircles(circles: Circle[]) {
        socket.emit("sendCircles", circles);
    },
    receiveCircles(callback: Function) {
        socket.on('receiveCircles', (circles) => {
            callback(circles);
        });
    },

    sendBallPosition(ballPosition: [number, number]) {
        socket.emit("sendBallPosition", ballPosition);
    },
    receiveBallPosition(callback: Function) {
        socket.on("receiveBallPosition", (ballPosition) => {
            callback(ballPosition);
        });
    },

    sendToNextLevel(){
        socket.emit("sendToNextLevel");
    },
    goToNextLevel(callback: Function){
        socket.on("goToNextLevel", () => { callback() })
    },

    setPlayerType(type: PlayerType) {
        socket.emit("playerConnexion", type);
    },

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
