import React, {Component} from 'react';
import {Alert} from 'react-native';
import {WebView} from 'react-native-webview';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PushService from './services/PushService';
import appConfig from './app.json';
import {Config} from './config';
import AppNavigation from './components/navigation';
import BackgroundFetch from 'react-native-background-fetch';
import Splash from './components/splash';
import {getNotifs} from './services/bridgesNotifs';

type Props = {};

// this.notif = new PushService(
//   function() {
//     Alert.alert('Registered !', JSON.stringify(this));
//     console.log(this);
//     this.setState({registerToken: this.token, gcmRegistered: true});
//   },
//   function() {
//     console.log(this.notif);
//     Alert.alert(this.notif.title, this.notif.message);
//   },
// );

export default class App extends Component<Props> {
  componentDidMount() {
    // Configure Background service on launch.
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
        // Android options
        stopOnTerminate: false,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
        requiresCharging: false, // Default
        requiresDeviceIdle: false, // Default
        requiresBatteryNotLow: false, // Default
        requiresStorageNotLow: false, // Default
        enableHeadless: true,
      },
      taskId => {
        console.log('[js] Received background-fetch event: ' + taskId);
        // if app is in background getNotifs
        getNotifs('FROM APP.js').catch(error => console.log(error));
        // Required: Signal completion of your task to native code
        // If you fail to do this, the OS can terminate your app
        // or assign battery-blame for consuming too much background-time
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.log('[js] RNBackgroundFetch failed to start');
      },
    );
    // Optional: Query the authorization status.
    BackgroundFetch.status(status => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log('BackgroundFetch restricted');
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log('BackgroundFetch denied');
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log('BackgroundFetch is enabled');
          break;
      }
    });
  }

  webview = null;

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(Config.URI);
    return <AppNavigation />;
  }

  // RICK ROLL
  handleNavChange = newNavState => {
    console.log(newNavState);
    // if (newNavState.url.includes('/auth/setup')) {
    //   console.log('getting App Auth');
    //   this.webview.injectJavaScript(
    //     'window.location = http://0.0.0.0:3000/oauth/authorize?response_type=code&client_id=7iMqLghqWXYxy4utJFkHIn77Yl9AMtSMNKcp_oH60pI&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=read%20write%20follow%20push',
    //   );
    // }
  };
}
