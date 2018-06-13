import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Image, View, TouchableOpacity, Animated } from 'react-native';
import Video from "react-native-video";
import recording from "./audio/you_are_dying.mp3";

class FadeInView extends Component{
	state = {
		fadeAnim: new Animated.Value(0), //Initial value for opacity: 0
	}

	//throbbing animation when FadeInView component is rendered
	componentDidMount(){
    var animation = Animated.sequence([
        Animated.timing(
          this.state.fadeAnim,
          {
            toValue: 1,
            duration: 1000,
          }
        ),
        Animated.timing(
          this.state.fadeAnim,
          {
            toValue: 0,
            duration: 1000,
          }
        ),
      ]
    )

    Animated.loop(animation).start();
	}

	render(){
	let { fadeAnim } = this.state;
		return(
			<Animated.View style={{opacity: fadeAnim, width: 300, height: 300, marginTop: '20%',
    			position: 'absolute',}}>
				{this.props.children}
			</Animated.View>
		);
	}
}

export default class DyingApp extends Component {

  	constructor(props){
  		super(props);
  		this.state = {
  			showGlow: false,
        	needToPlay: false,
  		};
  	}

  	//called when play button is pressed
  	playAnimation() {
  		this.setState({
  			showGlow: true,
        	needToPlay: true,
  		});

      // Toggle the state every half a minute ie. plays recording every minute!
      timer = setInterval(() => {
        this.setState(previousState => {
          return { needToPlay: !previousState.needToPlay };
        });
      }, 30000);
  	}

  	//called when stop button is pressed
    stopAnimation() {
      this.setState({
        showGlow: false,
        needToPlay: false,
      });

      clearInterval(timer);
    }

  	//returns FadeInView component to show throbbing animation if showGlow state is true
  	renderGlow(){
  		if(this.state.showGlow){
  			return (
  				<FadeInView style={styles.glowingCircle}>
          			<Image source={require('./img/dying_glow.png')} style={styles.glowingCircle}/>
          		</FadeInView>
  			);
  		}
  		else{
  			return null;
  		}
  	}

    playRecording(){
      if(this.state.showGlow && this.state.needToPlay){
        return(
          <Video source={recording}
             ref={(ref) => {
               this.player = ref
             }}                                      // Store reference
             playInBackground={true}           // Audio continues to play when app entering background. Default false
             playWhenInactive={true}           // [iOS] Video continues to play when control or notification center are shown. Default false
          />
        );
      }
      else{
        return null;
      }
    }

  	render(){
    return (
      <View style={{flex: 1,}}>
        <View style={styles.blackBack}>
          <View style={styles.glowingCircle}>
          	<Image source={require('./img/dying_glowing_circle.png')} style={styles.glowingCircle}/>
          </View>
          {this.renderGlow()}
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={styles.playBack}>
            <TouchableOpacity onPress={() => this.playAnimation()}>
              <Image source={require('./img/dying_play_button.png')} style={styles.playButton}/>
            </TouchableOpacity>
          </View>
          <View style={styles.stopBack}>
            <TouchableOpacity onPress={() => this.stopAnimation()}>
              <Image source={require('./img/dying_pause_button.png')} style={styles.stopButton}/>
            </TouchableOpacity>
          </View>
          {this.playRecording()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  blackBack: {
    flex: 3,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowingCircle: {
    width: 300,
    height: 300,
    marginTop: '20%',
    position: 'absolute',
  },
  playBack: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  playButton:{
    width: 50,
    height: 50,
    marginLeft: '45%',
    marginBottom: '35%',
  },
  stopBack: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  stopButton:{
    width: 50,
    height: 50,
    margin: '30%',
  },
});