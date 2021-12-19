import React, {useState, useEffect} from 'react';
import {Modal, StyleSheet, Text, Pressable, View} from "react-native";
import {DeviceMotion} from 'expo-sensors';
import Ball from "../models/Ball";
import Labyrinthe from "./Labyrinthe";
import levels from "../assets/levels/levels.json";
import {dimension} from "../assets/dimension";
import Svg, {Circle} from "react-native-svg";
import {useSharedValue} from 'react-native-reanimated';
import {SocketService} from "../utils/SocketService";
import CollisionDetector from "../utils/CollisionDetector";
import {Actions} from "react-native-router-flux";

// Module de contrôle de la balle
export default function BallControl(level: any) {
    let cptSend = 0;

    // All functions for Gyroscope
    const [data, setData] = useState({
        alpha: 0,
        beta: 0,
        gamma: 0,
    });

    const [modalWinVisible, setModalWinVisible] = useState(false); // Pop up de victoire
    const [currentLevel, setCurrentLevel] = useState(level.level); // Niveau actuel
    const [labyrinthe] = useState(() => Labyrinthe(currentLevel, false)); // Labyrinthe du niveau
    const [ball] = useState(() => new Ball(currentLevel.startZone.x, currentLevel.startZone.y,
        currentLevel.startZone.width, currentLevel.startZone.height, currentLevel.ball.v, currentLevel.ball.r)); // Balle

    const [collisionDetector] = useState(() => new CollisionDetector(currentLevel)); // Détecteur de collision

    // Coordonnées de la balle
    const x = useSharedValue(ball.x);
    const y = useSharedValue(ball.y);
    const vx = useSharedValue(ball.vx);
    const vy = useSharedValue(ball.vy);

    // Récupération de la position de la balle
    const _subscribe = () => {
        // Détection des mouvements du téléphone
        DeviceMotion.addListener((devicemotionData) => {
            if (ball.isWin(x.value, y.value, currentLevel.endZone)) {
                SocketService.sendToNextLevel();
                setModalWinVisible(true);
            } else {
                // Mise à jour des coordonnées de la balle
                setData(devicemotionData.rotation);
                vx.value += devicemotionData.rotation.gamma;
                vy.value += devicemotionData.rotation.beta;
                if (vx.value > ball.vMax[0]) { vx.value = ball.vMax[0]; }
                if (vx.value < -ball.vMax[0]) { vx.value = -ball.vMax[0]; }
                if (vy.value > ball.vMax[1]) { vy.value = ball.vMax[1]; }
                if (vy.value < -ball.vMax[1]) { vy.value = -ball.vMax[1]; }
                const newX = x.value + vx.value;
                const newY = y.value + vy.value;

                // Vérification des collisions
                if (collisionDetector.isCollisionHole(newX, newY, ball.r)) {
                    x.value = ball.x;
                    y.value = ball.y;
                } else {
                    const result = collisionDetector.isCollision(newX, newY, ball.r);
                    if (result == "") {
                        x.value = newX;
                        y.value = newY;
                    } else if (result == "V") {
                        vx.value = -vx.value;
                    } else if (result == "H") {
                        vy.value = -vy.value;
                    }
                }

                // Envoie des nouvelles coordonnées à l'autre joueur
                cptSend += 1;
                if (cptSend == 10) {
                    cptSend = 0;
                    SocketService.sendBallPosition(
                    [(x.value / dimension.width),
                        (y.value / dimension.height)]);
                }
            }
        });

    };

    const _unsubscribe = () => {
        DeviceMotion.removeAllListeners();
    };

    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);

    // Changement de niveau
    const nextLevel = () => {
        const level = levels.level2;
        setModalWinVisible(false);
        Actions.refresh({key: "ViewControl", level: level});
    }

    // Affichage de la pop up de victoire
    const winModal = () => {
        return (
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalWinVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Niveau terminé!</Text>
                            {currentLevel == levels.level2 ?
                                <Text style={[styles.modalText, {color: "#FF6252", fontStyle: "italic"}]}>
                                    Prochain niveau à venir...
                                </Text>
                                :
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => nextLevel()}
                                >
                                    <Text style={styles.textStyle}>Niveau suivant</Text>
                                </Pressable>
                            }

                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    // Affichage
    return (
        <View style={styles.container}>
            <View style={styles.topview}>
                {labyrinthe}
            </View>
            <View style={styles.downview}>
                {/* BALL */}
                <Svg height="100%"
                     width="100%"
                     viewBox={`0 0 ${dimension.width} ${dimension.height}`}>
                    <Circle fill="#FFF"
                            cx={x.value}
                            cy={y.value}
                            r={ball.size}/>
                </Svg>
                {modalWinVisible ?
                    winModal()
                    : null
                }
            </View>
        </View>
    );
}

// Style
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: dimension.width,
        height: dimension.height,
    },
    topview: {
        position: 'relative',
        top: 0,
        left: 0,
        width: dimension.width,
        height: dimension.height,
    },
    downview: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: dimension.width,
        height: dimension.height,
    },
    // modal
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "#A9D78A",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});
