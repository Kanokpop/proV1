import { Component, NgZone, Testability, ComponentFactoryResolver } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LoadingController, Item, Chip, Content } from 'ionic-angular';
//import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { database } from 'firebase';
import { NavController } from 'ionic-angular';
import { ContentDrawer } from '../../components/content-drawer/content-drawer';
import { map } from 'rxjs-compat/operator/map';
import { google } from "google-maps";
import { Storage } from '@ionic/storage';
import { IntroPage } from '../intro/intro';
import { async } from 'rxjs/internal/scheduler/async';
import { concat } from 'rxjs';




declare var google;



@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  tabBarElement: any;
  splash = true;
  map: any;
  markers: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  loading: any;
  Destination: any = '';
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  site = {
    Lat: '13.7501304',
    Lng: '100.5213145'
  };
  item: any;
  drawerOptions: any;
  public Pop: any;
  public kartoon: any;
  start: any; end: any;
  stationstart = [];
  stationend = [];
  startgate: any;
  starthtml: any;
  connectgate: any;
  endgate: any;
  startgatehtml: any;
  endgatehtml: any;
  routing: any;
  startstation: any;
  connectstation: any;
  connectstationhtml: any;
  endstation: any;
  nextstation: any;
  previousstation: any;
  nextstationhtml: any;
  n: any;
  p: any;
  Pink: any;
  Green: any;
  service = new google.maps.DistanceMatrixService;
  stst: any;
  line0 = [];
  dist: any;
  candid = [];
  candidate = [];
  stationconnect = [];
  flightPath: any
  i = 0;
  buffline2 = []
  buffline3 = []
  // endgate: { lat: any; lng: any; gate: any; };
  // stLatLng: string;


  constructor(
    public navCtrl: NavController,
    public zone: NgZone,
    public geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public db: AngularFireDatabase,
    public storage: Storage
  ) {
    // test push data
    //  this.db.list('site').push(this.site);
    //  this.db.list('site').valueChanges().subscribe(
    //    data =>{
    //      console.log(data)
    //      this.Pop = data;
    //    }
    //  ) ;
    // endtest

    this.tabBarElement = document.querySelector('.tabbar');
    this.drawerOptions = {
      handleHeight: 70,
      thresholdFromBottom: 100,
      thresholdFromTop: 100,
      bounceBack: true
    };

    this.service = new google.maps.DistanceMatrixService();
    this.geocoder = new google.maps.Geocoder();
    let elem = document.createElement("div")
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = {
      input: ''
    }
    this.autocompleteItems = [];
    this.markers = [];
    this.loading = this.loadingCtrl.create();
    // this.kartoon = this.startgate;
    // this.startgate = [];
  }
  ionViewDidLoad() {
    // console.log('l')
    this.getDataFromFirebase().then(data => {
      this.Pop = data as any;
      console.log(this.Pop)
    }).then(() => {
      this.getPosition()
    }).catch((err) => {
      console.log(err)
    });
    //  this.storage.get('intro-done').then(done => {
    //    if (done) {
    //      this.storage.set('intro-done', false);
    //      this.navCtrl.setRoot(IntroPage);
    //    }
    //  });
  }
  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
    setTimeout(() => {
      this.splash = false;
      this.tabBarElement.style.display = 'flex';
    }, 4000);
  }
  ionViewDidEnter() {
    //  console.log(this.Pop)
    //  this.storage.set('intro-done', true);
  }
  getDataFromFirebase() {
    return new Promise((resolve, reject) => {
      this.db.list('/Station/').valueChanges()
        .subscribe(
          data => {
            this.Pop = data;
            resolve(this.Pop)
          },
        );
    });
  }
  getPosition(): any {
    this.geolocation.getCurrentPosition().then(response => {
      this.calDis(response);
    }).then(response => {

    })
      .catch(error => {
        console.log(error);
      })
  }


  // Calculate Distance
  calculateDistance = ((lat1: number, lat2: number, long1: number, long2: number) => {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return dis;
  })
  calDis = ((position: Geoposition) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let myLatLng = { lat: latitude, lng: longitude };
    // this.start = myLatLng;

    this.start = { lat: 13.8211931197085, lng: 100.51081791970853 };
    for (let index in this.Pop) {
      for (let index1 in this.Pop[index]) {
        this.candid[index1] = this.calculateDistance(this.start.lat, this.Pop[index][index1].lat, this.start.lng, this.Pop[index][index1].lng)
      }
    }
    let compare
    let compare1
    let countcompare = 0
    for (let index in this.candid) {
      countcompare = 0
      compare = this.candid[index]
      for (let index1 in this.candid) {
        if (compare < this.candid[index1]) {
          countcompare++
        }
        if (countcompare > 206) {
          if (Number(index) < 1000) {
            this.candidate[index] = this.Pop[0][index]
            this.startstation = this.Pop[0][index]
            this.startstation.index = index
          }
          else if (Number(index) < 2000) {
            this.candidate[index] = this.Pop[1][index]
            this.startstation = this.Pop[1][index]
            this.startstation.index = index
          }
          else if (Number(index) < 3000) {
            this.candidate[index] = this.Pop[2][index]
            this.startstation = this.Pop[2][index]
            this.startstation.index = index
          }
          else if (Number(index) < 4000) {
            this.candidate[index] = this.Pop[3][index]
            this.startstation = this.Pop[3][index]
            this.startstation.index = index
          }
          else if (Number(index) < 5000) {
            this.candidate[index] = this.Pop[4][index]
            this.startstation = this.Pop[4][index]
            this.startstation.index = index
          }
          else if (Number(index) < 6000) {
            this.candidate[index] = this.Pop[5][index]
            this.startstation = this.Pop[5][index]
            this.startstation.index = index
          }
          else if (Number(index) < 7000) {
            this.candidate[index] = this.Pop[6][index]
            this.startstation = this.Pop[6][index]
            this.startstation.index = index
          }
          else if (Number(index) < 8000) {
            this.candidate[index] = this.Pop[7][index]
            this.startstation = this.Pop[7][index]
            this.startstation.index = index
          }
          else if (Number(index) < 9000) {
            this.candidate[index] = this.Pop[8][index]
            this.startstation = this.Pop[8][index]
            this.startstation.index = index
          }
          else if (Number(index) < 10000) {
            this.candidate[index] = this.Pop[9][index]
            this.startstation = this.Pop[9][index]
            this.startstation.index = index
          }
          else {
            this.candidate[index] = this.Pop[10][index]
            this.startstation = this.Pop[10][index]
            this.startstation.index = index
          }
        }
      }
    }
    this.starthtml = this.startstation['name']
    console.log(this.starthtml)
    this.loadMap()
  })
  loadMap = async () => {
    //console.log('3')

    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map');


    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.start,
      zoom: 12
    });
    google.maps.event.addListenerOnce(this.map, 'idle', () => {


      let marker1 = new google.maps.Marker({
        position: this.start,
        map: this.map,
        title: 'AQUI ESTOY!'
      });

      let compare = [];
      let compare1 = [];

      var a = [];
      for (let index in this.Pop) {
        for (let index1 in this.Pop[index]) {
          if (this.Pop[index][index1].connect !== undefined) {
            this.stationconnect[index1] = this.Pop[index][index1]
          }
        }
      }
      mapEle.classList.add('show-map');
      return this.Pop
    })
  }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if (predictions) {
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      });
  }



  selectSearchResult(item): any {
    this.clearMarkers();
    if (this.i !== 0) {
      this.flightPath.setMap(null);
    }
    this.i++
    this.autocompleteItems = [];
    this.stationstart = this.startstation

    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let marker = new google.maps.Marker({
          position: { lat: results[0].geometry.viewport.na.j, lng: results[0].geometry.viewport.ia.j },
          map: this.map
        });
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
        this.end = { lat: results[0].geometry.viewport.na.j, lng: results[0].geometry.viewport.ia.j };
        let compare = [];
        let compare1 = [];
        for (let index in this.Pop) {
          for (let index1 in this.Pop[index]) {
            compare[index1] = this.calculateDistance(this.end.lat, this.Pop[index][index1].lat, this.end.lng, this.Pop[index][index1].lng)
          }
        }
        for (let index in this.Pop) {

          for (let index1 in this.Pop[index]) {
            let compo = compare[index1];
            let countconpare = 0;
            for (let index2 in this.Pop[index]) {
              if (compo < compare[index2]) {
                countconpare++;
              }
              var keys = Object.keys(this.Pop[index]);
              if (countconpare == ((keys.length - 1))) {
                this.stationend[index] = { lat: this.Pop[index][index1].lat, lng: this.Pop[index][index1].lng, name: this.Pop[index][index1].name, line: this.Pop[index][index1].line, index: index1 };
              }
            }
          }
        }
        let pare_en = []
        let countpare_en = 0;
        for (let i_en in this.stationend) {
          pare_en[i_en] = this.calculateDistance(this.end.lat, this.stationend[i_en].lat, this.end.lng, this.stationend[i_en].lng)
        }
        for (let i_en in this.stationend) {
          countpare_en = 0;
          let pare = pare_en[i_en]
          for (let i_en1 in this.stationend) {
            if (pare <= pare_en[i_en1]) {
              countpare_en++;
            }
            if (countpare_en == (this.stationend.length)) {
              this.endstation = { lat: this.stationend[i_en].lat, lng: this.stationend[i_en].lng, name: this.stationend[i_en].name, line: this.stationend[i_en].line, index: this.stationend[i_en].index };
            }
          }
        }
        console.log(this.stationstart)
        console.log(this.endstation)
        let connectst = []
        console.log(this.stationstart['line'])
        let stline = this.stationstart['line']
        let dist = []
        let nextst = []
        let point = 0;
        let indexnextst = [];
        console.log(stline)
        if (!((stline !== this.endstation.line) && (stline[0] !== this.endstation.line))) {
          // nextst = this.stationstart
          // nextst[0] = this.stationstart
        }
        while ((stline !== this.endstation.line) && (stline[0] !== this.endstation.line)) {
          dist = []
          if (point == 5) {
            return 0
          }
          connectst = []
          for (let index in this.stationconnect) {
            if (stline[1].length > 1) {
              if ((this.stationconnect[index].line == stline[0]) || (this.stationconnect[index].line == stline[1])) {
                connectst[index] = this.stationconnect[index]
              }
            }
            else if (this.stationconnect[index].line == stline) {
              connectst[index] = this.stationconnect[index]
            }
          }
          for (let index in connectst) {
            if (connectst[index]['connect'].line.length > 1) {
              for (let ind in connectst[index]['connect'].line) {
                if (connectst[index]['connect'].line[ind] == this.endstation.line) {
                  if (nextst[point] !== undefined || '') {
                    let pareinconn
                    pareinconn = this.calculateDistance(connectst[index].lat, this.endstation.lat, connectst[index].lng, this.endstation.lng)
                    if (pareinconn < this.calculateDistance(nextst[point].lat, this.endstation.lat, nextst[point].lng, this.endstation.lng)) {
                      stline = connectst[index]['connect'].line[ind]
                      nextst[point] = connectst[index]
                      indexnextst[point] = index
                      console.log(index)
                    }
                  } else {
                    stline = connectst[index]['connect'].line[ind]
                    nextst[point] = connectst[index]
                    indexnextst[point] = index
                    console.log(index)
                  }
                }
                else {
                  console.log(nextst)
                  if (nextst[point - 1] !== undefined || '') {
                    if (nextst[point - 1]['connect']['connectTo'][0] !== index) {
                      dist[index] = this.calculateDistance(connectst[index].lat, this.endstation.lat, connectst[index].lng, this.endstation.lng)
                    }
                  }
                }
              }
            } else {
              if (connectst[index]['connect'].line == this.endstation.line) {
                if (nextst[point] !== undefined || '') {
                  let pareinconn
                  pareinconn = this.calculateDistance(connectst[index].lat, this.endstation.lat, connectst[index].lng, this.endstation.lng)
                  if (pareinconn < this.calculateDistance(nextst[point].lat, this.endstation.lat, nextst[point].lng, this.endstation.lng)) {
                    stline = connectst[index]['connect'].line[0]
                    nextst[point] = connectst[index]
                    indexnextst[point] = index
                    console.log(nextst[point])
                    console.log(stline)
                    console.log(indexnextst)
                  }
                } else {
                  stline = connectst[index]['connect'].line
                  nextst[point] = connectst[index]
                  indexnextst[point] = index
                  console.log(nextst[point])
                  console.log(stline)
                }
              } else {
                if (point !== 0) {
                  if (nextst[point - 1]['connect']['connectTo'][0] !== index) {
                    dist[index] = this.calculateDistance(connectst[index].lat, this.endstation.lat, connectst[index].lng, this.endstation.lng)
                  }
                } else {
                  dist[index] = this.calculateDistance(connectst[index].lat, this.endstation.lat, connectst[index].lng, this.endstation.lng)
                }
              }
            }

          }
          let sizedist = 0
          for (let i in dist) {
            sizedist++
          }
          let countcompare = 0;
          if (nextst[point] == undefined || '') {
            for (let index in dist) {
              let countcompare = 0;
              let compare = dist[index]
              for (let index1 in dist) {
                if (compare < dist[index1]) {
                  countcompare++
                }
                if (countcompare == sizedist - 1) {
                  nextst[point] = connectst[index]
                  indexnextst[point] = index
                  console.log(index)
                  stline = connectst[index]['connect'].line
                }
              }
            }
          }
          if (stline.length == 1) {
            stline = stline[0]
          }
          console.log(stline)
          point++
        }
        console.log(dist)
        console.error(nextst)
        console.error(stline)
        console.log(indexnextst)
        this.nextstation = nextst['0']['name']
        var flightPlanCoordinates = [];

        if (indexnextst[2] !== undefined) {

          if (this.endstation.index.length == 4) {
            if (this.endstation.index[0] == nextst[2]['connect']['connectTo'][0][0]) {
              if (parseInt(nextst[2]['connect']['connectTo'][0]) - parseInt(this.endstation.index) > 0) {
                let a = 0;
                let buff = []
                let i_buff = 0
                for (let index in this.Pop[nextst[2]['connect']['connectTo'][0][0]]) {
                  if (index == this.endstation.index) {
                    a = 1;
                  }
                  // console.log(index)
                  if (a == 1) {
                    buff.unshift({ lat: this.Pop[nextst[2]['connect']['connectTo'][0][0]][index].lat, lng: this.Pop[nextst[2]['connect']['connectTo'][0][0]][index].lng })
                    i_buff++
                    console.log(this.Pop[nextst[2]['connect']['connectTo'][0][0]][index])
                  }
                  if (index == nextst[2]['connect']['connectTo'][0]) {
                    a = 0;
                  }
                }
                for (let index = 0; index < i_buff; index++) {
                  flightPlanCoordinates.push(buff[index])
                }
              } else {
                let a = 0;
                for (let index in this.Pop[nextst[2]['connect']['connectTo'][0][0]]) {
                  if (a == 1) {
                    flightPlanCoordinates.push({ lat: this.Pop[nextst[2]['connect']['connectTo'][0][0]][index].lat, lng: this.Pop[nextst[1]['connect']['connectTo'][0][0]][index].lng })
                  }
                  if (index == nextst[2]['connect']['connectTo'][0]) {
                    a = 1;
                  }
                  if (index == this.endstation.index) {
                    a = 0;
                  }
                }
              }
            } else if (this.endstation.index[0] == nextst[2]['connect']['connectTo'][1][0]) {
              if (parseInt(nextst[2]['connect']['connectTo'][1]) - parseInt(this.endstation.index) > 0) {
                let a = 0;
                let buff = []
                let i_buff = 0
                for (let index in this.Pop[nextst[2]['connect']['connectTo'][1][0]]) {
                  if (index == this.endstation.index) {
                    a = 1;
                  }
                  console.log(index)
                  if (a == 1) {
                    buff.unshift({ lat: this.Pop[nextst[2]['connect']['connectTo'][1][0]][index].lat, lng: this.Pop[nextst[2]['connect']['connectTo'][1][0]][index].lng })
                    i_buff++
                    console.log(this.Pop[nextst[2]['connect']['connectTo'][1][0]][index])
                  }
                  if (index == nextst[2]['connect']['connectTo'][1]) {
                    a = 0;
                  }
                }
                for (let index = 0; index < i_buff; index++) {
                  flightPlanCoordinates.push(buff[index])
                }
              } else {
                let a = 0;
                for (let index in this.Pop[nextst[2]['connect']['connectTo'][1][0]]) {
                  if (a == 1) {
                    flightPlanCoordinates.push({ lat: this.Pop[nextst[2]['connect']['connectTo'][1][0]][index].lat, lng: this.Pop[nextst[1]['connect']['connectTo'][0][0]][index].lng })
                  }
                  if (index == nextst[2]['connect']['connectTo'][1]) {
                    a = 1;
                  }
                  if (index == this.endstation.index) {
                    a = 0;
                  }
                }
              }
            }
          } else {
            if (this.endstation.index[0] + this.endstation.index[1] == nextst[2]['connect']['connectTo'][0][0] + nextst[2]['connect']['connectTo'][0][1]) {
              if (parseInt(nextst[2]['connect']['connectTo'][0]) - parseInt(this.endstation.index) > 0) {
                let a = 0;
                console.log(this.Pop[nextst[2]['connect']['connectTo'][0][0] + nextst[2]['connect']['connectTo'][0][1]])
                for (let index in this.Pop[nextst[2]['connect']['connectTo'][0][0] + nextst[2]['connect']['connectTo'][0][1]]) {
                  console.log(nextst[2]['connect']['connectTo'][0])
                  if (index == this.endstation.index) {
                    a = 1;
                  }
                  console.log(index)
                  if (a == 1) {
                    this.buffline3.unshift({ lat: this.Pop[nextst[2]['connect']['connectTo'][0][0] + nextst[2]['connect']['connectTo'][0][1]][index].lat, lng: this.Pop[nextst[2]['connect']['connectTo'][0][0] + nextst[2]['connect']['connectTo'][0][1]][index].lng })
                    console.log(this.Pop[nextst[2]['connect']['connectTo'][0][0] + nextst[2]['connect']['connectTo'][0][1]][index])
                  }
                  if (index == nextst[2]['connect']['connectTo'][0]) {
                    a = 0;
                  }
                }
              } else {
                console.log(this.Pop[nextst[2]['connect']['connectTo'][0][0] + nextst[2]['connect']['connectTo'][0][1]])
                let a = 0;
                for (let index in this.Pop[nextst[2]['connect']['connectTo'][0][0] + nextst[2]['connect']['connectTo'][0][1]]) {
                  if (a == 1) {
                    flightPlanCoordinates.push({ lat: this.Pop[nextst[2]['connect']['connectTo'][0][0] + nextst[2]['connect']['connectTo'][0][1]][index].lat, lng: this.Pop[nextst[2]['connect']['connectTo'][0][0] + nextst[2]['connect']['connectTo'][0][1]][index].lng })
                  }
                  if (index == nextst[2]['connect']['connectTo'][0]) {
                    a = 1;
                  }
                  if (index == this.endstation.index) {
                    a = 0;
                  }
                }
              }
            } else if (this.endstation.index[0] == nextst[2]['connect']['connectTo'][1][0]) {
              console.log(nextst[2]['connect']['connectTo'][0])
            }
          }



          if (indexnextst[2].length == 4) {
            if (nextst[1]['connect']['connectTo'][0][1] == indexnextst[2][1]) {
              if (parseInt(indexnextst[2]) - parseInt(nextst[1]['connect']['connectTo'][0]) > 0) {
                let a = 0;

                for (let index in this.Pop[indexnextst[2][0]]) {
                  if (index == nextst[1]['connect']['connectTo'][0]) {
                    a = 1;
                  }
                  if (a == 1) {
                    this.buffline2.push({ lat: this.Pop[indexnextst[2][0]][index].lat, lng: this.Pop[indexnextst[2][0]][index].lng })
                    console.log(this.Pop[indexnextst[2][0]][index])
                  }
                  if (index == indexnextst[2]) {
                    a = 0;
                  }
                }
              } else {
                let a = 0;
                for (let index in this.Pop[indexnextst[2][0]]) {
                  if (index == indexnextst[2]) {
                    a = 1;
                  }
                  if (a == 1) {
                    flightPlanCoordinates.unshift({ lat: this.Pop[indexnextst[2][0]][index].lat, lng: this.Pop[indexnextst[2][0]][index].lng })
                    console.log(this.Pop[indexnextst[2][0]][index])
                  }
                  if (index == nextst[1]['connect']['connectTo'][0]) {
                    a = 0;
                  }
                }
              }
            } else {
              console.log('opp')
              let countst = 'a'
            }
            console.log(flightPlanCoordinates)
          } else if (indexnextst[2].length == 5) {
            console.log(nextst[1]['connect']['connectTo'][0])
            console.log(indexnextst[2])
            if (indexnextst[2][1] == nextst[1]['connect']['connectTo'][0][1]) {
              if (parseInt(indexnextst[2]) - parseInt(nextst[1]['connect']['connectTo'][0]) > 0) {
                console.log('jo')
                console.log(this.Pop[indexnextst[2][0] + indexnextst[2][1]])
                let a = 0;
                for (let index in this.Pop[indexnextst[2][0] + indexnextst[2][1]]) {
                  if (index == nextst[1]['connect']['connectTo'][0]) {
                    a = 1;
                  }
                  if (a == 1) {
                    flightPlanCoordinates.push({ lat: this.Pop[indexnextst[2][0] + indexnextst[2][1]][index].lat, lng: this.Pop[indexnextst[2][0] + indexnextst[2][1]][index].lng })
                    console.log(this.Pop[indexnextst[2][0] + indexnextst[2][1]][index])
                  }
                  if (index == indexnextst[2]) {
                    a = 0;
                  }
                }
              } else {
                let a = 0;
                for (let index in this.Pop[indexnextst[2][0] + indexnextst[2][1]]) {
                  if (index == indexnextst[2]) {
                    a = 0;
                  }
                  if (a == 1) {
                    flightPlanCoordinates.unshift({ lat: this.Pop[indexnextst[2][0] + indexnextst[2][1]][index].lat, lng: this.Pop[indexnextst[2][0] + indexnextst[2][1]][index].lng })
                    console.log(this.Pop[indexnextst[2][0] + indexnextst[2][1]][index])
                  }
                  if (index == nextst[1]['connect']['connectTo'][0]) {
                    a = 1;
                  }
                }
              }
            } else {
              console.log('opp')
            }
          }
          if (this.endstation.index[0] == nextst[2]['connect']['connectTo'][0][0]) {
            if (parseInt(nextst[2]['connect']['connectTo'][0]) - parseInt(this.endstation.index) > 0) {
              let a = 0;
              let buff = []
              let i_buff = 0
              for (let index in this.Pop[nextst[2]['connect']['connectTo'][0][0]]) {
                if (index == this.endstation.index) {
                  a = 1;
                }
                // console.log(index)
                if (a == 1) {
                  buff.unshift({ lat: this.Pop[nextst[2]['connect']['connectTo'][0][0]][index].lat, lng: this.Pop[nextst[2]['connect']['connectTo'][0][0]][index].lng })
                  i_buff++
                  console.log(this.Pop[nextst[2]['connect']['connectTo'][0][0]][index])
                }
                if (index == nextst[2]['connect']['connectTo'][0]) {
                  a = 0;
                }
              }
              for (let index = 0; index < i_buff; index++) {
                flightPlanCoordinates.push(buff[index])
              }
            } else {
              let a = 0;
              for (let index in this.Pop[nextst[2]['connect']['connectTo'][0][0]]) {
                if (a == 1) {
                  flightPlanCoordinates.push({ lat: this.Pop[nextst[2]['connect']['connectTo'][0][0]][index].lat, lng: this.Pop[nextst[1]['connect']['connectTo'][0][0]][index].lng })
                }
                if (index == nextst[2]['connect']['connectTo'][0]) {
                  a = 1;
                }
                if (index == this.endstation.index) {
                  a = 0;
                }
              }
            }
          } else if (this.endstation.index[0] == nextst[2]['connect']['connectTo'][1][0]) {
            if (parseInt(nextst[2]['connect']['connectTo'][1]) - parseInt(this.endstation.index) > 0) {
              let a = 0;
              let buff = []
              let i_buff = 0
              for (let index in this.Pop[nextst[2]['connect']['connectTo'][1][0]]) {
                if (index == this.endstation.index) {
                  a = 1;
                }
                console.log(index)
                if (a == 1) {
                  buff.unshift({ lat: this.Pop[nextst[2]['connect']['connectTo'][1][0]][index].lat, lng: this.Pop[nextst[2]['connect']['connectTo'][1][0]][index].lng })
                  i_buff++
                  console.log(this.Pop[nextst[2]['connect']['connectTo'][1][0]][index])
                }
                if (index == nextst[2]['connect']['connectTo'][1]) {
                  a = 0;
                }
              }
              for (let index = 0; index < i_buff; index++) {
                flightPlanCoordinates.push(buff[index])
              }
            } else {
              let a = 0;
              for (let index in this.Pop[nextst[2]['connect']['connectTo'][1][0]]) {
                if (a == 1) {
                  flightPlanCoordinates.push({ lat: this.Pop[nextst[2]['connect']['connectTo'][1][0]][index].lat, lng: this.Pop[nextst[1]['connect']['connectTo'][0][0]][index].lng })
                }
                if (index == nextst[2]['connect']['connectTo'][1]) {
                  a = 1;
                }
                if (index == this.endstation.index) {
                  a = 0;
                }
              }
            }
          }
          console.log(nextst)
        }

        if (indexnextst[1] !== undefined) {
          if (indexnextst[1].length == 4) {
            if (nextst[0]['connect']['connectTo'][0][1] == indexnextst[1][1]) {
              console.log('opp')
              if (parseInt(indexnextst[1]) - parseInt(nextst[0]['connect']['connectTo'][0]) > 0) {
                let a = 0;
                for (let index in this.Pop[indexnextst[1][0]]) {
                  if (index == nextst[0]['connect']['connectTo'][0]) {
                    a = 1;
                  }
                  if (a == 1) {
                    flightPlanCoordinates.push({ lat: this.Pop[indexnextst[1][0]][index].lat, lng: this.Pop[indexnextst[1][0]][index].lng })
                    console.log(this.Pop[indexnextst[1][0]][index])
                  }
                  if (index == indexnextst[1]) {
                    a = 0;
                  }
                }
                for (let index in this.buffline2) {
                  flightPlanCoordinates.push(this.buffline2[index])
                } 
                for (let index in this.buffline3) {
                  flightPlanCoordinates.push(this.buffline3[index])
                }
              } else {
                let a = 0;
                for (let index in this.Pop[indexnextst[1][0]]) {
                  if (index == indexnextst[1]) {
                    a = 1;
                  }
                  if (a == 1) {
                    flightPlanCoordinates.unshift({ lat: this.Pop[indexnextst[1][0]][index].lat, lng: this.Pop[indexnextst[1][0]][index].lng })
                    console.log(this.Pop[indexnextst[1][0]][index])
                  }
                  if (index == nextst[0]['connect']['connectTo'][0]) {
                    a = 0;
                  }
                }
              }
            } else {
              console.log('opp')
              // ตัวที่สองไม่เท่ากัน
            }
            console.log(flightPlanCoordinates)
          } else if (indexnextst[1].length == 5) {
            console.log(nextst[0]['connect']['connectTo'][0])
            console.log(indexnextst[1])
            if (indexnextst[1][1] == nextst[0]['connect']['connectTo'][0][1]) {
              if (parseInt(indexnextst[1]) - parseInt(nextst[0]['connect']['connectTo'][0]) > 0) {
                console.log('jo')
                console.log(this.Pop[indexnextst[1][0] + indexnextst[1][1]])
                let a = 0;
                for (let index in this.Pop[indexnextst[1][0] + indexnextst[1][1]]) {
                  if (index == nextst[0]['connect']['connectTo'][0]) {
                    a = 1;
                  }
                  if (a == 1) {
                    flightPlanCoordinates.push({ lat: this.Pop[indexnextst[1][0] + indexnextst[1][1]][index].lat, lng: this.Pop[indexnextst[1][0] + indexnextst[1][1]][index].lng })
                    console.log(this.Pop[indexnextst[1][0] + indexnextst[1][1]][index])
                  }
                  if (index == indexnextst[1]) {
                    a = 0;
                  }
                }
              } else {
                let a = 0;
                for (let index in this.Pop[indexnextst[1][0] + indexnextst[1][1]]) {
                  if (index == indexnextst[1]) {
                    a = 0;
                  }
                  if (a == 1) {
                    flightPlanCoordinates.unshift({ lat: this.Pop[indexnextst[1][0] + indexnextst[1][1]][index].lat, lng: this.Pop[indexnextst[1][0] + indexnextst[1][1]][index].lng })
                    console.log(this.Pop[indexnextst[1][0] + indexnextst[1][1]][index])
                  }
                  if (index == nextst[0]['connect']['connectTo'][0]) {
                    a = 1;
                  }
                }
              }
            } else {
              console.log('opp')
              // Here
            }
          }
          if (nextst[2] == undefined) {
            if (this.endstation.index[0] == nextst[1]['connect']['connectTo'][0][0]) {
              if (parseInt(nextst[1]['connect']['connectTo'][0]) - parseInt(this.endstation.index) > 0) {
                let a = 0;
                let buff = []
                let i_buff = 0
                for (let index in this.Pop[nextst[1]['connect']['connectTo'][0][0]]) {
                  if (index == this.endstation.index) {
                    a = 1;
                  }
                  console.log(index)
                  if (a == 1) {
                    buff.unshift({ lat: this.Pop[nextst[1]['connect']['connectTo'][0][0]][index].lat, lng: this.Pop[nextst[1]['connect']['connectTo'][0][0]][index].lng })
                    i_buff++
                    console.log(this.Pop[nextst[1]['connect']['connectTo'][0][0]][index])
                  }
                  if (index == nextst[1]['connect']['connectTo'][0]) {
                    a = 0;
                  }
                }
                for (let index = 0; index < i_buff; index++) {
                  flightPlanCoordinates.push(buff[index])
                }
              } else {
                let a = 0;
                console.log(this.Pop[nextst[1]['connect']['connectTo'][0][0]])
                for (let index in this.Pop[nextst[1]['connect']['connectTo'][0][0]]) {
                  if (a == 1) {
                    flightPlanCoordinates.push({ lat: this.Pop[nextst[1]['connect']['connectTo'][0][0]][index].lat, lng: this.Pop[nextst[1]['connect']['connectTo'][0][0]][index].lng })
                    console.log(this.Pop[nextst[1]['connect']['connectTo'][0][0]][index])
                  }
                  if (index == nextst[1]['connect']['connectTo'][0]) {
                    a = 1;
                  }
                  if (index == this.endstation.index) {
                    a = 0;
                  }
                }
              }
            } else if (this.endstation.index[0] == nextst[1]['connect']['connectTo'][1][0]) {
              if (parseInt(nextst[1]['connect']['connectTo'][1]) - parseInt(this.endstation.index) > 0) {
                let a = 0;
                let buff = []
                let i_buff = 0
                for (let index in this.Pop[nextst[1]['connect']['connectTo'][1][0]]) {
                  if (index == this.endstation.index) {
                    a = 1;
                  }
                  console.log(index)
                  if (a == 1) {
                    buff.unshift({ lat: this.Pop[nextst[1]['connect']['connectTo'][1][0]][index].lat, lng: this.Pop[nextst[1]['connect']['connectTo'][1][0]][index].lng })
                    i_buff++
                    console.log(this.Pop[nextst[1]['connect']['connectTo'][1][0]][index])
                  }
                  if (index == nextst[1]['connect']['connectTo'][1]) {
                    a = 0;
                  }
                }
                for (let index = 0; index < i_buff; index++) {
                  flightPlanCoordinates.push(buff[index])
                }
              } else {
                let a = 0;
                console.log(this.Pop[nextst[1]['connect']['connectTo'][1][0]])
                for (let index in this.Pop[nextst[1]['connect']['connectTo'][1][0]]) {
                  if (a == 1) {
                    flightPlanCoordinates.push({ lat: this.Pop[nextst[1]['connect']['connectTo'][1][0]][index].lat, lng: this.Pop[nextst[1]['connect']['connectTo'][1][0]][index].lng })
                    console.log(this.Pop[nextst[1]['connect']['connectTo'][1][0]][index])
                  }
                  if (index == nextst[1]['connect']['connectTo'][1]) {
                    a = 1;
                  }
                  if (index == this.endstation.index) {
                    a = 0;
                  }
                }
              }
            }
            console.log(nextst)

          }
        }




        if (indexnextst[0] === undefined) {
          console.log('hi')
          if (this.stationstart['index']['1'] == this.endstation.index[1]) {
            console.log('hi')
            if (parseInt(this.stationstart['index']) - parseInt(this.endstation.index) > 0) {
              console.log('hi')
              let a = 0;
              for (let index in this.Pop[this.stationstart['index']['0']]) {
                if (index === this.endstation.index) {
                  a = 1
                }
                if (a === 1) {
                  console.log(this.Pop[this.stationstart['index']['0']][index])
                  flightPlanCoordinates.unshift({ lat: this.Pop[this.stationstart['index']['0']][index].lat, lng: this.Pop[this.stationstart['index']['0']][index].lng })
                }
                if (index === this.stationstart['index']) {
                  a = 0
                }
              }
            } else {
              console.log(this.Pop[this.stationstart['index']['0']])
              let a = 0;
              for (let index in this.Pop[this.stationstart['index']['0']]) {
                if (index === this.stationstart['index']) {
                  a = 1
                }
                if (a === 1) {
                  console.log(this.Pop[this.stationstart['index']['0']][index])
                  flightPlanCoordinates.push({ lat: this.Pop[this.stationstart['index']['0']][index].lat, lng: this.Pop[this.stationstart['index']['0']][index].lng })
                }
                if (index === this.endstation.index) {
                  a = 0
                }
              }
            }
          } else {
            console.log('[')
            let stnum = ((parseInt(this.stationstart['index'][2]) * 10) + (parseInt(this.stationstart['index'][3])))
            let indnum = ((parseInt(this.endstation.index[2]) * 10) + (parseInt(this.endstation.index[3])))
            if (stnum - indnum > 0) {
              console.log(']')
              let a = 0;
              let b = 0;
              for (let index in this.Pop[this.endstation.index[0]]) {
                console.log(index)
                if ((this.endstation.index[1] == index[1]) && ('1' == index[3]) && ('0' == index[2])) {
                  console.log('[]')
                  a = 1;
                  b = 1;
                }
                if (index[1] == this.stationstart['index'][1]) {
                  console.log('][')
                  a = 1;
                  b = 0;
                }
                console.log(index[1])
                console.log(a)
                if (a == 1) {
                  if (b == 0) {
                    flightPlanCoordinates.unshift({ lat: this.Pop[this.endstation.index[0]][index].lat, lng: this.Pop[this.endstation.index[0]][index].lng })
                    console.log(this.Pop[this.endstation.index[0]][index])
                  } else {
                    flightPlanCoordinates.push({ lat: this.Pop[this.endstation.index[0]][index].lat, lng: this.Pop[this.endstation.index[0]][index].lng })
                    console.log(this.Pop[this.endstation.index[0]][index])
                  }
                }
                if (index == this.stationstart['index']) {
                  console.log('{}')
                  a = 0;
                }
                if (index == this.endstation.index) {
                  console.log('}{')
                  a = 0;
                }
              }
            } else {
              console.log(this.stationstart['index']['1'])
              console.log(this.endstation.index[1])
              if (this.stationstart['index']['1'] == this.endstation.index[1]) {
                console.log('hi')
              }
              let p = this.endstation.index[0].concat(this.endstation.index[1]).concat('0').concat('1')
              p = parseInt(p)
              let f = []
              let i = 0
              for (let index in this.Pop[this.endstation.index[0]]) {
                if (index[1] == this.endstation.index[1]) {
                  f[i] = parseInt(index) - p
                  i++
                }
              }

              let c = ((parseInt(this.endstation.index[0]) * 1000) + (parseInt(this.endstation.index[1]) * 100)) + Math.max(...f);
              console.log(c)
              console.log((parseInt(this.endstation.index) - p))
              console.log((parseInt(this.endstation.index) - c) + 1)
              if ((parseInt(this.endstation.index) - p) < (parseInt(this.endstation.index) - c) + 1) {

                console.log('>')
                let a = 0;
                let b = 0;
                for (let index in this.Pop[this.endstation.index[0]]) {
                  console.log(index)
                  if ((this.endstation.index[1] == index[1]) && ('1' == index[3]) && ('0' == index[2])) {
                    console.log('[]')
                    a = 1;
                    b = 1;
                  }
                  if (index[1] == this.stationstart['index'][1]) {
                    console.log('][')
                    a = 1;
                    b = 0;
                  }
                  console.log(index[1])
                  console.log(a)
                  if (a == 1) {
                    if (b == 0) {
                      flightPlanCoordinates.unshift({ lat: this.Pop[this.endstation.index[0]][index].lat, lng: this.Pop[this.endstation.index[0]][index].lng })
                      console.log(this.Pop[this.endstation.index[0]][index])
                    } else {
                      flightPlanCoordinates.push({ lat: this.Pop[this.endstation.index[0]][index].lat, lng: this.Pop[this.endstation.index[0]][index].lng })
                      console.log(this.Pop[this.endstation.index[0]][index])
                    }
                  }
                  if (index == this.stationstart['index']) {
                    console.log('{}')
                    a = 0;
                  }
                  if (index == this.endstation.index) {
                    console.log('}{')
                    a = 0;
                  }
                }
              } else {
                console.log('>')
                let a = 0;
                let b = 0;
                for (let index in this.Pop[this.endstation.index[0]]) {
                  if (index === "2032" && a === 1) {
                    b = 1;
                  }
                  if (index === '2101' && a === 1 && b === 1) {
                    flightPlanCoordinates.unshift({ lat: this.Pop[this.endstation.index[0]]['2001'].lat, lng: this.Pop[this.endstation.index[0]]['2001'].lng })
                    console.log(this.Pop[this.endstation.index[0]]['2001'])
                  }
                  console.log(index)
                  if (this.endstation.index == index) {
                    a = 1;
                  }
                  if (a == 1) {
                    flightPlanCoordinates.unshift({ lat: this.Pop[this.endstation.index[0]][index].lat, lng: this.Pop[this.endstation.index[0]][index].lng })
                    console.log(this.Pop[this.endstation.index[0]][index])
                  }
                  if (index == this.stationstart['index']) {
                    console.log('}{')
                    a = 0;
                  }
                }
              }
            }
          }
        } else {
          if (indexnextst[0].length == 4) {
            if (this.stationstart['index'][1] == indexnextst[0][1]) {
              if (parseInt(this.stationstart['index']) - parseInt(indexnextst[0]) > 0) {
                let a = 0;
                for (let index in this.Pop[indexnextst[0][0]]) {
                  if (index == indexnextst[0]) {
                    a = 1;
                  }
                  if (a == 1) {
                    flightPlanCoordinates.unshift({ lat: this.Pop[indexnextst[0][0]][index].lat, lng: this.Pop[indexnextst[0][0]][index].lng })
                    console.log(this.Pop[indexnextst[0][0]][index])
                  }
                  if (index == this.stationstart['index']) {
                    a = 0;
                  }
                }
              } else {
                let a = 0;
                for (let index in this.Pop[indexnextst[0][0]]) {
                  if (index == indexnextst[0]) {
                    a = 0;
                  }
                  if (a == 1) {
                    flightPlanCoordinates.unshift({ lat: this.Pop[indexnextst[0][0]][index].lat, lng: this.Pop[indexnextst[0][0]][index].lng })
                    console.log(this.Pop[indexnextst[0][0]][index])
                  }
                  if (index == this.stationstart['index']) {
                    a = 1;
                  }
                }
              }
            } else {
              console.log('[')
              let stnum = ((parseInt(this.stationstart['index'][2]) * 10) + (parseInt(this.stationstart['index'][3])))
              let indnum = ((parseInt(indexnextst[0][2]) * 10) + (parseInt(indexnextst[0][3])))
              if (stnum - indnum > 0) {
                console.log(']')
                let a = 0;
                for (let index in this.Pop[indexnextst[0][0]]) {
                  if (index == this.stationstart['index']) {
                    a = 0;
                  }
                  if (index == indexnextst[0]) {
                    a = 1;
                  }
                  if (a == 1) {
                    flightPlanCoordinates.unshift({ lat: this.Pop[indexnextst[0][0]][index].lat, lng: this.Pop[indexnextst[0][0]][index].lng })
                    console.log(this.Pop[indexnextst[0][0]][index])
                  }
                }
              } else {
                console.log('>')
                let a = 0;
                let b = 0;
                for (let index in this.Pop[indexnextst[0][0]]) {
                  // console.log(index)
                  if ((indexnextst[0][1] == index[1]) && ('1' == index[3]) && ('0' == index[2])) {
                    // console.log('[]')
                    a = 1;
                    b = 1;
                  }
                  if (index[1] == this.stationstart['index'][1]) {
                    // console.log('][')
                    a = 1;
                    b = 0;
                  }
                  // console.log(index[1])
                  // console.log(a)
                  if (a == 1) {
                    if (b == 0) {
                      flightPlanCoordinates.unshift({ lat: this.Pop[indexnextst[0][0]][index].lat, lng: this.Pop[indexnextst[0][0]][index].lng })
                      console.log(this.Pop[indexnextst[0][0]][index])
                    } else {
                      flightPlanCoordinates.push({ lat: this.Pop[indexnextst[0][0]][index].lat, lng: this.Pop[indexnextst[0][0]][index].lng })
                      console.log(this.Pop[indexnextst[0][0]][index])
                    }
                  }
                  if (index == this.stationstart['index']) {
                    // console.log('{}')
                    a = 0;
                  }
                  if (index == indexnextst[0]) {
                    // console.log('}{')
                    a = 0;
                  }
                }
              }
            }
          } else if (indexnextst[0].length == 5) {
            if (this.stationstart['index'][2] == indexnextst[0][2]) {
              if (parseInt(this.stationstart['index']) - parseInt(indexnextst[0]) > 0) {
                console.log('jo')
                let a = 0;
                for (let index in this.Pop[indexnextst[0][0]]) {
                  if (index == this.stationstart['index']) {
                    a = 0;
                  }
                  if (a == 1) {
                    flightPlanCoordinates.unshift({ lat: this.Pop[indexnextst[0][0]][index].lat, lng: this.Pop[indexnextst[0][0]][index].lng })
                    console.log(this.Pop[indexnextst[0][0]][index])
                  }
                  if (index == indexnextst[0]) {
                    a = 1;
                  }
                }
              } else {
                let a = 0;
                for (let index in this.Pop[indexnextst[0][0]]) {
                  if (index == indexnextst[0]) {
                    a = 0;
                  }
                  if (a == 1) {
                    flightPlanCoordinates.unshift({ lat: this.Pop[indexnextst[0][0]][index].lat, lng: this.Pop[indexnextst[0][0]][index].lng })
                    console.log(this.Pop[indexnextst[0][0]][index])
                  }
                  if (index == this.stationstart['index']) {
                    a = 1;
                  }
                }
              }
            } else {
              console.log('opp')
              // console.log('[')
              // let stnum = ((parseInt(this.stationstart['index'][3]) * 10) + (parseInt(this.stationstart['index'][4])))
              // let indnum = ((parseInt(indexnextst[0][3]) * 10) + (parseInt(indexnextst[0][4])))
              // if (stnum - indnum > 0) {
              //   console.log(']')
              //   let a = 0;
              //   for (let index in this.Pop[indexnextst[0][0]]) {
              //     if (index == this.stationstart['index']) {
              //       a = 0;
              //     }
              //     if (index == indexnextst[0]) {
              //       a = 1;
              //     }
              //     if (a == 1) {
              //       flightPlanCoordinates.unshift({ lat: this.Pop[indexnextst[0][0]][index].lat, lng: this.Pop[indexnextst[0][0]][index].lng })
              //       console.log(this.Pop[indexnextst[0][0]][index])
              //     }
              //   }
              // } else {
              //   console.log('>')
              //   let a = 0;
              //   let b = 0;
              //   for (let index in this.Pop[indexnextst[0][0]]) {
              //     // console.log(index)
              //     if ((indexnextst[0][1] == index[1]) && ('1' == index[3]) && ('0' == index[2])) {
              //       // console.log('[]')
              //       a = 1;
              //       b = 1;
              //     }
              //     if (index[1] == this.stationstart['index'][1]) {
              //       // console.log('][')
              //       a = 1;
              //       b = 0;
              //     }
              //     // console.log(index[1])
              //     // console.log(a)
              //     if (a == 1) {
              //       if (b == 0) {
              //         flightPlanCoordinates.unshift({ lat: this.Pop[indexnextst[0][0]][index].lat, lng: this.Pop[indexnextst[0][0]][index].lng })
              //         console.log(this.Pop[indexnextst[0][0]][index])
              //       } else {
              //         flightPlanCoordinates.push({ lat: this.Pop[indexnextst[0][0]][index].lat, lng: this.Pop[indexnextst[0][0]][index].lng })
              //         console.log(this.Pop[indexnextst[0][0]][index])
              //       }
              //     }
              //     if (index == this.stationstart['index']) {
              //       // console.log('{}')
              //       a = 0;
              //     }
              //     if (index == indexnextst[0]) {
              //       // console.log('}{')
              //       a = 0;
              //     }
              //   }
              // }
            }
          }
          if (nextst[1] == undefined) {
            if (this.endstation.index.length === 4) {
              if (this.endstation.index[0] == nextst[0]['connect']['connectTo'][0][0]) {
                if (parseInt(nextst[0]['connect']['connectTo'][0]) - parseInt(this.endstation.index) > 0) {
                  let a = 0;
                  let buff = []
                  let i_buff = 0
                  console.log(this.Pop[nextst[0]['connect']['connectTo'][0][0]])
                  for (let index in this.Pop[nextst[0]['connect']['connectTo'][0][0]]) {
                    if (index == this.endstation.index) {
                      a = 1;
                    }
                    // console.log(index)  
                    if (a == 1) {
                      buff.unshift({ lat: this.Pop[nextst[0]['connect']['connectTo'][0][0]][index].lat, lng: this.Pop[nextst[0]['connect']['connectTo'][0][0]][index].lng })
                      i_buff++
                      console.log(this.Pop[nextst[0]['connect']['connectTo'][0][0]][index])
                    }
                    if (index == nextst[0]['connect']['connectTo'][0]) {
                      a = 0;
                    }
                  }
                  for (let index = 0; index < i_buff; index++) {
                    flightPlanCoordinates.push(buff[index])
                  }
                } else {
                  console.log(this.Pop[nextst[0]['connect']['connectTo'][0][0]])
                  let a = 0;
                  let b = 0;
                  for (let index in this.Pop[nextst[0]['connect']['connectTo'][0][0]]) {
                    if (index === "2032" && a === 1) {
                      b = 1;
                    }
                    if (index === '2101' && a === 1 && b === 1) {
                      flightPlanCoordinates.push({ lat: this.Pop[nextst[0]['connect']['connectTo'][0][0]]['2001'].lat, lng: this.Pop[nextst[0]['connect']['connectTo'][0][0]]['2001'].lng })
                      console.log(this.Pop[nextst[0]['connect']['connectTo'][0][0]]['2001'])
                    }
                    if (a == 1) {
                      flightPlanCoordinates.push({ lat: this.Pop[nextst[0]['connect']['connectTo'][0][0]][index].lat, lng: this.Pop[nextst[0]['connect']['connectTo'][0][0]][index].lng })
                      console.log(this.Pop[nextst[0]['connect']['connectTo'][0][0]][index])
                    }
                    if (index == nextst[0]['connect']['connectTo'][0]) {
                      a = 1;
                    }
                    if (index == this.endstation.index) {
                      a = 0;
                    }
                  }
                }
              } else if (nextst[0]['connect']['connectTo'].length === 1) {
                if (this.endstation.index[0] == nextst[1]['connect']['connectTo'][0][0]) {
                  if (parseInt(nextst[1]['connect']['connectTo'][0]) - parseInt(this.endstation.index) > 0) {
                    let a = 0;
                    console.log(this.Pop[nextst[1]['connect']['connectTo'][0][0]])
                    for (let index in this.Pop[nextst[1]['connect']['connectTo'][0][0]]) {
                      if (index == nextst[1]['connect']['connectTo'][1]) {
                        a = 1;
                      }
                      console.log(index)
                      if (a == 1) {
                        flightPlanCoordinates.push({ lat: this.Pop[nextst[1]['connect']['connectTo'][0][0]][index].lat, lng: this.Pop[nextst[1]['connect']['connectTo'][0][0]][index].lng })
                        console.log(this.Pop[nextst[1]['connect']['connectTo'][0][0]][index])
                      }
                      if (index == this.endstation.index) {
                        a = 0;
                      }
                    }
                  } else {
                    console.log(this.Pop[nextst[1]['connect']['connectTo'][0][0]])
                    let a = 0;
                    for (let index in this.Pop[nextst[1]['connect']['connectTo'][0][0]]) {
                      if (a == 1) {
                        flightPlanCoordinates.push({ lat: this.Pop[nextst[1]['connect']['connectTo'][0][0]][index].lat, lng: this.Pop[nextst[1]['connect']['connectTo'][0][0]][index].lng })
                        console.log(this.Pop[nextst[1]['connect']['connectTo'][0][0]][index])
                      }
                      if (index == nextst[1]['connect']['connectTo'][1]) {
                        a = 1;
                      }
                      if (index == this.endstation.index) {
                        a = 0;
                      }
                    }
                  }
                } else if (nextst[1]['connect']['connectTo'].length === 2) {
                  if (nextst[1]['connect']['connectTo'][1][0] === this.endstation.index[0]) {
                    if (parseInt(nextst[1]['connect']['connectTo'][1]) - parseInt(this.endstation.index) > 0) {
                      let a = 0;
                      console.log(this.Pop[nextst[1]['connect']['connectTo'][1][0]])
                      for (let index in this.Pop[nextst[1]['connect']['connectTo'][1][0]]) {
                        if (index == nextst[1]['connect']['connectTo'][1]) {
                          a = 1;
                        }
                        console.log(index)
                        if (a == 1) {
                          flightPlanCoordinates.push({ lat: this.Pop[nextst[1]['connect']['connectTo'][1][0]][index].lat, lng: this.Pop[nextst[1]['connect']['connectTo'][1][0]][index].lng })
                          console.log(this.Pop[nextst[1]['connect']['connectTo'][1][0]][index])
                        }
                        if (index == this.endstation.index) {
                          a = 0;
                        }
                      }
                    } else {
                      console.log(this.Pop[nextst[1]['connect']['connectTo'][1][0]])
                      let a = 0;
                      for (let index in this.Pop[nextst[1]['connect']['connectTo'][1][0]]) {
                        if (a == 1) {
                          flightPlanCoordinates.push({ lat: this.Pop[nextst[1]['connect']['connectTo'][1][0]][index].lat, lng: this.Pop[nextst[1]['connect']['connectTo'][1][0]][index].lng })
                          console.log(this.Pop[nextst[1]['connect']['connectTo'][1][0]][index])
                        }
                        if (index == nextst[1]['connect']['connectTo'][1]) {
                          a = 1;
                        }
                        if (index == this.endstation.index) {
                          a = 0;
                        }
                      }
                    }
                  }
                }
                console.log(nextst)

              } else if (nextst[0]['connect']['connectTo'].length === 2) {
                console.log(nextst[0]['connect']['connectTo'][1])
                if (this.endstation.index[0] == nextst[0]['connect']['connectTo'][1][0]) {
                }
              }
            } else if (this.endstation.index.length === 5) {
              if (this.endstation.index[0] + this.endstation.index[1] == nextst[0]['connect']['connectTo'][0][0] + nextst[0]['connect']['connectTo'][0][1]) {
                if (parseInt(nextst[0]['connect']['connectTo'][0]) - parseInt(this.endstation.index) > 0) {
                  let a = 0;
                  console.log(this.Pop[nextst[0]['connect']['connectTo'][0][0] + nextst[0]['connect']['connectTo'][0][1]])
                  for (let index in this.Pop[nextst[0]['connect']['connectTo'][0][0] + nextst[0]['connect']['connectTo'][0][1]]) {
                    if (index == nextst[0]['connect']['connectTo'][0]) {
                      a = 1;
                    }
                    console.log(index)
                    if (a == 1) {
                      flightPlanCoordinates.push({ lat: this.Pop[nextst[0]['connect']['connectTo'][0][0] + nextst[0]['connect']['connectTo'][0][1]][index].lat, lng: this.Pop[nextst[0]['connect']['connectTo'][0][0] + nextst[0]['connect']['connectTo'][0][1]][index].lng })
                      console.log(this.Pop[nextst[0]['connect']['connectTo'][0][0] + nextst[0]['connect']['connectTo'][0][1]][index])
                    }
                    if (index == this.endstation.index) {
                      a = 0;
                    }
                  }
                } else {
                  console.log(this.Pop[nextst[0]['connect']['connectTo'][0][0] + nextst[0]['connect']['connectTo'][0][1]])
                  let a = 0;
                  for (let index in this.Pop[nextst[0]['connect']['connectTo'][0][0] + nextst[0]['connect']['connectTo'][0][1]]) {
                    if (a == 1) {
                      flightPlanCoordinates.push({ lat: this.Pop[nextst[0]['connect']['connectTo'][0][0] + nextst[0]['connect']['connectTo'][0][1]][index].lat, lng: this.Pop[nextst[0]['connect']['connectTo'][0][0] + nextst[0]['connect']['connectTo'][0][1]][index].lng })
                    }
                    if (index == nextst[0]['connect']['connectTo'][0]) {
                      a = 1;
                    }
                    if (index == this.endstation.index) {
                      a = 0;
                    }
                  }
                }
              } else if (this.endstation.index[0] == nextst[0]['connect']['connectTo'][1][0]) {
                console.log(nextst[0]['connect']['connectTo'][0])
              }
              console.log('aa')
            }
          }
        }

        flightPlanCoordinates.unshift({ lat: this.start.lat, lng: this.start.lng })
        flightPlanCoordinates.push({ lat: this.end.lat, lng: this.end.lng })

        console.log(flightPlanCoordinates)
        this.flightPath = new google.maps.Polyline({
          path: flightPlanCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        this.flightPath.setMap(this.map);

        // var goo = google.maps,
        //   map = new goo.Map(document.getElementById('map'), {
        //     center: this.end,
        //     zoom: 10
        //   }),
        //   App = {
        //     map: map,
        //     bounds: new google.maps.LatLngBounds(),
        //     directionsService: new google.maps.DirectionsService(),
        //     directionsDisplay1: new google.maps.DirectionsRenderer({
        //       map: map,
        //       preserveViewport: true,
        //       suppressMarkers: true,
        //       polylineOptions: { strokeColor: 'red' },
        //     }),
        //     directionsDisplay2: new google.maps.DirectionsRenderer({
        //       map: map,
        //       preserveViewport: true,
        //       suppressMarkers: true,
        //       polylineOptions: { strokeColor: 'blue' },
        //     }),
        //     directionsDisplay3: new google.maps.DirectionsRenderer({
        //       map: map,
        //       preserveViewport: true,
        //       suppressMarkers: true,
        //       polylineOptions: { strokeColor: 'green' },
        //     }),
        //     directionsDisplay4: new google.maps.DirectionsRenderer({
        //       map: map,
        //       preserveViewport: true,
        //       suppressMarkers: true,
        //       polylineOptions: { strokeColor: 'red' },
        //     }),
        //   },
        //   startLeg = {
        //     origin: this.start,
        //     destination: { lat: this.startstation.lat, lng: this.startstation.lng },
        //     travelMode: 'DRIVING'
        //   },
        //   connLeg = {
        //     origin: this.startstation,
        //     destination: { lat: nextst[0].lat, lng: nextst[0].lng },
        //     travelMode: 'TRANSIT',
        //     transitOptions: {
        //       modes: ['TRAIN', 'SUBWAY'],
        //       routingPreference: 'LESS_WALKING',
        //       // routingPreference: 'FEWER_TRANSFERS',
        //     },
        //   },
        //   connLeg2 = {
        //     origin: { lat: nextst[0].lat, lng: nextst[0].lng },
        //     destination: { lat: this.endstation.lat, lng: this.endstation.lng },
        //     travelMode: 'TRANSIT',
        //     transitOptions: {
        //       modes: ['TRAIN', 'SUBWAY'],
        //       routingPreference: 'LESS_WALKING',
        //       // routingPreference: 'FEWER_TRANSFERS',
        //     },
        //   },
        //   midLeg = {
        //     origin: this.startstation,
        //     destination: { lat: this.endstation.lat, lng: this.endstation.lng },
        //     travelMode: 'TRANSIT',
        //     transitOptions: {
        //       modes: ['TRAIN', 'SUBWAY'],
        //       // routingPreference: 'LESS_WALKING',
        //       routingPreference: this.routing,
        //     },
        //   },
        //   endLeg = {
        //     origin: { lat: this.endstation.lat, lng: this.endstation.lng },
        //     destination: this.end,
        //     travelMode: 'TRANSIT',
        //     transitOptions: {
        //       modes: ['TRAIN', 'SUBWAY'],
        //       routingPreference: 'LESS_WALKING',
        //       // routingPreference: 'FEWER_TRANSFERS',
        //     },
        //   };

        // App.directionsService.route(startLeg, function (result, status) {
        //   if (status === 'OK') {
        //     App.directionsDisplay1.setDirections(result);
        //     App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
        //   }
        // });
        // if (nextst != []) {
        //   App.directionsService.route(connLeg, function (result, status) {
        //     if (status == google.maps.DirectionsStatus.OK) {
        //       App.directionsDisplay2.setDirections(result);
        //       App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
        //     }
        //   });
        //   App.directionsService.route(connLeg2, function (result, status) {
        //     if (status == google.maps.DirectionsStatus.OK) {
        //       App.directionsDisplay3.setDirections(result);
        //       App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
        //     }
        //   });
        //   App.directionsService.route(endLeg, function (result, status) {
        //     if (status == google.maps.DirectionsStatus.OK) {
        //       App.directionsDisplay4.setDirections(result);
        //       App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
        //     }
        //   });
        // } else {
        //   App.directionsService.route(midLeg, function (result, status) {
        //     if (status == google.maps.DirectionsStatus.OK) {
        //       App.directionsDisplay2.setDirections(result);
        //       App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
        //     }
        //   });
        //   App.directionsService.route(endLeg, function (result, status) {
        //     if (status == google.maps.DirectionsStatus.OK) {
        //       App.directionsDisplay3.setDirections(result);
        //       App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
        //     }
        //   });
        // }



        // this.directionsDisplay.setMap(this.map);
      }
    })
    this.p = ''
    this.connectstation = ''
  }

  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      // console.log(this.markers[i])
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  calculateAndDisplayRoute() {
    let directionService = new google.maps.DirectionsService;
    let directionDisplay = new google.maps.DirectionsRenderer;
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 }
    });
    directionDisplay.setMap(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos);
      }, function () {

      });
    } else {

    }
    directionService.route({
      origin: '',
      destination: '',
      travelMode: 'DRIVING'
    }, function (response, status) {
      if (status == 'OK') {
        directionDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    })
  }
}
