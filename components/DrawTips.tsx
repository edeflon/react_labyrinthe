import React, {Component} from 'react';
import {FAB} from 'react-native-paper';
import {StyleSheet, View, GestureResponderEvent, Animated} from "react-native";
import Svg, {Line, Circle as SVGCircle} from 'react-native-svg';

import Circle from '../models/Circle';
import {dimension} from "../assets/dimension";
import {SocketService} from "../utils/SocketService";

// Module de dessin
export default class DrawTips extends Component {
    private lineId: number;

    constructor(props) {
        super(props);

        this.state = {
            colorSelected: "#FF6252",
            circleX: 0,
            circleY: 0,
            cpt: 0,
            coordinates: [],
            lines: [],
            drawing: false,
            startLine: true,
            showMenu: false,
        }

        this.lineId = 0;
    }

    // Récupère les coordonnées du doigt du joueur en une liste de points
    getCoordinates(e: GestureResponderEvent) {
        if (this.state.showMenu) {
            this.setState({showMenu: false});
        }

        const cx = (e.nativeEvent.locationX / dimension.width * 100).toString() + "%";
        const cy = (e.nativeEvent.locationY / dimension.height * 100).toString() + "%";

        // Update X & Y
        this.setState(
            {
                drawing: true,
                circleX: cx,
                circleY: cy,
            },
            this.addCircle
        );
    }

    addCircle() {
        // Create new Circle
        const newCircle = new Circle(
            this.state.circleX, this.state.circleY, this.state.colorSelected, this.state.startLine,
        );

        if (this.state.startLine) {
            this.setState({startLine: false});
        }

        let arrayCoordinates = this.state.coordinates.slice();

        if (arrayCoordinates.length >= 10) {
            arrayCoordinates.shift();
        }

        arrayCoordinates.push(newCircle);
        let cpt = this.state.cpt + 1;

        // Envoie des cercles à l'autre joueur
        if (cpt % 3 == 0) {
            SocketService.sendCircles(arrayCoordinates);
        }

        // Add new Circle to Coordinates array
        this.setState({
            coordinates: arrayCoordinates,
            cpt: cpt
        });
    }

    // Dessine des lignes entre chaque cercle pour obtenir un dessin en continu
    drawLines() {
        if (this.state.drawing) {
            let lines = [];
            for (let i = 0; i < this.state.coordinates.length - 1; i++) {
                let id = "line_";
                if (this.state.coordinates[i] !== undefined && this.state.coordinates[i + 1] !== undefined && this.state.coordinates[i + 1].startLine !== true) {
                    this.lineId += 1;
                    id += this.lineId.toString();
                    lines.push(
                        <Line
                            key={id}
                            x1={this.state.coordinates[i].x} y1={this.state.coordinates[i].y} x2={this.state.coordinates[i + 1].x} y2={this.state.coordinates[i + 1].y} stroke={this.state.coordinates[i].color}
                            strokeLinecap={"round"}
                            strokeWidth='8'/>
                    )
                }
            }
            return lines;
        }
        return null;
    }

    // Affichage
    render() {
        return (
            <View style={styles.container}>
                <Animated.View
                    onTouchStart={() => this.setState({startLine: true})}
                    onTouchMove={(e) => {
                        this.getCoordinates(e)
                    }}
                    style={[styles.container]}>
                    <Svg
                        height="100%"
                        width="100%"
                        viewBox={`0 0 ${dimension.width} ${dimension.height}`}
                    >
                        {this.drawLines()}
                    </Svg>
                </Animated.View>
                {
                    this.state.showMenu ?
                    (<View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        position: "absolute",
                        backgroundColor: "#FFF",
                        marginLeft: 65,
                        marginBottom: 40,
                        left: 0,
                        bottom: 0,
                        width: 225,
                        height: 55,
                        borderRadius: 10
                    }}>
                        <View onTouchEnd={() => this.setState({colorSelected: "#FF6252"})}
                              style={{
                                  marginLeft: 55,
                                  margin: 10,
                                  backgroundColor: "#FF6252",
                                  width: 35,
                                  height: 35
                              }}/>
                        <View onTouchEnd={() => this.setState({colorSelected: "#A9D78A"})}
                              style={{margin: 10, backgroundColor: "#A9D78A", width: 35, height: 35}}/>
                        <View onTouchEnd={() => this.setState({colorSelected: "#5ADDFC"})}
                              style={{margin: 10, backgroundColor: "#5ADDFC", width: 35, height: 35}}/>
                    </View>) : null}
                <FAB
                    style={[styles.fab, {backgroundColor: this.state.colorSelected}]}
                    icon="plus"
                    onPress={() => (this.state.showMenu ? this.setState({showMenu: false}) : this.setState({showMenu: true}))}
                />
            </View>
        );
    }
}

// Style
const styles = StyleSheet.create({
    container: {
        flex: 1,
        top: 0,
        left: 0,
    },
    fab: {
        position: 'absolute',
        margin: 40,
        left: 0,
        bottom: 0,
    },
    text: {
        color: "#FFF",
        fontSize: 20,
        textTransform: "uppercase",
    },
});
