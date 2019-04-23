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
 Destination: any ='';
 directionsService = new google.maps.DirectionsService;
 directionsDisplay = new google.maps.DirectionsRenderer;
 site = {
   Lat : '13.7501304',
   Lng: '100.5213145'
 };
 item: any;
 drawerOptions: any;
 public Pop: any;
 public kartoon: any;
 start: any; end: any;
 stationstart = [];
 stationend: any;
 startgate: any;
 connectgate: any;
 endgate: any;
 startgatehtml: any;
 endgatehtml: any;
 routing: any;
 startstation: any;
 connectstation:any;
 connectstationhtml: any;
 endstation: any;
 nextstation: any;
 previousstation : any;
 nextstationhtml:any;
 n: any;
 p: any;
 Pink: any;
 Green: any;
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
         this.geocoder = new google.maps.Geocoder;
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
       ionViewWillEnter(){
         console.log('l')
         this.tabBarElement.style.display = 'none';
           setTimeout(() => {
             this.splash = false;
             this.tabBarElement.style.display = 'flex';
           }, 4000);
        
       }
       ionViewDidLoad(){
         console.log('ll')
         this.storage.get('intro-done').then(done => {
           if (done) {
             this.storage.set('intro-done', false);
             this.navCtrl.setRoot(IntroPage);
           }
         });
         // this.getDataFromFirebase().then(data =>{
            
         //   this.Pop = data as any;
         //   this.navCtrl.push(ContentDrawer, {
         //     Petch :this.Pop
         //   });
         // });
         this.getPosition();
       }
       ionViewDidEnter(){
         console.log('lll')
         this.storage.set('intro-done', true);
       }
      
       // Calculate Distance
       calculateDistance(lat1:number,lat2:number,long1:number,long2:number){
         let p = 0.017453292519943295;    // Math.PI / 180
         let c = Math.cos;
         let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
         let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
         // console.log(dis);
         return dis;
       }

       getDataFromFirebase(){return new Promise((resolve, reject) => {
         this.db.list('/Station/').valueChanges()
         .subscribe(
           data => {
             this.Pop = data;
             console.log(this.Pop)
             resolve(this.Pop) 
           },
           );
           // this.db.list('/Station/0').valueChanges()
           // .subscribe(
           //   data => {
           //     this.Pink = data;
           //     console.log(this.Pink)
           //     resolve(this.Pink)
           //   },
           //   );
           // this.db.list('/Station/1').valueChanges()
           // .subscribe(
           //   data => {
           //     this.Green = data;
           //     console.log(this.Green)
           //     resolve(this.Green)
           //   },
           //   );
         });
        
        
       }
      
      
       getPosition():any{
         this.geolocation.getCurrentPosition().then(response => {
           this.loadMap(response);
         })
         .catch(error =>{
           console.log(error);
         })
       }
      
       loadMap(position: Geoposition){
         let latitude = position.coords.latitude;
         let longitude = position.coords.longitude;

         // create a new map by passing HTMLElement
         let mapEle: HTMLElement = document.getElementById('map');
        
         // create LatLng object
         let myLatLng = {lat: latitude, lng: longitude};
         this.start = myLatLng;
         // create map
         this.map = new google.maps.Map(mapEle, {
           center: myLatLng,
           zoom: 12
         });
         google.maps.event.addListenerOnce(this.map, 'idle', () => {
          
           this.getDataFromFirebase().then(data =>{
            
             this.Pop = data as any;

             let marker1  = new google.maps.Marker({
                   position: myLatLng,
                     map: this.map,
                     title: 'AQUI ESTOY!'
                   });

             // test compare Locate
             let compare = [];
             let compare1 = [];
             for (let index = 0; index < this.Pop.length; index++) {               
               for (let index1 in this.Pop[index]) {
                 compare[index1] = this.calculateDistance(this.start.lat,this.Pop[index][index1].lat,this.start.lng,this.Pop[index][index1].lng)
                 // for (let index1 = 1; index1 < 7; index1++) {
                   //   compare1[index] = this.calculateDistance(this.start.lat,this.Pop[index].gate['gate'+index1].lat,this.start.lng,this.Pop[index].gate['gate'+index1].lng)
                   //   console.log(compare1[index]);                   
                   // }
                  }
                  // console.log(this.start);
                  // console.log(compare);
                  
                }
                console.log(compare)
             // mark End location
            for (let index in this.Pop) {

             for (let index1 in this.Pop[index]) {
               let compo = compare[index1];
               let countconpare = 0;
              //  console.log(index1)
              //  console.log(compo)
               for (let index2 in this.Pop[index]) {
                //  console.log(index2)
                // let compare = this.Pop[index];     
                // console.log(compare[index2])            
                 if (compo<compare[index2]) {
                   countconpare++;
                  //  console.log(countconpare)
                  }
                  var keys = Object.keys(this.Pop[index]);
                  //  console.log(keys.length)
                 if (countconpare == ((keys.length-1))){
                  //  console.log('kaissja')
                  //  console.log(index)
                   this.stationstart[index] = {lat: this.Pop[index][index1].lat,lng: this.Pop[index][index1].lng,name: this.Pop[index][index1].name,line: this.Pop[index][index1].line};
                    console.log(this.stationstart)
                   // this.stationstart = {lat: this.Pop[8].lat,lng: this.Pop[8].lng,name: this.Pop[8].name,line: this.Pop[8].line};
                  //  this.startstation = this.stationstart[index].name
                  //  console.log(this.startstation)
                  //  console.log(this.stationstart)
                   this.n = index2
                   // ,gate: this.Pop[index].gate
                   // this.stationstart = {lat: this.Pop[13].lat,lng: this.Pop[13].lng,name: this.Pop[13].name,line: this.Pop[13].line};
                   // for (let index2 = 1; index2 < 7; index2++) {
                   //   compare1[index2] = this.calculateDistance(this.start.lat,this.Pop[index].gate['gate'+index2].lat,this.start.lng,this.Pop[index].gate['gate'+index2].lng)
                   // }
                   // console.log(compare1);
                   // for (let index3 = 1; index3 < 7; index3++) {
                   //   let compogate = compare1[index3];
                   //   let countconpare1 = 0;
                   //   // console.log(compogate+'compo');
                   //   // console.log(countconpare1+'countstart');
                   //   for (let index4 = 1; index4 < 7; index4++) {
                   //     // console.log(index4+'i');
                   //     if (compogate<compare1[index4]) {
                   //       countconpare1++;
                   //       // console.log(countconpare1+'count');
                   //     }                
                   //     if (countconpare1 == 5) {
                   //       this.startgate = {lat: this.Pop[index].gate['gate'+index3].lat,lng: this.Pop[index].gate['gate'+index3].lng,gate: this.Pop[index].gate['gate'+index3].description};
                   //     }     
                   //   }

                   // }
                 }
               }
             }
             // this.startgatehtml = this.startgate.gate;
            }
            let pare_st = []
            let countpare_st =0;
                   for (let i_st in this.stationstart) {
                     pare_st[i_st] = this.calculateDistance(this.start.lat,this.stationstart[i_st].lat,this.start.lng,this.stationstart[i_st].lng)               
                    }
                    // console.log(pare_st)
                  for (let i_st in this.stationstart) {
                    let pare = pare_st[i_st]
                    for (let i_st1 in this.stationstart) {
                      
                      if (pare<pare_st[i_st1]) {
                        // console.log('[]][]')
                        countpare_st++;
                        // console.log(countpare_st)
                      }      
                      if (countpare_st == (this.stationstart.length-1)) {
                        this.startstation = {lat: this.stationstart[i_st].lat,lng: this.stationstart[i_st].lng,name: this.stationstart[i_st].name,line: this.stationstart[i_st].line};   
                      }         
                    }
                  }
                  console.log(this.startstation.name)
            
         mapEle.classList.add('show-map');
       });
     })
     // });     
}

 updateSearchResults(){
   if (this.autocomplete.input == '') {
     this.autocompleteItems = [];
     return;
   }
   this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
     (predictions, status) => {
       this.autocompleteItems = [];
       if(predictions){
         this.zone.run(() => {
           predictions.forEach((prediction) => {
             this.autocompleteItems.push(prediction);
           });
         });
       }
   });
 }

 selectSearchResult(item):any{
   this.clearMarkers();
   this.autocompleteItems = [];
   // console.log(this.Pop);
   let waypts = [{location: this.stationstart,
                 stopover: true}];
  
  
  

   this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
     console.log(results)
     if(status === 'OK' && results[0]){
       let marker = new google.maps.Marker({
         position: {lat: results[0].geometry.viewport.na.j,lng: results[0].geometry.viewport.ia.j},
         map: this.map
       });
       // console.log(results[0].geometry.location);
       // console.log(results[0].geometry.bounds.ga.j);
       // console.log(results[0].geometry.bounds.ma.j);       
      
       // this.clearMarkers();
       this.markers.push(marker);
       this.map.setCenter(results[0].geometry.location);
       this.end = {lat: results[0].geometry.viewport.na.j,lng: results[0].geometry.viewport.ia.j};

        // setstationend
        let compare = [];
        let compare1 = [];
        for (let index in this.Pink) {
          compare[index] = this.calculateDistance(this.end.lat,this.Pink[index].lat,this.end.lng,this.Pink[index].lng)
          // for (let index1 = 1; index1 < 7; index1++) {
          //   compare1[index] = this.calculateDistance(this.start.lat,this.Pop[index].gate['gate'+index1].lat,this.start.lng,this.Pop[index].gate['gate'+index1].lng)
          //   console.log(compare1[index]);                   
          // }
        }
       
        for (let index = 0; index < 14; index++) {
          let compo = compare[index];
          let countconpare = 0;
          for (let index1 = 0; index1 < 14; index1++) {
            if (compo<compare[index1]) {
              countconpare++;
            }
            if (countconpare == 13){
              this.p = index
              this.stationend = {lat: this.Pop[index].lat,lng: this.Pop[index].lng,line: this.Pop[index].line,name: this.Pop[index].name};
              this.endstation = this.stationend.name
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
       //  console.log(this.Pop[this.p])
        console.log(this.stationstart)
       //  console.log(this.stationend)
     //    if (this.stationstart.line == 'green' && this.stationend.line == 'blue') {
     //     this.connectstation = this.Pop[7]
     //     this.connectstationhtml = this.connectstation.name
     //     this.connectgate = 'ประตู6'
     //      this.routing = 'LESS_WALKING'
     //      this.nextstation = this.Pop[this.n+1].name
     //      if (this.stationend.name == this.Pop[10].name) {
     //        this.previousstation = this.Pop[this.p-3].name
     //      } else{
     //        this.previousstation = this.Pop[this.p-1].name
     //      }
     //    } else {
     //       if (this.stationstart.line == 'blue' && this.stationend.line == 'green') {
     //     this.connectstation = this.Pop[8]
     //     this.connectstationhtml = this.connectstation.name
     //     this.connectgate = 'ประตู3'
     //      this.routing = 'FEWER_TRANSFERS'
     //      if (this.stationstart.name == this.Pop[10].name) {
     //        this.nextstation = this.Pop[this.n-3].name
     //      } else {
     //       this.nextstation = this.Pop[this.n+1].name            
     //      }
     //      if (this.stationend.name == this.Pop[7].name) {
     //       this.previousstation = this.Pop[this.p+3].name
     //     } else{
     //       this.previousstation = this.Pop[this.p+1].name
     //     }
     //    }
     //    else if (this.stationstart.line == 'green' && this.stationend.line == 'skyblue'){
     //     this.connectstation = this.Pop[1]
     //     this.connectstationhtml = this.connectstation.name
     //     this.connectgate = 'ประตู1'
     //     this.routing = 'LESS_WALKING'
     //     if (this.n>1) {
     //       this.nextstation = this.Pop[this.n-1].name
     //     } else if (this.n>0){
     //       this.nextstation = this.Pop[this.n+10].name
     //     } else {
     //       this.nextstation = this.Pop[this.n+1].name           
     //     }
     //     if (this.stationend.name == this.Pop[11].name) {
     //       this.previousstation = ''
     //       this.nextstation = ''
     //     } else{
     //       this.previousstation = this.Pop[this.p-1].name
     //     }
     //    }
     //    else if (this.stationstart.line == 'skybule' && this.stationend.line == 'green'){
     //     this.connectstation = this.Pop[11]
     //     this.connectstationhtml = this.connectstation.name         
     //     this.connectgate = 'ประตู1'
     //     this.routing = 'LESS_WALKING'
     //   }
     //   else if (this.stationstart.line == 'blue' && this.stationend.line == 'skyblue'){
     //     this.connectstation = this.Pop[9]
     //     this.connectstationhtml = this.connectstation.name
     //     this.connectgate = 'ประตู1'
     //     this.routing = 'LESS_WALKING'
     //   }
     //   else if (this.stationstart.line == 'skyblue' && this.stationend.line == 'blue'){
     //     this.connectstation = this.Pop[13]
     //     this.connectstationhtml = this.connectstation.name
     //     this.connectgate = 'ประตู1'
     //     this.routing = 'LESS_WALKING'
     //   }
     //   else
     //   {
     //     this.connectgate = ''
     //   }
     //   if (this.stationstart.line == this.stationend.line ) {
     //     if (this.n>this.p) {
     //       console.log(this.p)
     //       console.log(this.n)
     //       this.nextstation = this.Pop[this.n-1].name
     //       this.previousstation =this.Pop[this.p+1].name
     //     } else {
     //       console.log(this.p)
     //       console.log(this.n)
     //       this.nextstation = this.Pop[this.n+1].name
     //       this.previousstation =this.Pop[this.p-1].name
     //     }
     //   }
     // }
     // console.log(this.connectstation)
       // var goo = google.maps,
       //     map = new goo.Map(document.getElementById('map'), {
       //       center: this.end,
       //       zoom: 10
       //     }),
     //       App = {
     //                   map: map,
     //                   bounds            : new google.maps.LatLngBounds(),
     //                   directionsService : new google.maps.DirectionsService(),   
     //                   directionsDisplay1: new google.maps.DirectionsRenderer({
     //                                         map: map,
     //                                         preserveViewport: true,
     //                                         suppressMarkers : true,
     //                                         polylineOptions : {strokeColor:'red'},
     //                                       }),
     //                   directionsDisplay2: new google.maps.DirectionsRenderer({
     //                                       map: map,
     //                                       preserveViewport: true,
     //                                       suppressMarkers: true,
     //                                       polylineOptions: {strokeColor: 'blue'},
     //                   }),
     //                   directionsDisplay3: new google.maps.DirectionsRenderer({
     //                                       map: map,
     //                                       preserveViewport: true,
     //                                       suppressMarkers: true,
     //                                       polylineOptions: {strokeColor: 'green'},
     //                   }),
     //                   directionsDisplay4: new google.maps.DirectionsRenderer({
     //                     map: map,
     //                     preserveViewport: true,
     //                     suppressMarkers: true,
     //                     polylineOptions: {strokeColor: 'red'},
     // }),
     //   },
     //   startLeg = {
     //     origin: this.start,
     //     destination: this.stationstart,
     //     travelMode: 'DRIVING'
     //   },
     //   connLeg = {
     //     origin: this.stationstart,
     //     destination: {lat : this.connectstation.lat, lng: this.connectstation.lng},
     //     travelMode: 'TRANSIT',
     //     transitOptions: {
     //       modes: ['TRAIN','SUBWAY'],
     //       routingPreference: 'LESS_WALKING',
     //       // routingPreference: 'FEWER_TRANSFERS',
     //     },
     //   },
     //   connLeg2 = {
     //     origin: {lat : this.connectstation.lat, lng: this.connectstation.lng},
     //     destination: this.stationend,
     //     travelMode: 'TRANSIT',
     //     transitOptions: {
     //       modes: ['TRAIN','SUBWAY'],
     //       routingPreference: 'LESS_WALKING',
     //       // routingPreference: 'FEWER_TRANSFERS',
     //     },
     //   },
     //   midLeg = {
     //     origin: this.stationstart,
     //     destination: this.stationend,
     //     travelMode: 'TRANSIT',
     //     transitOptions: {
     //       modes: ['TRAIN','SUBWAY'],
     //       // routingPreference: 'LESS_WALKING',
     //       routingPreference: this.routing,
     //     },
     //   },
     //   endLeg = {
     //     origin: this.stationend,
     //     destination: this.end,
     //     travelMode: 'TRANSIT',
     //     transitOptions: {
     //       modes: ['TRAIN','SUBWAY'],
     //       routingPreference: 'LESS_WALKING',
     //       // routingPreference: 'FEWER_TRANSFERS',
     //     },
        
     //   };

     //   App.directionsService.route(startLeg, function(result, status){
     //     if (status === 'OK') {
     //       App.directionsDisplay1.setDirections(result);
     //       App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
     //     }
     //   });
     //   if (this.connectstation != '') {
     //     App.directionsService.route(connLeg, function(result, status) {
     //       if (status == google.maps.DirectionsStatus.OK) {
     //         App.directionsDisplay2.setDirections(result);
     //         App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
     //       }
     //     });
     //     App.directionsService.route(connLeg2, function(result, status) {
     //       if (status == google.maps.DirectionsStatus.OK) {
     //         App.directionsDisplay3.setDirections(result);
     //         App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
     //       }
     //     });
     //     App.directionsService.route(endLeg, function(result, status) {
     //       if (status == google.maps.DirectionsStatus.OK) {
     //         App.directionsDisplay4.setDirections(result);
     //         App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
     //       }
     //     });
     //   } else {
     //     App.directionsService.route(midLeg, function(result, status) {
     //       if (status == google.maps.DirectionsStatus.OK) {
     //         App.directionsDisplay2.setDirections(result);
     //         App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
     //       }
     //     });
     //     App.directionsService.route(endLeg, function(result, status) {
     //       if (status == google.maps.DirectionsStatus.OK) {
     //         App.directionsDisplay3.setDirections(result);
     //         App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
     //       }
     //     });
       // }
      

      
       this.directionsDisplay.setMap(this.map);
     }
   })
   // console.log(this.n)
   // console.log(this.p)
   this.p = ''
   this.connectstation = ''
 }

 clearMarkers(){
   for (var i = 0; i < this.markers.length; i++) {
     // console.log(this.markers[i])
     this.markers[i].setMap(null);
   }
   this.markers = [];
 }

 calculateAndDisplayRoute() {
   let directionService = new google.maps.DirectionsService;
   let directionDisplay = new google.maps.DirectionsRenderer;
   const map = new google.maps.Map(document.getElementById('map'),{
     zoom: 7,
     center: {lat: 41.85,lng: -87.65}
   });
   directionDisplay.setMap(map);

   if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function (position) {
       var pos = {
         lat : position.coords.latitude,
         lng : position.coords.longitude,
       } ;
       map.setCenter(pos);
     }, function(){

     });
   } else {
     
   }
    directionService.route({
     origin: '',
     destination: '',
     travelMode: 'DRIVING'
   }, function(response, status){
     if(status == 'OK') {
       directionDisplay.setDirections(response);
     } else {
       window.alert('Directions request failed due to ' + status);
     }
   }) 
 } 
 }
