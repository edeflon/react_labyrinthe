import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Animated, Modal, Text, Pressable} from 'react-native';
import { interpolate, useSharedValue } from 'react-native-reanimated';
import {SocketService} from "../utils/SocketService";
import Labyrinthe from "./Labyrinthe";
import Ball from "../models/Ball";

import levels from "../assets/levels/levels.json";
import {dimension} from "../assets/dimension";
import Svg, {Circle} from "react-native-svg";
import {Actions} from "react-native-router-flux";

export default function BallView(level: any) {
    const [subscription, setSubscription] = useState(null);

    const [modalWinVisible, setModalWinVisible] = useState(false);

    const [currentLevel, setCurrentLevel] = useState(level.level);
    const [labyrinthe] = useState(() => Labyrinthe(currentLevel, true));
    const [ball] = useState(() => new Ball(currentLevel.startZone.x, currentLevel.startZone.y,
        currentLevel.startZone.width, currentLevel.startZone.height, currentLevel.ball.v, currentLevel.ball.r));


    const x = useSharedValue(ball.x);
    const y = useSharedValue(ball.y);

    const [translateX, setTranslateX] = useState(interpolate(x.value, [-1, 1], [36, dimension.width]))
    const [translateY, setTranslateY] = useState(interpolate(y.value, [-1, 1], [0, dimension.height]))

    const _subscribe = () => {
        if (!modalWinVisible) SocketService.receiveBallPosition(setBallPosition);
    }

    const setBallPosition = (ballPosition: [number, number]) => {
        x.value = ballPosition[0] * dimension.width;
        y.value = ballPosition[1] * dimension.height;

        setTranslateX(interpolate(x.value, [0, dimension.width], [0, dimension.width]));
        setTranslateY(interpolate(y.value, [0, dimension.height], [0, dimension.height]));
    }

    const _unsubscribe = () => {
        // @ts-ignore
        subscription && subscription.remove();
        setSubscription(null);
    };

    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);

    const nextLevel = () => {
        const level = levels.level2;
        setModalWinVisible(false);
        Actions.refresh({key: "ViewDraw", level: level});
    }

    const winModal = () => {
        return (
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
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

    // View
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
