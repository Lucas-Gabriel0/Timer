import React from "react";
import { ScrollView } from "react-native";
import Constants from "expo-constants";

import Cronometro from "./componentes/Cronometro.js";


export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView style={{ marginTop: Constants.statusBarHeight }}>
        <Cronometro></Cronometro>
      </ScrollView>
    );
  }
}
