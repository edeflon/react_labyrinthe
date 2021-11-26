import React, {Component} from "react";
import {Router, Scene, Stack} from 'react-native-router-flux';

import Home from "./screens/Home";
import Lobby from "./screens/Lobby";
import ViewControl from "./screens/ViewControl";
import ViewDraw from "./screens/ViewDraw";

import levels from "./assets/levels/levels.json";

/* TODO : Correct Deprecations :
1 - Deprecation in 'navigationOptions':
- 'header: null' will be removed in a future version. Use 'headerShown: false' instead
2 - Deprecation in 'createStackNavigator':
'transitionConfig' is removed in favor of the new animation APIs
* */

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

// onPlayerChoice() {
//     return new Promise((resolve) => {
//         Alert.alert("Attention !", "Voulez-vous vraiment quitter la partie ?", [
//                 {
//                     text: "Annuler",
//                     onPress: () => {resolve("NO")},
//                     style: "cancel"
//                 },
//                 {
//                     text: "OUI",
//                     onPress: () => {resolve("YES")}
//                 }],
//             {cancelable: false});
//     })
// }

// async onBackPress() {
//     if (Actions.currentScene == "ViewDraw" || Actions.currentScene == "ViewControl") {
//         const choice = await this.onPlayerChoice();
//         if (choice == "NO") {
//             Actions.refresh();
//         } else {
//             Actions.replace("Home");
//         }
//     }
//     return true;
// }
