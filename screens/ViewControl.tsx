import React, {Component} from "react";
import {StyleSheet, View, StatusBar} from 'react-native';
import {DrawView} from "../components/DrawView";
import BallControl from "../components/BallControl";
import {dimension} from "../assets/dimension";

// Ecran du joueur "Controlleur"
export default class ViewControl extends Component {
    constructor(props) {
        super(props)
    }

    // Affichage
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    animated={false}
                    backgroundColor="#111"
                    hidden={false} />
                <View style={styles.topview}>
                    <BallControl level={this.props.level}/>
                </View>
                <View style={styles.downview}>
                    <DrawView/>
                </View>
            </View>
        );
    }
}

// Style de la page
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111",
    },
    topview: {
        position: 'relative',
        width: 200,
        height: "auto",
    },
    downview: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: dimension.width,
        height: dimension.height,
    },
});

