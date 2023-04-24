import React, { Component, useRef, useState, useEffect, useReducer } from 'react'
import Sound from 'react-sound'
import 'react-circular-progressbar/dist/styles.css'
import styles from './App.module.css'

// import logo from './logo.svg';
import SoundComponent from './playSound'
import {
  StyledProgressBar,
  StyledSlider,
  BackgroundImage,
  StyledIcon,
  StyledCounter,
  StyledDropdown,
} from './components'

import {
  playButton,
  pauseButton,
  rainAudio,
  forestAudio,
  parkAudio,
  streamAudio,
  wavesAudio,
  loudVolumeIcon,
  quietVolumeIcon,
  noVolumeIcon,
  rainImg,
  forestImg,
  parkImg,
  wavesImg,
  streamImg,
  resetButton,
} from './constants'

import {
  createSmartappDebugger,
  createAssistant,
} from "@salutejs/client";

const initAssistant = (getState/*: any*/) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI1MTk1Y2Q2Ny03NmUzLTQ4NTEtOTczMS05N2VjNWJiODRhZjQiLCJzdWIiOiJmZjAwMTgwYWFlMjhmMjRkYzgyMGQ2MTg4MmM5ZjUxNmE5ZmQwMzRiNThiNjIwMmExMzJmNzk0Y2FiMjQ0YTA0ODFiZDAiLCJpc3MiOiJLRVlNQVNURVIiLCJleHAiOjE2ODA1MjQ1NjUsImF1ZCI6IlZQUyIsImlhdCI6MTY4MDQzODE1NSwidHlwZSI6IkJlYXJlciIsInNpZCI6ImFlYzAyNjU0LTFjZGItNGIxNy04ODg2LTVjZmQyZTM2NjVjYyJ9.dbNEq7b5Qn6jVy491c8M0nPyoN9nMITIVpiq7i_pT4dmUbogmjWLHQLHozawFYpdH6S8HEXRJLr0DPRKo-T4PcxFwryDR8TRcO3ulF-6MUEjqkwwZ1yyCufYVi4OTZGqMP1BoLdb4aRbrmZuD_P8REPZaHuIJA3SEXtHEZk_IyfzA-riqaUpb_3woOScBcvCHlmRYZJolYNga8RCGj9wCfKF8Y4cX2ATEbtwGd98_mJog-MrDqzo2HOs92G9SBaIhdZXS7WslPHaexp7fJlEfT5VjbCV10AXEvCj3-DhLi1lrASr-60U7ti5K-w09T3Cieq6patQ60KXv-i59qB6kylCYFov1jQAeMKCnXGo4ZGPJgrSnTPKGGL5SBpxRu6e_qmR-GoSUx_phGUZHrc_9dHWG7lGlYMD7bItW_6t50wMjim1PAQ4Wkll7Z4ZyHgdubqgM0olY6mCJtYuTWiqSXBIe3yItSzDocIZJnt4wrTlVuBtdeOKwqRHqRXnkSInXpXmhLFVlCdgO_L3OOumLKbJpF1xT0IfWL63uOPFXY7G3TL5qVgb-ZIdF4bBO7zvvC_-ttGfHDnS9EqM67QqglQ__6N44sW1WbixVNLCmF8wasYgXR6ZjWsIWKpu4D__yy0jq0Cb5wg9SegzMxP49Z1O6kBRDjjJw-3zmWTBybI",
      initPhrase: `Открой ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};

function App() {
  const soundCompoRef = useRef(null);
  const [pbuttonUrl, setPbuttonUrl] = useState(playButton);
  const [audioStatus, setAudioStatus] = useState(Sound.status.STOPPED);
  const [seekCurrentPosition, setSeekCurrentPosition] = useState(0);
  const [audioUrl, setAudioUrl] = useState(rainAudio);
  const [bgImg, setBgImg] = useState(rainImg);
  const [desiredTime, setDesiredTime] = useState(120);
  const [volume, setVolume] = useState(100);
  const [mute, setMute] = useState(false);
  const [volumeIcon, setVolumeIcon] = useState(loudVolumeIcon);
  const [opacity, setOpacity] = useState(1);
  const [transition, setTransition] = useState('');
  const [center_opacity, setCenterOpacity] = useState(1);
  const [audioHovered, setAudioHovered] = useState(false);
  const [counterHovered, setCounterHovered] = useState(false);
  const [appState, dispatch] = useReducer();

  const assistant = useRef();

  var state = {
    minutes: [],
    };

    const getStateForAssistant = () => {
      console.log("getStateForAssistant: this.state:", state);
      const state_ = {
      item_selector: {
      items: state.minutes.map(({ id, title }, index) => ({
      number: index + 1,
      id,
      title,
      })),
      },
      };
      console.log("getStateForAssistant: state:", state);
      return state_;
    };
  
    useEffect(() => {
      assistant.current = initAssistant(() => getStateForAssistant());
      assistant.current.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
      });
      assistant.current.on("data", (event /*: any*/) => {
        if (event.type == "smart_app_data") {
          console.log(event);
          if (event.sub != undefined) {
            console.log("Sub", event.sub);
            
          } else if (event.user_id != undefined) {
            console.log("UserId", event.user_id);
          }
        }
        console.log(`assistant.on(data)`, event);
        const { action } = event;

        dispatchAssistantAction(action);
        
  });
    },
    [appState]);

  
    const dispatchAssistantAction = async (action) => {
      console.log("dispatchAssistantAction", action);
      if (action) {
        console.log(action.minutes);
        switch (action.type) {
          case "timerUp":
            console.log("timerUp")
            playPause();
            break;
          case "timerDown":
            console.log("timerDown")
            setPbuttonUrl(playButton);
            setAudioStatus(Sound.status.PAUSED);
            break;
          case "resetTimer":
            console.log("resetTimer")
            reset();
            break;
          case "streamSound":
            console.log("streamSound")
            setAudioUrl(streamAudio);
            setBgImg(streamImg);
            break;
          case "rainSound":
            console.log("streamSound")
            setAudioUrl(rainAudio);
            setBgImg(rainImg);
            break;
          case "forestSound":
            console.log("forestSound")
            setAudioUrl(forestAudio);
            setBgImg(forestImg);
            break;
          case "parkSound":
            console.log("parkSound")
            setAudioUrl(parkAudio);
            setBgImg(parkImg);
            break;
          case "wavesSound":
            console.log("wavesSound")
            setAudioUrl(wavesAudio);
            setBgImg(wavesImg);
            break;
          default:
            break;
          }
        }
      };

  const audioNames = ['дождь', 'лес', 'парк', 'ручей', 'волны'];

  const timeSelect = (x) => {
    setDesiredTime(x.duration);
  };

  const playPause = () => {
    if ([Sound.status.STOPPED, Sound.status.PAUSED].includes(audioStatus)) {
      setPbuttonUrl(pauseButton);
      setAudioStatus(Sound.status.PLAYING);
    } else if (audioStatus === Sound.status.PLAYING) {
      setPbuttonUrl(playButton);
      setAudioStatus(Sound.status.PAUSED);
    }

    if (pbuttonUrl === playButton) {
      setOpacity(0);
      setCenterOpacity(0.6);
      setTransition('opacity 10s ease-out');
    } else {
      setOpacity(1);
      setCenterOpacity(1);
      setTransition('opacity 0s');
    }
  };

  const reset = () => {
    soundCompoRef.current && soundCompoRef.current.reset();

    setSeekCurrentPosition(0);
    setPbuttonUrl(playButton);
    setAudioStatus(Sound.status.STOPPED);
  };

  const _onMouseMove = (e) => {
    setOpacity(1);
    setTransition('opacity 0s');
    setCenterOpacity(1);
    setTimeout(() => {
      if (seekCurrentPosition < 100 && pbuttonUrl === pauseButton) {
        setOpacity(0);
        setTransition('opacity 10s ease-out');
        setCenterOpacity(0.6);
      }
    }, 3000);
  };

  const audioSelect = (audioName) => {
    switch (audioName) {
      case audioNames[1]:
        setAudioUrl(forestAudio);
        setBgImg(forestImg);
        break;

      case audioNames[2]:
        setAudioUrl(parkAudio);
        setBgImg(parkImg);
        break;

      case audioNames[3]:
        setAudioUrl(streamAudio);
        setBgImg(streamImg);
        break;

      case audioNames[4]:
        setAudioUrl(wavesAudio);
        setBgImg(wavesImg);
        break;

      default:
        setAudioUrl(rainAudio);
        setBgImg(rainImg);
        break;
    }
  };

  const moveSeek = (pos) => {
    setSeekCurrentPosition((pos / desiredTime) * 100);

    if (Math.floor(pos) === desiredTime) {
      setPbuttonUrl(playButton);
      setAudioStatus(Sound.status.STOPPED);
    }
  };

  const handleAudioHover = () => {
    setAudioHovered(!audioHovered);
  };

  const handleCounterHover = () => {
    setCounterHovered(!counterHovered);
  };

  const volumeChange = (event) => {
    const value = Number(event.target.value);
    setVolume(mute ? volume : value);
    setVolumeIcon(
      mute || value === 0
        ? noVolumeIcon
        : value <= 50
        ? quietVolumeIcon
        : loudVolumeIcon
    );
  };

  const toggleMute = () => {
    setVolumeIcon(
      !mute
        ? noVolumeIcon
        : volume <= 50
        ? quietVolumeIcon
        : loudVolumeIcon
    );
    setMute(!mute);
  };

  const fadeTransition = {
    opacity,
    transition,
  };

  const partialFadeTransition = {
    opacity: center_opacity,
    transition,
  };

  const activeAudio = audioUrl.replace('audio/', '').replace('.mp3', '').toLowerCase();

  const isStopped = ![Sound.status.PLAYING, Sound.status.PAUSED].includes(audioStatus);

  return (
    <div className={styles.App} onMouseMove={_onMouseMove}>
      <div className={styles['bg-overlay']}></div>
      <BackgroundImage currentImage={bgImg} />
      <main className={styles.main}>
        <div className={styles['player-options']}>
          <StyledCounter
            min={1}
            max={120}
            setDuration={(duration) => {
              timeSelect({ duration: duration * 60 });
            }}
            duration={desiredTime / 60}
            style={!counterHovered ? fadeTransition : null}
            onMouseEnter={handleCounterHover.bind(this)}
            onMouseLeave={handleCounterHover.bind(this)}
          />
          <StyledDropdown
            options={audioNames}
            style={!audioHovered ? fadeTransition : null}
            activeOption={activeAudio}
            changeOption={(audioName) => {
              audioSelect(audioName);
            }}
            onMouseEnter={handleAudioHover.bind(this)}
            onMouseLeave={handleAudioHover.bind(this)}
          />
        </div>
        <div className={styles.middleWrap}>
          <div className={styles.audioSeek} style={partialFadeTransition}>
            <StyledProgressBar id="seek" percentage={seekCurrentPosition} />
            <div
              style={partialFadeTransition}
              className={
                pbuttonUrl === playButton
                  ? `${styles.playPauseBtn} ${styles.pauseMode}`
                  : `${styles.playPauseBtn} ${styles.playMode}`
              }
              alt="Play"
              onClick={playPause.bind(this)}
            >
              <img className={styles.pauseIcon} src={pauseButton} alt="" />
              <img className={styles.playIcon} src={playButton} alt="" />
            </div>
          </div>
          <div className={styles.timerWrap}>
            <StyledIcon
              className={styles.resetIcon}
              src={resetButton}
              alt="reset"
              style={{
                ...partialFadeTransition,
                opacity: isStopped ? 0.4 : center_opacity,
                transform: isStopped && "none",
                pointerEvents: isStopped && "none",
              }}
              handleOnClick={reset.bind(this)}
            />
            <div className={styles.timer} style={partialFadeTransition}>
              <span id="timer-min" className={styles.min}>
                00
              </span>
              <span> : </span>
              <span id="timer-sec" className={styles.sec}>
                00
              </span>
            </div>
          </div>
        </div>
        <div className={styles['volume-control']} style={fadeTransition}>
          <StyledIcon
            className={styles['volume-icon']}
            src={volumeIcon}
            handleOnClick={toggleMute.bind(this)}
            style={fadeTransition}
          />
          &nbsp;
          <div className={styles['volume-slider']} style={fadeTransition}>
            <StyledSlider
              id="slider"
              onChange={volumeChange}
              step={1}
              min={0}
              max={100}
              value={mute ? 0 : volume}
            />
          </div>
        </div>
        <SoundComponent
          ref={soundCompoRef}
          playStatus={audioStatus}
          url={audioUrl}
          funcPerc={moveSeek.bind(this)}
          desiredT={desiredTime}
          volume={mute ? 0 : volume}
        />
      </main>
    </div>
  );
}

export default App;

