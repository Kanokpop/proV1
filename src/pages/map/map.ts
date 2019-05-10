import { Component, NgZone, Testability } from '@angular/core';
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
    console.log('l')
    this.getDataFromFirebase().then(data => {
      this.Pop = data as any;
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
    console.log('ll')
    this.tabBarElement.style.display = 'none';
    setTimeout(() => {
      this.splash = false;
      this.tabBarElement.style.display = 'flex';
    }, 4000);
  }
  ionViewDidEnter() {
    console.log('lll')
    //  console.log(this.Pop)
    //  this.storage.set('intro-done', true);
  }
  getDataFromFirebase() {
    console.log('1')
    return new Promise((resolve, reject) => {
      this.db.list('/Station/').valueChanges()
        .subscribe(
          data => {
            this.Pop = data;
            resolve(this.Pop)
          },
        );
      console.log('n1')
    });
  }
  getPosition(): any {
    console.log('2')
    this.geolocation.getCurrentPosition().then(response => {
      this.calDis(response);


    }).then(response => {

    })
      .catch(error => {
        console.log(error);
      })
    console.log('n2')
  }


  // Calculate Distance
  calculateDistance = ((lat1: number, lat2: number, long1: number, long2: number) => {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    // console.log(dis);
    return dis;
  })
  calDis = ((position: Geoposition) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    // create LatLng object
    let myLatLng = { lat: latitude, lng: longitude };
    this.start = myLatLng;
    console.log('4')
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
        if (countcompare > 273) {
          if (Number(index) < 1000) {
            this.candidate[index] = this.Pop[0][index]
            this.startstation = this.Pop[0][index]
          }
          else if (Number(index) < 2000) {
            this.candidate[index] = this.Pop[1][index]
            this.startstation = this.Pop[1][index]
          }
          else if (Number(index) < 3000) {
            this.candidate[index] = this.Pop[2][index]
            this.startstation = this.Pop[2][index]
          }
          else if (Number(index) < 4000) {
            this.candidate[index] = this.Pop[3][index]
            this.startstation = this.Pop[3][index]
          }
          else if (Number(index) < 5000) {
            this.candidate[index] = this.Pop[4][index]
            this.startstation = this.Pop[4][index]
          }
          else if (Number(index) < 6000) {
            this.candidate[index] = this.Pop[5][index]
            this.startstation = this.Pop[5][index]
          }
          else if (Number(index) < 7000) {
            this.candidate[index] = this.Pop[6][index]
            this.startstation = this.Pop[6][index]
          }
          else if (Number(index) < 8000) {
            this.candidate[index] = this.Pop[7][index]
            this.startstation = this.Pop[7][index]
          }
          else if (Number(index) < 9000) {
            this.candidate[index] = this.Pop[8][index]
            this.startstation = this.Pop[8][index]
          }
          else if (Number(index) < 10000) {
            this.candidate[index] = this.Pop[9][index]
            this.startstation = this.Pop[9][index]
          }
          else {
            this.candidate[index] = this.Pop[10][index]
            this.startstation = this.Pop[10][index]
          }
        }
      }
    }
    console.log('n4')
    // this.startstation = this.candidate;
    // console.log(this.startstation)
    this.loadMap()
    // this.calcDis()
  })
  calcDis = () => {
    console.log('5')
    //  let promise = new Promise(function(resolve, reject) {
    //   setTimeout(() => resolve(pppp), 1000);
    // });
    let lenghtcandid = 0
    for (let index in this.candidate) {
      lenghtcandid++
      this.candidate[index].lenghtcandid = lenghtcandid
    }
    // console.log(this.candidate)
    this.calcDistance(this.start, this.candidate, this.Callback_calcDistance, this.candidate)

    // for (let index in pppp[0]) {
    //   this.line0[index] = this.calcDistance(this.start,{lat: pppp[0][index].lat,lng : pppp[0][index].lng},this.Callback_calcDistance)
    //   console.log(this.stst)
    // }
    // for (let index in pppp[1]) {
    //   // this.calcDistance(this.start,{lat: pppp[1][index].lat,lng : pppp[1][index].lng})
    // }



    // // resolve runs the first function in .then
    // promise.then(
    //   result =>{
    // console.log(this.dist)  
    //   }  // shows "done!" after 1 second
    // )
    // ;

    // this.calcDistance(this.start,{lat: this.Pop[0]['0001'].lat,lng : this.Pop[0]['0001'].lng})
    console.log('n5')

  }

  sos(ms) {
    console.log('fuck')
    return new Promise(r => setTimeout(r, ms));
  }

  calcDistance = ((origin1, updatedTeacherList, ref_Callback_calcDistance, candidate) => {
    console.log('6')
    var teacherZips = [];
    var temp_duration = 0;
    var temp_distance = 0;
    var testres;
    // console.log(updatedTeacherList)
    // for (var i in updatedTeacherList){
    for (let index in updatedTeacherList) {
      teacherZips.push({ lat: updatedTeacherList[index].lat, lng: updatedTeacherList[index].lng, name: updatedTeacherList[index].name });
    }
    // }
    // console.log(teacherZips);
    this.service.getDistanceMatrix(
      {
        origins: [origin1],
        destinations: teacherZips,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, function (response, status) {
        console.log('7')
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          console.log(status)
        } else {
          var originList = response.originAddresses;
          // console.log(originList)
          var destinationList = response.destinationAddresses;
          // console.log(destinationList)
          // console.log(response)
          if (status == 'OK') {
            for (var i = 0; i < originList.length; i++) {
              var results = response.rows[i].elements;
            }
          }
          testres = results;
          let compare
          let compare1
          let countcompare = 0

          for (let index in testres) {
            countcompare = 0;
            compare = testres[index]
            for (let index1 in testres) {
              compare1 = testres[index1]
              if (compare.distance.value < compare1.distance.value) {
                countcompare++
              }
              if (countcompare == 6) {
                // console.log(candidate)
                // console.log(index)

                for (let ind in candidate) {
                  if (candidate[ind].lenghtcandid == index) {
                    this.startstation = candidate[ind]
                    console.log(this.startstation)
                  }
                }
                countcompare = 0
              }
            }
          }
          // console.log(testres.results)
          // if (typeof ref_Callback_calcDistance === 'function') {
          //   //calling the callback function
          //   ref_Callback_calcDistance(testres)
          //   //  console.log(this.stst)
          // }
        }


        console.log('n7')
      },

      // setTimeout ("console.log('ok',this.startstation)",1000)
    );
    // this.setstart(this.startstation)
    // if (this.startstation === undefined) {
    //  await setTimeout("console.log(this.startstation)",2000)
    // }
    console.log('n6')

  })

  loadMap = async () => {
    console.log('3')

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


      // console.log(compare)
      // test compare Locate

      //  console.log(this.start)
      //  console.log({lat: this.Pop[0]['0001'].lat,lng: this.Pop[0]['0001'].lng})
      //  this.calcDistance(this.start,{lat: this.Pop[0]['0001'].lat,lng: this.Pop[0]['0001'].lng},this.Callback_calcDistance);


      // for (let index = 0; index < this.Pop.length; index++) {  

      //   for (let index1 in this.Pop[index]) {
      //     // this.calcDistance(this.start,{lat: this.Pop[index][index1].lat, lng: this.Pop[index][index1].lng},this.Callback_calcDistance);
      //     // console.log(this.stst)
      //   //  compare[index1] = this.calculateDistance(this.start.lat,this.Pop[index][index1].lat,this.start.lng,this.Pop[index][index1].lng)
      //   // console.log(this.calcDistance(this.start,{lat: this.Pop[0]['0001'].lat,lng: this.Pop[0]['0001'].lng}))
      //   // compare[index1] =  this.stst;
      //   // this.calcDistance(this.start,{lat: 13.746446, lng: 100.52936});

      //    // for (let index1 = 1; index1 < 7; index1++) {
      //      //   compare1[index] = this.calculateDistance(this.start.lat,this.Pop[index].gate['gate'+index1].lat,this.start.lng,this.Pop[index].gate['gate'+index1].lng)
      //      //   console.log(compare1[index]);                   
      //      // }
      //     }
      //     // console.log(this.start);
      //     // console.log(compare);

      //   }
      //   if(compare[0] !== '')
      //   console.log(compare)
      // mark End location
      // for (let index in this.Pop) {

      //  for (let index1 in this.Pop[index]) {
      //    let compo = compare[index1];
      //    let countconpare = 0;
      //   //  console.log(index1)
      //   //  console.log(compo)
      //    for (let index2 in this.Pop[index]) {
      //     //  console.log(index2)
      //     // let compare = this.Pop[index];     
      //     // console.log(compare[index2])            
      //      if (compo<compare[index2]) {
      //        countconpare++;
      //       //  console.log(countconpare)
      //       }
      //       var keys = Object.keys(this.Pop[index]);
      //       //  console.log(keys.length)
      //      if (countconpare == ((keys.length-1))){
      //       //  console.log('kaissja')
      //       //  console.log(index)
      //        this.stationstart[index] = {lat: this.Pop[index][index1].lat,lng: this.Pop[index][index1].lng,name: this.Pop[index][index1].name,line: this.Pop[index][index1].line};
      //         // console.log(this.stationstart)
      //        // this.stationstart = {lat: this.Pop[8].lat,lng: this.Pop[8].lng,name: this.Pop[8].name,line: this.Pop[8].line};
      //       //  this.startstation = this.stationstart[index].name
      //       //  console.log(this.startstation)
      //       //  console.log(this.stationstart)
      //        this.n = index2
      //        // ,gate: this.Pop[index].gate
      //        // this.stationstart = {lat: this.Pop[13].lat,lng: this.Pop[13].lng,name: this.Pop[13].name,line: this.Pop[13].line};
      //        // for (let index2 = 1; index2 < 7; index2++) {
      //        //   compare1[index2] = this.calculateDistance(this.start.lat,this.Pop[index].gate['gate'+index2].lat,this.start.lng,this.Pop[index].gate['gate'+index2].lng)
      //        // }
      //        // console.log(compare1);
      //        // for (let index3 = 1; index3 < 7; index3++) {
      //        //   let compogate = compare1[index3];
      //        //   let countconpare1 = 0;
      //        //   // console.log(compogate+'compo');
      //        //   // console.log(countconpare1+'countstart');
      //        //   for (let index4 = 1; index4 < 7; index4++) {
      //        //     // console.log(index4+'i');
      //        //     if (compogate<compare1[index4]) {
      //        //       countconpare1++;
      //        //       // console.log(countconpare1+'count');
      //        //     }                
      //        //     if (countconpare1 == 5) {
      //        //       this.startgate = {lat: this.Pop[index].gate['gate'+index3].lat,lng: this.Pop[index].gate['gate'+index3].lng,gate: this.Pop[index].gate['gate'+index3].description};
      //        //     }     
      //        //   }

      //        // }
      //      }
      //    }
      //  }
      //  // this.startgatehtml = this.startgate.gate;
      // }
      // let pare_st = []
      // let countpare_st =0;
      //        for (let i_st in this.stationstart) {
      //          pare_st[i_st] = this.calculateDistance(this.start.lat,this.stationstart[i_st].lat,this.start.lng,this.stationstart[i_st].lng)               
      //         }
      //         // console.log(pare_st)
      //       for (let i_st in this.stationstart) {
      //         countpare_st = 0;
      //         let pare = pare_st[i_st]
      //         for (let i_st1 in this.stationstart) {

      //           if (pare<pare_st[i_st1]) {
      //             // console.log('[]][]')
      //             countpare_st++;
      //             // console.log(countpare_st)
      //           }      
      //           if (countpare_st == (this.stationstart.length-1)) {
      //             this.startstation = {lat: this.stationstart[i_st].lat,lng: this.stationstart[i_st].lng,name: this.stationstart[i_st].name,line: this.stationstart[i_st].line};   
      //           }         
      //         }
      //       }
      // console.log(pare_st)
      // console.log(this.startstation.name)
      // this.stst = {lat :this.startstation.lat,lng: this.startstation.lng}
      // console.log(this.stst)

      //calling the calcDistance function and passing callback function reference
      // this.calcDistance(this.start,this.stst,this.Callback_calcDistance);

      var a = [];
      // console.log(a)
      // a[0] = 'aaa'
      // a[0] = 'Not done'
      // a[1] = 'bbb'
      // a[1] = 'Not done'
      // console.log(a)
      // console.log(this.Pop['6']["6011"]["connect"]["line"])
      // console.log(this.Pop['6']["6012"]["connect"])
      console.log(this.Pop)
      for (let index in this.Pop) {
        for (let index1 in this.Pop[index]) {
          if (this.Pop[index][index1].connect !== undefined) {
            this.stationconnect[index1] = this.Pop[index][index1]
          }
        }
      }
      // console.log(this.stationconnect)q

      mapEle.classList.add('show-map');
      return this.Pop
    })
    // }); 
    console.log(this.startstation)
    console.log('n3')
  }

  Callback_calcDistance(testres) {
    //do something with testres
    console.log(testres)
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
    this.autocompleteItems = [];
    this.stationstart = this.startstation
    // let waypts = [{
    //   location: this.startstation,
    //   stopover: true
    // }];

    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      // console.log(results)
      if (status === 'OK' && results[0]) {
        let marker = new google.maps.Marker({
          position: { lat: results[0].geometry.viewport.na.j, lng: results[0].geometry.viewport.ia.j },
          map: this.map
        });
        //  console.log(results[0].geometry.location);
        //  console.log(results[0].geometry.bounds.ga.j);
        //  console.log(results[0].geometry.bounds.ma.j);       

        // this.clearMarkers();
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
        this.end = { lat: results[0].geometry.viewport.na.j, lng: results[0].geometry.viewport.ia.j };
        console.log(this.end)
        // setstationend
        let compare = [];
        let compare1 = [];
        for (let index in this.Pop) {
          for (let index1 in this.Pop[index]) {
            compare[index1] = this.calculateDistance(this.end.lat, this.Pop[index][index1].lat, this.end.lng, this.Pop[index][index1].lng)
            // for (let index1 = 1; index1 < 7; index1++) {
            //   compare1[index] = this.calculateDistance(this.start.lat,this.Pop[index].gate['gate'+index1].lat,this.start.lng,this.Pop[index].gate['gate'+index1].lng)
            //   console.log(compare1[index]);                   
            // }
          }
        }
        console.log(compare)
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
                this.stationend[index] = { lat: this.Pop[index][index1].lat, lng: this.Pop[index][index1].lng, name: this.Pop[index][index1].name, line: this.Pop[index][index1].line };
                // this.endstation = this.stationend.name
                //  for (let index2 = 1; index2 < 7; index2++) {
                //    compare1[index2] = this.calculateDistance(this.end.lat,this.Pop[index].gate['gate'+index2].lat,this.end.lng,this.Pop[index].gate['gate'+index2].lng)
                //  }
                //  // console.log(compare1);
                //  for (let index3 = 1; index3 < 7; index3++) {
                //    let compogate = compare1[index3];
                //    let countconpare1 = 0;
                //   //  console.log(compogate+'compo');
                //   //  console.log(countconpare1+'countstart');
                //    for (let index4 = 1; index4 < 7; index4++) {
                //     //  console.log(index4+'i');
                //      if (compogate<compare1[index4]) {
                //        countconpare1++;
                //       //  console.log(countconpare1+'count');
                //      }                
                //      if (countconpare1 == 5) {
                //        this.endgate = {lat: this.Pop[index].gate['gate'+index3].lat,lng: this.Pop[index].gate['gate'+index3].lng,gate: this.Pop[index].gate['gate'+index3].description};
                //          this.endgatehtml = this.endgate.gate
                //        console.log(this.endgate.gate)
                //       }     
                //    }
                //  }
              }
            }
          }
        }
        // console.log(compare)
        console.log(this.stationend)
        let pare_en = []
        let countpare_en = 0;
        for (let i_en in this.stationend) {
          pare_en[i_en] = this.calculateDistance(this.end.lat, this.stationend[i_en].lat, this.end.lng, this.stationend[i_en].lng)
        }
        console.log(pare_en)
        for (let i_en in this.stationend) {
          countpare_en = 0;
          let pare = pare_en[i_en]
          for (let i_en1 in this.stationend) {
            if (pare <= pare_en[i_en1]) {
              countpare_en++;
              // console.log(countpare_en)
              // console.log(this.stationend.length)
            }
            if (countpare_en == (this.stationend.length)) {
              // this.p = {index:this.stationend}
              // console.log(i_en)
              this.endstation = { lat: this.stationend[i_en].lat, lng: this.stationend[i_en].lng, name: this.stationend[i_en].name, line: this.stationend[i_en].line };
            }
          }
        }
        console.log(this.endstation)
        //  console.log(this.Pop[this.p.index][this.p.index2])

        console.log(this.stationstart)
        // console.log(this.stationend)
        let connectst = []
        let stline: any
        let dist = []
        let nextst = []
        let point = 0;
        stline = this.stationstart.line
        if (!((stline !== this.endstation.line) && (stline[0] !== this.endstation.line))) {
          nextst = this.stationstart
          nextst[0] = this.stationstart
          console.error(nextst)
          console.error(nextst[0])
        }
        while ((stline !== this.endstation.line) && (stline[0] !== this.endstation.line)) {
          // console.log((stline || stline[0] !== this.endstation.line))
          // console.log((stline == this.endstation.line) && (stline[0] == this.endstation.line))
          if (point == 5) {
            return 0
          }
          connectst = []
          console.log(stline, stline[0], this.endstation.line)
          console.log('startNend no same line')
          for (let index in this.stationconnect) {
            if (stline[1].length > 1) {
              if ((this.stationconnect[index].line == stline[0]) || (this.stationconnect[index].line ==stline[1])) {
                console.log((this.stationconnect[index].line == stline[0]) || (this.stationconnect[index].line ==stline[1]))
                connectst[index] = this.stationconnect[index]
              }
            }
            else if (this.stationconnect[index].line == stline) {
              connectst[index] = this.stationconnect[index]
            }
          }
          console.log('connectstation', connectst)
          for (let index in connectst) {
            console.log('Fif')
            console.log('index', index)
            console.log(connectst[index]['connect'].line.length)
            if (connectst[index]['connect'].line.length > 1) {
              for (let ind in connectst[index]['connect'].line) {
                if (connectst[index]['connect'].line[ind] == this.endstation.line) {
                  if (nextst[point] !== undefined || '') {
                    let pareinconn
                    pareinconn = this.calculateDistance(connectst[index].lat, this.endstation.lat, connectst[index].lng, this.endstation.lng)
                    console.log(pareinconn)
                    if (pareinconn < this.calculateDistance(nextst[point].lat, this.endstation.lat, nextst[point].lng, this.endstation.lng)) {
                      stline = connectst[index]['connect'].line[ind]
                      nextst[point] = connectst[index]
                      console.log(nextst[point])
                      console.log(stline)
                    }
                  } else {
                    stline = connectst[index]['connect'].line[ind]
                    nextst[point] = connectst[index]
                    console.log(nextst[point])
                    console.log(stline)
                  }
                }
                else {
                  console.log(connectst[index]['connect']['connectTo'][ind])
                  dist[index] = this.calculateDistance(connectst[index].lat, this.endstation.lat, connectst[index].lng, this.endstation.lng)
                  // console.log(dist)
                }
                console.error('nextstationconnect', this.stationconnect[connectst[index]["connect"]['connectTo'][ind]]['line'])
              }
              // console.log(stline)
            } else {
              console.log('Felse')
              if (connectst[index]['connect'].line == this.endstation.line) {
                console.log('Sif')
                stline = connectst[index]['connect'].line
                nextst[point] = connectst[index]
                console.log(nextst[point])
                console.log(stline)
              } else {
                console.log('Selse')
                dist[index] = this.calculateDistance(connectst[index].lat, this.endstation.lat, connectst[index].lng, this.endstation.lng)
                // console.log(dist)
              }
            }
          }
          let sizedist = 0
          for (let i in dist) {
            sizedist++
          }
          console.log(dist)
          // console.log(sizedist)
          console.log('Ofor')
          let countcompare = 0;
          if (nextst[point] == undefined || '') {
            console.log('in if')
            for (let index in dist) {
              let countcompare = 0;
              let compare = dist[index]
              for (let index1 in dist) {
                if (compare < dist[index1]) {
                  countcompare++
                  // console.log(countcompare)
                }
                if (countcompare == sizedist - 1) {
                  nextst[point] = connectst[index]
                  console.log(connectst[index])
                  stline = connectst[index]['connect'].line
                  console.log(nextst[point])
                  console.log(stline)
                }
              }
            }
          } else
            console.log('m,m,m,m,')
          point++
        }
        console.log(dist)
        console.error(nextst)
        console.error(stline)


        var goo = google.maps,
          map = new goo.Map(document.getElementById('map'), {
            center: this.end,
            zoom: 10
          }),
          App = {
            map: map,
            bounds: new google.maps.LatLngBounds(),
            directionsService: new google.maps.DirectionsService(),
            directionsDisplay1: new google.maps.DirectionsRenderer({
              map: map,
              preserveViewport: true,
              suppressMarkers: true,
              polylineOptions: { strokeColor: 'red' },
            }),
            directionsDisplay2: new google.maps.DirectionsRenderer({
              map: map,
              preserveViewport: true,
              suppressMarkers: true,
              polylineOptions: { strokeColor: 'blue' },
            }),
            directionsDisplay3: new google.maps.DirectionsRenderer({
              map: map,
              preserveViewport: true,
              suppressMarkers: true,
              polylineOptions: { strokeColor: 'green' },
            }),
            directionsDisplay4: new google.maps.DirectionsRenderer({
              map: map,
              preserveViewport: true,
              suppressMarkers: true,
              polylineOptions: { strokeColor: 'red' },
            }),
          },
          startLeg = {
            origin: this.start,
            destination: { lat: this.startstation.lat, lng: this.startstation.lng },
            travelMode: 'DRIVING'
          },
          connLeg = {
            origin: this.startstation,
            destination: { lat: nextst[0].lat, lng: nextst[0].lng },
            travelMode: 'TRANSIT',
            transitOptions: {
              modes: ['TRAIN', 'SUBWAY'],
              routingPreference: 'LESS_WALKING',
              // routingPreference: 'FEWER_TRANSFERS',
            },
          },
          connLeg2 = {
            origin: { lat: nextst[0].lat, lng: nextst[0].lng },
            destination: { lat: this.endstation.lat, lng: this.endstation.lng },
            travelMode: 'TRANSIT',
            transitOptions: {
              modes: ['TRAIN', 'SUBWAY'],
              routingPreference: 'LESS_WALKING',
              // routingPreference: 'FEWER_TRANSFERS',
            },
          },
          midLeg = {
            origin: this.startstation,
            destination: { lat: this.endstation.lat, lng: this.endstation.lng },
            travelMode: 'TRANSIT',
            transitOptions: {
              modes: ['TRAIN', 'SUBWAY'],
              // routingPreference: 'LESS_WALKING',
              routingPreference: this.routing,
            },
          },
          endLeg = {
            origin: { lat: this.endstation.lat, lng: this.endstation.lng },
            destination: this.end,
            travelMode: 'TRANSIT',
            transitOptions: {
              modes: ['TRAIN', 'SUBWAY'],
              routingPreference: 'LESS_WALKING',
              // routingPreference: 'FEWER_TRANSFERS',
            },
          };

        App.directionsService.route(startLeg, function (result, status) {
          if (status === 'OK') {
            App.directionsDisplay1.setDirections(result);
            App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
          }
        });
        if (nextst != []) {
          App.directionsService.route(connLeg, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              App.directionsDisplay2.setDirections(result);
              App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
            }
          });
          App.directionsService.route(connLeg2, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              App.directionsDisplay3.setDirections(result);
              App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
            }
          });
          App.directionsService.route(endLeg, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              App.directionsDisplay4.setDirections(result);
              App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
            }
          });
        } else {
          App.directionsService.route(midLeg, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              App.directionsDisplay2.setDirections(result);
              App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
            }
          });
          App.directionsService.route(endLeg, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              App.directionsDisplay3.setDirections(result);
              App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
            }
          });
        }



        this.directionsDisplay.setMap(this.map);
      }
    })
    // console.log(this.n)
    // console.log(this.p)
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
