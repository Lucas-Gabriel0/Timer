import React, { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,

} from "react-native";

export default function App() {
  // State variables to keep track of times (Hours, minutes, seconds) and timer status
  const [Hours, setHours] = useState(0);
  const [Minutes, setMinutes] = useState(0);
  const [Seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // State variables for managing UI elements
  const [showMarker, setShowMarker] = useState(false);
  const [showStop, setShowStop] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const [showClean, setShowClean] = useState(false);

  // State variables to store time markers and manage animations
  const [TimeMarkers, setTimeMarkers] = useState([]); 
  const [previousMarker, setPreviousMarker] = useState(null); 
  const [isTimerAnimated, setIsTimerAnimated] = useState(false);
  
  // Animation-related state variables
  const [textPosition] = useState(new Animated.Value(0)); 
  const [timerStyle, setTimerStyle] = useState(new Animated.Value(70));

  // Interval ID for managing the timer
  let intervalId;

  useEffect(() => {
    // Use useEffect to manage the timer logic on the "isRunning" state

    if (isRunning) {
      intervalId = setInterval(() => {
        // Logic to update hours, minutes, and seconds

        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => {
              if (prevMinutes === 59) {
                setHours((prevHours) => prevHours + 1);
                return 0;
              } else {
                return prevMinutes + 1;
              }
            });
            return 0;
          } else {
            return prevSeconds + 1;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId); 
  }, [isRunning]);
  
  // Function to format time variables
  const formatedHours = Hours.toString().padStart(2, "0");
  const formatedMinutes = Minutes.toString().padStart(2, "0");
  const formatedSeconds = Seconds.toString().padStart(2, "0");

  // Function to format time variables
  const calculateDifferenceTime = () => {
    if (previousMarker) {
      const currentMarker = new Date(
        0,
        0,
        0,
        Hours,
        Minutes,
        Seconds
      );
      const previousMarkerDate = new Date(
        0,
        0,
        0,
        previousMarker.Hours,
        previousMarker.Minutes,
        previousMarker.Seconds
      );
      const difference = currentMarker.getTime() - previousMarkerDate.getTime();
      const horaDifference = Math.floor(difference / 3600000);
      const MinutesDifference = Math.floor((difference % 3600000) / 60000);
      const SecondsDifference = Math.floor((difference % 60000) / 1000);
      return `${horaDifference.toString().padStart(2, '0')}:${MinutesDifference.toString().padStart(2, '0')}:${SecondsDifference.toString().padStart(2, '0')}`;
    }
    return '00:00:00';
  }

  // Function to handle adding a time marker
  const Marker = () => {
    if (isRunning) {
      const currentTime = new Date().getTime();
      let difference = '00:00:00';
      if (previousMarker) {
        difference = calculateDifferenceTime();
      }
      const NewMarker = {
        id: TimeMarkers.length + 1,
        Hours,
        Minutes,
        Seconds,
        tempo: `${formatedHours}:${formatedMinutes}:${formatedSeconds}`,
        difference,
        timestamp: currentTime,       
      }
      setTimerStyle(50);
      setTimeMarkers([...TimeMarkers, NewMarker]);
      setPreviousMarker(NewMarker);   
      Animated.parallel([
        Animated.timing(textPosition,{
          toValue:1,
          duration:250,
          useNativeDriver:false,
        }),
      ]).start(()=>{
        setIsTimerAnimated(true);     
        })
    }
  }

  // Function to start the timer
  const start = () => {
    setIsRunning(true);
    setShowStart(false)
    setShowStop(true)
    setShowMarker(true)
    setShowClean(false)
  }

  // Function to stop the timer
  const stop = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setShowStop(false)
    setShowClean(true)
    setShowMarker(false)
    setShowStart(true)
  }

  // Function to reset the timer and clear marker
  const clean = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTimeMarkers([]);
    setShowStart(true);
    setShowClean(false);

    // Reset animation-related state variables
    Animated.timing(textPosition,{
      toValue:0, 
      duration: 0, 
      useNativeDriver:false,
    }).start(() => setIsTimerAnimated(false), setTimerStyle(70));
  }

  return (
    <SafeAreaView style={style.containerStyle}>
      <View>

        {/* Animate the timer text*/}
        <Animated.Text style={[style.timerTextStyle,{
            marginTop: textPosition.interpolate({inputRange:[0,1], outputRange:["70%", "-20%"],
            }),
            fontSize: timerStyle, 
            }]}>
            {formatedHours}:{formatedMinutes}:{formatedSeconds}
        </Animated.Text>
      </View>

      <ScrollView
        style={style.scrollViewStyle}>

        {/* Display time markers in a scrollable view*/}
        {TimeMarkers.map((marca) => (
          <View key={marca.id} style={style.markerStyle}>

            <View style={style.markerItem}>
              <Text style={[style.markerStyleText, { textAlign:'left'}]}>{marca.id.toString().padStart(2, '0')}</Text>
            </View>
            
            <View style={style.markerItem}>
              <Text style={style.markerStyleText}>+{marca.tempo}</Text>
            </View>

            <View style={style.markerItem}>
              <Text style={[style.markerStyleText, {
                textAlign:'right'
              }]} >{marca.difference}</Text>
            </View>
            
          </View>
        ))}
      </ScrollView>

      <View style={style.buttonsContainerStyle}>
        {/* Conditionally display control buttons based on timer status*/}
        {showClean &&
          <TouchableOpacity 
          style={style.show_Button_Style}
            onPress={clean}>
            <View style={style.buttonStyle}>
              <Icon name="stop" size={30} color="rgb(25, 165, 252)" />
            </View>
          </TouchableOpacity>}
    
        {showStart &&
          <TouchableOpacity
            style={[style.show_Button_Style, !showClean && {
            marginLeft: 'auto',
            marginRight: 'auto',
            }]}
            onPress={start}
            >
            {/* Display a "Start" button*/}
            <View style={style.buttonStyle}>
              <Icon name="play" size={30} color="rgb(15, 163, 255)"/>
            </View>
          </TouchableOpacity>}

        {showMarker &&
          <TouchableOpacity 
            style={style.show_Button_Style}
            onPress={Marker}>
            <View style={style.buttonStyle}> 
              <Icon name="flag" size={30} color="rgb(25, 165, 252)" />
            </View>
          </TouchableOpacity>}

        {showStop &&
          <TouchableOpacity 
            style={style.show_Button_Style}
            onPress={stop}>
            {/* Display a "Stop" button*/}
            <View style={style.buttonStyle}>
              <Icon name="pause" size={30} color="rgb(25, 165, 252)" />
            </View>
          </TouchableOpacity>}
      </View>

    </SafeAreaView>
  );
}

const style = StyleSheet.create({

  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2eded',
  },

  buttonsContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '10%',
    justifyContent: 'space-between',
    width: '60%',
    position: 'absolute',
    bottom: '5%',
  },

  scrollViewStyle: {
    maxHeight: '48%',
    width: '100%',
  },

  markerItem:{
    flex: 1,
    padding: '1%',
  },

  markerStyleText: {
    fontSize:18,
    textAlign:'center',
    width:'100%',

  },

  markerStyle: {
    flexDirection: 'row',
    alignItems:'center',
    padding: '1%',
    marginVertical: '2%',
    marginRight: 'auto',
    marginLeft: 'auto',
    width: '80%',  
  },

  timerTextStyle: {
    marginTop: '5%',
    fontSize: 70,
    textAlign: 'center',
  },

  buttonStyle: {
    marginBottom: '50%',
    width: 60,
    height: 60,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 3,
  },
  
});
