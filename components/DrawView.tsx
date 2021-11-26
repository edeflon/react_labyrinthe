import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from "react-native";
import Svg, {Line} from 'react-native-svg';
import {SocketService} from "../utils/SocketService";
import {dimension} from "../assets/dimension";

// import {dimension} from "../assets/dimension";

/** Draw Tips on labyrinthe */
export function DrawView() {
    const [coordinates, setCoordinates] = useState([]);
    let lineId = 0;

    const _subscribe = () => {
        SocketService.receiveCircles(newCircles);
    }

    // @ts-ignore
    const newCircles = (circles) => {
        setCoordinates(circles);
    }

    useEffect(() => {
        _subscribe();
        // return () => _unsubscribe();
    }, []);

    const drawLines = () => {
        if (coordinates != null) {
            let lines = [];
            for (let i = 0; i < coordinates.length - 1; i++) {
                let id = "line_";
                // @ts-ignore
                if (coordinates[i] !== undefined && coordinates[i + 1] !== undefined && coordinates[i + 1].startLine !== true) {
                    lineId += 1;
                    id += lineId.toString();
                    lines.push(
                        <Line
                            key={id}
                            // @ts-ignore
                            x1={coordinates[i].x} y1={coordinates[i].y} x2={coordinates[i + 1].x} y2={coordinates[i + 1].y} stroke={coordinates[i].color}
                            strokeLinecap={"round"}
                            strokeWidth='8'/>
                    )
                }
            }
            return lines;
        }
        return null;
    }

    return (
        <View style={styles.container}>
            <Svg
                height="100%"
                width="100%"
                viewBox={`0 0 ${dimension.width} ${dimension.height}`}
            >
                {drawLines()}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#111" // add 0 to put opacity to 0
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
