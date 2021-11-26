import React from 'react';
import {StyleSheet, ToastAndroid, View, Text, ImageBackground, StatusBar, TouchableHighlight} from 'react-native';
import {Actions} from "react-native-router-flux";
import {dimension} from "../assets/dimension";


export default function Home() {
    const textColors = ['#FFF', '#EEE', '#DDD', '#CCC', '#BBB', '#AAA', '#999', '#888',
        '#777', '#666', '#555', '#444', '#333', '#222', '#111', '#000'];

    const onJouerClic = () => {
        Actions.Lobby();
    }

    const onScoreClic = () => {
        ToastAndroid.show("Section \"Scores\" en construction", ToastAndroid.SHORT);
    }

    return (
        <ImageBackground source={require("../assets/images/labybackground.png")}
                         style={[{width: '100%', height: '100%'}]}>
            <View style={[styles.container, {marginTop: -20}]}>
                <StatusBar
                    animated={false}
                    backgroundColor="#111"
                    hidden={false} />
                <Text style={[styles.text]}>
                    <Text style={{color: textColors[0]}}>L</Text>
                    <Text style={{color: textColors[1]}}>A</Text>
                    <Text style={{color: textColors[2]}}>B</Text>
                    <Text style={{color: textColors[3]}}>Y</Text>
                    <Text style={{color: textColors[4]}}>R</Text>
                    <Text style={{color: textColors[5]}}>I</Text>
                    <Text style={{color: textColors[6]}}>N</Text>
                    <Text style={{color: textColors[7]}}>V</Text>
                    <Text style={{color: textColors[8]}}>I</Text>
                    <Text style={{color: textColors[9]}}>S</Text>
                    <Text style={{color: textColors[10]}}>I</Text>
                    <Text style={{color: textColors[11]}}>B</Text>
                    <Text style={{color: textColors[12]}}>L</Text>
                    <Text style={{color: textColors[13]}}>E</Text>
                </Text>
                <TouchableHighlight
                    style={[styles.buttonBackground, {backgroundColor: "#044374"}]}
                    onPressOut={() => onJouerClic()}>
                    <Text style={[styles.buttonText]}>JOUER</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.buttonBackground, {backgroundColor: "#2f1b67"}]}
                    onPressOut={() => onScoreClic()}>
                    <Text style={[styles.buttonText]}>SCORES</Text>
                </TouchableHighlight>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 36,
        width: dimension.width,
        height: dimension.height,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111C",
    },
    text: {
        fontWeight: 'bold',
        fontSize: 35,
        margin: 30,
    },
    buttonBackground: {
        justifyContent: "center",
        alignItems: "center",
        width: dimension.width,
        height: dimension.height / 12,
        marginBottom: dimension.height / 300,
        borderWidth: 4,
        borderColor: "#111",
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "100",
        fontSize: 30,
    }
});
