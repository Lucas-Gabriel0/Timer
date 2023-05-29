import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default class Cronometro extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { 
        
        minutos:0,
        segundos: 0,
        milessegundos:0,        
        running: false,
    };
  }
    startTime(){
      if(!this.state.running){
        this.intervalId = setInterval(() => {
          this.setState ((prevState) => {
            milessegundos: prevState.milessegundos += 1;
            
            let { minutos, segundos, milessegundos} = prevState;

            
            if (milessegundos >=100){
              milessegundos = 0;
              segundos +=1;
              
            }
            if (segundos >= 60){
              segundos = 0;
              minutos +=1
            }
            return{
              milessegundos,
              segundos,
              minutos,
            };
          })
        },1); 
        this.setState ({running: true});
      }
    }
     
    pauseTime(){
      if(this.state.running){
        clearInterval (this.intervalId)
        this.setState({running: false});
      }
    }

    resetTime(){
      clearInterval (this.intervalId);
       this.setState({
        milessegundos: 0,
        segundos: 0,
        minutos: 0,
        running: false
       });     
    }
  
  render() {

    const {milessegundos,segundos,minutos} = this.state;

    return (

      
        <View style={styles.ViewConteiner}>
          
          <Text style={styles.Cronometro}>{minutos.toString().padStart(2, '0')}:

          {segundos.toString().padStart(2,"0")}:

          {milessegundos.toString().padStart(2,"0")} 
          </Text>

          
          <View style={styles.buttonContainer}>
            
            <View style = {styles.button}>
              <Button style={styles.botao1} title = {this.state.running ? "Pausar" : "Iniciar"}
              onPress={this.state.running ? this.pauseTime.bind(this) : this.startTime.bind(this)}></Button>
            </View>

            <View style = {styles.button}>
              <Button style={styles.botao2} title = "Limpar" onPress={this.resetTime.bind(this)} ></Button>
            </View>

          </View>
          
        </View>
      

    );
  }
}
const styles = StyleSheet.create({

  //coloque HORA amanhã! Faz o temporizador.

  

  ViewConteiner:{  
    flex:1,
    justifyContent:"center",
    alignItems:"center",  
    marginTop:"50%",
  },

  Cronometro:{
    fontSize:60,
  },

  buttonContainer:{
    flexDirection:"row",
    justifyContent:"center",
    paddingHorizontal:10,
  },

  button: {
    paddingHorizontal: 10,  
  },
});
 