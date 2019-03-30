import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { SplashScreen} from "@ionic-native/splash-screen";
import { StatusBar} from "@ionic-native/status-bar";
import { Geolocation } from '@ionic-native/geolocation';
import { BrowserModule } from '@angular/platform-browser';

import { MapPage } from '../pages/map/map';
import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { PlacesPage } from '../pages/places/places';

import { LocationSelect } from '../pages/location-select/location-select/LocationSelect';
import { Connectivity } from '../providers/connectivity-service';
import { GoogleMaps } from '../providers/google-maps/google-maps';
import { Network } from '@ionic-native/network';
//import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';

import { HttpModule } from '@angular/http';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from './firebase.credentials';
// import { FirebaseService } from './../providers/firebase-service/firebase-service';
import {  ErrorHandler } from '@angular/core';
import {  IonicErrorHandler } from 'ionic-angular';
import { ContentDrawer } from '../components/content-drawer/content-drawer';
import { IonicStorageModule } from '@ionic/storage';
import { IntroPage } from '../pages/intro/intro';


@NgModule({
  declarations: [
    MyApp,
    MapPage,
    TabsNavigationPage,
    PlacesPage,
    ContentDrawer,
    IntroPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot(),
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    TabsNavigationPage,
    PlacesPage,
    ContentDrawer,
    IntroPage
  ],
  exports: [ContentDrawer],
  providers: [
    StatusBar,
    Storage,
    Connectivity,
    GoogleMaps,
    SplashScreen,
    Geolocation,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler }
    // FirebaseService,
  ]
})
export class AppModule {}
