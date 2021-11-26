import React, {useState} from 'react';
import {Actions} from "react-native-router-flux";
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    TouchableHighlight,
    StatusBar
} from 'react-native';

import {SocketService} from "../utils/SocketService";
import {PlayerType} from "../enum/PlayerType";
import {dimension} from "../assets/dimension";
import levels from "../assets/levels/levels.json";


export default function Lobby() {
    const [isReady, setIsReady] = useState(false);

    const [playerType, setPlayerType] = useState(-1);
    const [drawerStatus, setDrawerStatus] = useState(false);
    const [controllerStatus, setControllerStatus] = useState(false);

    // Set colors
    let controllerColor = "#7999";
    let drawerColor = "#7999";
    let soloColor = "#044374";

    // Set role availability
    let drawerSubText = null;
    let controllerSubText = null;

    // Update colors
    if (playerType == PlayerType.CONTROLLER) { controllerColor = "#7990" } else if (controllerStatus || playerType != -1) { controllerColor = "#788E" }
    if (playerType == PlayerType.DRAWER) { drawerColor = "#7990" } else if (drawerStatus || playerType != -1) { drawerColor = "#788E" }

    // Update role availability
    if (playerType == PlayerType.DRAWER) { drawerSubText = [<Text key="drawerSelected" style={[styles.subtext]}>Rôle sélectionné</Text>]; }
    if (playerType == PlayerType.CONTROLLER) { controllerSubText = [<Text key="controllerSelected" style={[styles.subtext]}>Rôle sélectionné</Text>]; }
    if (drawerStatus && playerType != PlayerType.DRAWER) { drawerSubText = [<Text key="drawerTaken" style={[styles.subtext]}>Rôle indisponible</Text>] }
    if (controllerStatus && playerType != PlayerType.CONTROLLER) { controllerSubText = [<Text key="controllerTaken" style={[styles.subtext]}>Rôle indisponible</Text>] }

    const onTypeSelection = (type: PlayerType) => {
        console.log("type: ", type);
        setPlayerType(type);
        SocketService.setPlayerType(type);

        soloColor = "#799";
    }

    SocketService.setDrawerConnected(() => {
        setDrawerStatus(true);
    })
    SocketService.setDrawerDisconnected(() => {
        setDrawerStatus(false);
    })
    SocketService.setControllerConnected(() => {
        setControllerStatus(true);
    })
    SocketService.setControllerDisconnected(() => {
        setControllerStatus(false);
    })

    SocketService.onGameReady(() => {
        console.log('game is ready');
        setIsReady(true);
    })
    SocketService.onGameStop(() => {
        console.log('one player disconnected');
        setIsReady(false);
    })

    function onModeSolo() {
        const level = levels.level1;
        if (playerType == PlayerType.DRAWER) {
            Actions.ViewDraw({level});
        } else {
            Actions.ViewControl({level});
        }
    }

    // Check if the game has to start
    if (isReady) {
        const level = levels.level1;
        if (playerType == PlayerType.DRAWER) {
            Actions.ViewDraw({level});
        } else {
            Actions.ViewControl({level});
        }
    }

    return (
        <ImageBackground source={require("../assets/images/labybackground.png")} style={[styles.img]}>
            <View style={[styles.container]}>
                <StatusBar animated={false} backgroundColor="#111" hidden={false}/>
                <Text style={[styles.text]}>SELECTION DE RÔLE</Text>
                <View style={[styles.roleButtonContainer]}>
                    <View style={[styles.controllerButtonSelection]}>
                        <TouchableHighlight disabled={controllerStatus || playerType != -1} key="ctrlTouch"
                                            style={[styles.buttonRoleSelectBackground]}
                                            onPress={() => onTypeSelection(PlayerType.CONTROLLER)}>
                            <ImageBackground source={require('../assets/images/controller_bg_1.jpg')} style={[styles.img]}>
                                <View style={[styles.buttonRoleSelectBackground, {backgroundColor: controllerColor}]}>
                                    <Text style={[styles.buttonText]}>CONTRÔLEUR</Text>
                                    { controllerSubText }
                                </View>
                            </ImageBackground>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.controllerButtonSelection]}>
                        <TouchableHighlight disabled={drawerStatus || playerType != -1} key="drawTouch"
                                            style={[styles.buttonRoleSelectBackground]}
                                            onPress={() => onTypeSelection(PlayerType.DRAWER)}>
                            <ImageBackground source={require('../assets/images/drawer_bg_2.jpg')} style={[styles.img]}>
                                <View style={[styles.buttonRoleSelectBackground, {backgroundColor: drawerColor}]}>
                                    <Text style={[styles.buttonText]}>DESSINATEUR</Text>
                                    { drawerSubText }
                                </View>
                            </ImageBackground>
                        </TouchableHighlight>
                    </View>
                </View>
                <TouchableHighlight disabled={playerType == -1} style={[styles.buttonBackground, {backgroundColor: soloColor}]}
                           onPress={() => onModeSolo()}>
                    <Text style={[styles.buttonText]}>MODE SOLO</Text>
                </TouchableHighlight>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: dimension.width,
        height: dimension.height,
        backgroundColor: "#111C",
    },
    roleButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 27,
        color: "#FFF",
        marginTop: 40,
        marginBottom: 30,
        textAlign: "center"
    },
    subtext: {
        color: "#DDD",
        fontStyle: "italic",
        fontSize: 20,
    },
    img: {
        width: "100%",
        height: "100%",
    },
    controllerButtonSelection: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 4,
        borderColor: "#111",
    },
    buttonBackground: {
        justifyContent: "center",
        alignItems: "center",
        width: dimension.width,
        height: dimension.height / 10,
        marginTop: 20,
        borderWidth: 4,
        borderColor: "#111",
    },
    buttonRoleSelectBackground: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        width: dimension.width / 2,
        height: dimension.height - 400,
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "100",
        fontSize: 25,
    },
});
