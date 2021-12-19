import React, {Component} from "react";
import {Router, Scene, Stack} from 'react-native-router-flux';

import Home from "./screens/Home";
import Lobby from "./screens/Lobby";
import ViewControl from "./screens/ViewControl";
import ViewDraw from "./screens/ViewDraw";

// LABYRINVISIBLE - CLasse qui lance l'application
export default class App extends Component {
    render() {
        return (
            <Router>
                <Stack key="root" hideNavBar={true}>
                    <Scene key="Home" component={Home} initial={true}/>
                    <Scene key="Lobby" component={Lobby}/>
                    <Scene key="ViewControl" component={ViewControl}/>
                    <Scene key="ViewDraw" component={ViewDraw}/>
                </Stack>
            </Router>
        );
    }
}
