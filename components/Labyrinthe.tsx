import React from "react";
import {StyleSheet, View} from 'react-native';
import Svg, {Circle as SVGCircle, Defs, Ellipse, Line, RadialGradient, Rect, Stop} from "react-native-svg";
import Pilone from "../models/Pilone";
import Wall from "../models/Wall";
import Area from "../models/Area";

// import levels from "../assets/levels/levels.json"
import Hole from "../models/Hole";
import {dimension} from "../assets/dimension";

function setPiloneList(currentLevel: any) {
    let arrayPilone: Pilone[] = [];
    let cpt = 0;
    currentLevel.pilones.map((data: any) => {
        arrayPilone[cpt] = new Pilone(cpt, data.x, data.y);
        cpt += 1;
    });

    return arrayPilone;
}

function setExteriorWall(currentLevel: any) {
    let arrayWall: Wall[] = [];
    currentLevel.exterior_walls.map((data: any) => {
        arrayWall[data.id] = new Wall(data.id, data.x, data.y, data.width, data.height, true);
    });

    return arrayWall;
}

function setInteriorVerticalWall(currentLevel: any, display: boolean) {
    // VERTICAL WALL: col1->x30, col2->x5°, col3->x70
    let arrayIVWall: Wall[] = [];
    currentLevel.interior_vertical_wall.map((data: any) => {
        arrayIVWall[data.id] = new Wall(data.id, data.x, data.y, data.width, data.height, display);
    });

    return arrayIVWall;
}

function setInteriorHorizontalWall(currentLevel: any, display: boolean) {
    let arrayHVWall: Wall[] = [];
    currentLevel.interior_horizontal_wall.map((data: any) => {
        arrayHVWall[data.id] = new Wall(data.id, data.x, data.y, data.width, data.height, display);
    });

    return arrayHVWall;
}

function setHoles(currentLevel: any, display: boolean) {
    let arrayHole: Hole[] = [];
    let cpt = 0;

    currentLevel.holes.map((data: any) => {
        arrayHole[cpt] = new Hole(cpt, data.x, data.y, data.rx, data.ry, display);
        cpt += 1;
    });

    return arrayHole
}

export default function Labyrinthe(currentLevel: any, display: boolean) {
    console.log("Labyrinthe set");

    const startZone = new Area(
        currentLevel.startZone.id,
        currentLevel.startZone.x,
        currentLevel.startZone.y,
        currentLevel.startZone.width,
        currentLevel.startZone.height,
        currentLevel.startZone.color);
    const endZone = new Area(
        currentLevel.endZone.id,
        currentLevel.endZone.x,
        currentLevel.endZone.y,
        currentLevel.endZone.width,
        currentLevel.endZone.height,
        currentLevel.endZone.color);

    const arrayPilone = setPiloneList(currentLevel);
    const exteriorWall = setExteriorWall(currentLevel);
    const verticalWall = setInteriorVerticalWall(currentLevel, display);
    const horizontalWall = setInteriorHorizontalWall(currentLevel, display);
    const arrayHole = setHoles(currentLevel, display);

    // x : 0 -> 100
    // y : -40 -> 150
    function drawPiloneList() {
        return arrayPilone.map((data) => {
            return (
                <SVGCircle
                    key={data.key}
                    cx={data.x}
                    cy={data.y}
                    r="2"
                    fill="#FFF"
                />
            )
        });
    }

    function drawHoleList() {
        return arrayHole.map((data) => {
            if (data.show) {
                return (
                    <View key={"view_" + data.key}>
                        <Defs key={"defs_" + data.key}>
                            <RadialGradient
                                id={data.radialKey}
                                key={data.radialKey}
                                cx={data.x}
                                cy={data.y}
                                rx={data.rx}
                                ry={data.ry}
                                fx="150"
                                fy="75"
                                gradientUnits="userSpaceOnUse">
                                <Stop offset="0" stopColor="#000" stopOpacity="1"/>
                                <Stop offset="1" stopColor="#FF6252" stopOpacity="1"/>
                            </RadialGradient>
                        </Defs>
                        <Ellipse key={data.key} cx={data.x} cy={data.y} rx={data.rx} ry={data.ry} fill={data.fillId}/>
                    </View>
                );
            }
        });
    }

    function drawExteriorWall() {
        return exteriorWall.map((data) => {
            return (
                <Rect
                    key={data.key}
                    x={data.x}
                    y={data.y}
                    width={data.width}
                    height={data.height}
                    fill="#FFF"
                />
            )

        });
    }

    function drawHorizontalWall() {
        return horizontalWall.map((data) => {
            if (data.show) {
                return (
                    <Rect
                        key={data.key}
                        x={data.x}
                        y={data.y}
                        width={data.width}
                        height={data.height}
                        fill="#FFF"
                    />
                )

            }
        });
    }

    function drawVerticalWall() {
        return verticalWall.map((data) => {
            if (data.show) {
                return (
                    <Rect
                        key={data.key}
                        x={data.x}
                        y={data.y}
                        width={data.width}
                        height={data.height}
                        fill="#FFF"
                    />
                )
            }
        });
    }

    return (
        <View style={styles.container}>
            <Svg
                height="100%"
                width="100%"
                viewBox={`0 0 ${dimension.width} ${dimension.height}`}>
                <Rect // @ts-ignore
                    key={endZone.key} x={endZone.x} y={endZone.y}
                    // @ts-ignore
                    width={endZone.width} height={endZone.height} fill={endZone.color}
                    strokeWidth="0"
                    stroke="rgb(0,0,0)"
                />
                <Rect // @ts-ignore
                    key={startZone.key} x={startZone.x} y={startZone.y}
                    // @ts-ignore
                    width={startZone.width} height={startZone.height} fill={startZone.color}
                    strokeWidth="0"
                    stroke="rgb(0,0,0)"
                />
                {drawPiloneList()}
                {drawExteriorWall()}
                {drawHorizontalWall()}
                {drawVerticalWall()}

                {drawHoleList()}
            </Svg>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: dimension.width,
        height: dimension.height,
        backgroundColor: "#1110",
    },
    text: {
        color: "#FFF"
    }
});
