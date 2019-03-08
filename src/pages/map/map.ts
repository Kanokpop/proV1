import { Component, NgZone, Testability } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LoadingController, Item, Chip } from 'ionic-angular';
//import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { database } from 'firebase';
import { NavController } from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  
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
  start: any; end: any;
  site = {
    Lat : '13.7501304',
    Lng: '100.5213145'
  };
  station: any;
  Pop: any;
  kartoon: any;
  item: any;
  drawerOptions: any;
  // stLatLng: string;
  

 

  constructor(
    public navCtrl: NavController,
    public zone: NgZone,
    public geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public db: AngularFireDatabase, 
    
    
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
        }
        
        
        
        ionViewDidEnter(){
          this.getPosition();
          // this.getDataFromFirebase();
          
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
              resolve(this.Pop)  
            },
            );
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
              
              // console.log(this.Pop);
               
              let marker1  = new google.maps.Marker({
                    position: myLatLng,
                      map: this.map,
                      title: 'AQUI ESTOY!'
                    });

              // test compare Locate
              let compare = [];

                for (let index = 0; index < 14; index++) {
                  
                 compare[index] = this.calculateDistance(this.start.lat,this.Pop[index].lat,this.start.lng,this.Pop[index].lng)
                  
                }
                // console.log(compare);
              // mark End location
              let countconpare = 0;
              for (let index = 0; index < 14; index++) {
                let compo = compare[index];
                countconpare = 0;
                for (let index1 = 0; index1 < 14; index1++) {
                   if (compo<compare[index1]) {
                    countconpare++;
                  }
                  if (countconpare == 13){
                    this.station = {lat: this.Pop[index].lat,lng: this.Pop[index].lng};
                  }
                }
              }
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
    console.log(this.station);
    console.log(this.Pop);
    let waypts = [{location: this.station,
                  stopover: true}];
    
    


    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      
      if(status === 'OK' && results[0]){
        let marker = new google.maps.Marker({
          position: {lat: results[0].geometry.viewport.ma.j,lng: results[0].geometry.viewport.ga.j},
          map: this.map
        });
        console.log(results[0].geometry.location);
        // console.log(results[0].geometry.bounds.ga.j);
        // console.log(results[0].geometry.bounds.ma.j);        

        // this.clearMarkers();
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
        this.end = {lat: results[0].geometry.viewport.ma.j,lng: results[0].geometry.viewport.ga.j};
        console.log(this.end);

        var goo = google.maps,
            map = new goo.Map(document.getElementById('map'), {
              center: this.end,
              zoom: 10
            }),
            App = {
                        map: map,
                        bounds            : new google.maps.LatLngBounds(),
                        directionsService : new google.maps.DirectionsService(),    
                        directionsDisplay1: new google.maps.DirectionsRenderer({
                                              map: map,
                                              preserveViewport: true,
                                              suppressMarkers : true,
                                              polylineOptions : {strokeColor:'red'},
                                            }),
                        directionsDisplay2: new google.maps.DirectionsRenderer({
                                            map: map,
                                            preserveViewport: true,
                                            suppressMarkers: true,
                                            polylineOptions: {
                                              strokeColor: 'blue'
                                            }
                        }),
        },
        startLeg = {
          origin: this.start,
          destination: this.station,
          travelMode: 'DRIVING'
        },
        endLeg = {
          origin: this.station,
          destination: this.end,
          travelMode: 'TRANSIT',
          transitOptions: {
            modes: ['TRAIN','SUBWAY'],
            // routingPreference: 'LESS_WALKING',
            routingPreference: 'FEWER_TRANSFERS',
          },
          
        };

        App.directionsService.route(startLeg, function(result, status){
          if (status === 'OK') {
            App.directionsDisplay1.setDirections(result);
            App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
          }
        });

        App.directionsService.route(endLeg, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            App.directionsDisplay2.setDirections(result);
            App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
          }
        });


        // // // test direction
        this.directionsDisplay.setMap(this.map);
        // this.directionsService.route({ 
        // origin:  this.start ,
        // destination: this.end,
        // // waypoints: waypts,
        // optimizeWaypoints: true,
        // travelMode: 'TRANSIT'},
        // (response, status) => {
        // if (status === 'OK') {
        // this.directionsDisplay.setDirections(response);
        // } else {
        // window.alert('Directions request failed due to ' + status);
        // }
        // });

        // this.directionsService.route({
        //   origin:  this.station,
        //   destination: this.end,
        //   // waypoints: waypts,
        //   optimizeWaypoints: true,
        //   travelMode: 'TRANSIT',},
        //   (response, status) => {
        //   if (status === 'OK') {
        //   this.directionsDisplay.setDirections(response);
        //   } else {
        //   window.alert('Directions request failed due to ' + status);
        //   }
        //   });
      }
    })
    
    

  }

  clearMarkers(){
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i])
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