import { Component, OnInit, Input } from '@angular/core';
import { Http } from '@angular/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.css']
})
export class FlightDetailsComponent implements OnInit {

  private url = 'https://api.sandbox.amadeus.com/v1.2/airports/autocomplete?apikey=APIKEY&term=Ord';
  private flightUrl = 'https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=APIKEY&origin=';
  private autocompleteUrl = 'https://api.sandbox.amadeus.com/v1.2/airports/autocomplete?apikey=APIKEY&term=';
  @Input() flightdetails = {numberOfPeople: '', departure: '', destination: '', departureDate: '', returnDate: '' };

  posts: any[];
  total_price: DoubleRange[] = new Array();
  itinaries: any[];
  IsVisible: Boolean;
  outboundStops: number;
  inboundStops: number;
  stopSelected = '';
  classSelected = '';

  //For autocomplete
  searchTerm: FormControl = new FormControl();
  searchTerm2: FormControl = new FormControl();
  searchResult:any[];
  filteredOptions: Observable<string[]>;

  //For radio button(One-way and round trip)
  tripType: string;
  trips: string[] = ['One-way', 'Round-trip'];
  IsRoundTrip: Boolean;
  

  //Variable for flight details
  totalDuration: string;
  desDeparture: any;
  stop1Arrival: any;
  stop1Departure: any;
  desArrival: any;
  originAirport: string;
  stop1Airport: string;
  stop1DepartingAirport: string;
  desAirport: string;
  url1: string;

  constructor(private http: Http) {
    
    this.searchTerm.valueChanges.subscribe(res => {
      this.http.get(this.autocompleteUrl + this.flightdetails.departure)
        .subscribe(response => {
          this.searchResult = response.json();
          console.log(this.searchResult);
        })
    });

    this.searchTerm2.valueChanges.subscribe(res => {
      this.http.get(this.autocompleteUrl + this.flightdetails.destination)
        .subscribe(response => {
          this.searchResult = response.json();
          console.log(this.searchResult);
        })
    });
  }

  setRadio(e: string) {
    if (e == "Round-trip") {
      this.IsRoundTrip = true;
    }
    else {
      this.IsRoundTrip = false;
      this.flightdetails.returnDate = "";
    }
    console.log(this.IsRoundTrip);
  }  
  
  getDetails() {
    this.http.get(this.url)
      .subscribe(response => {
        this.posts = response.json().rootobject;
      });
  }

  getFlightDetails() {
    if (this.flightdetails.returnDate != "") {
      var str = JSON.stringify(this.flightdetails.returnDate);
      str = str.substring(1, 11);
      var strDepartue = JSON.stringify(this.flightdetails.departureDate);
      strDepartue = strDepartue.substring(1, 11);

      console.log(this.flightdetails.numberOfPeople);
      var num = parseInt(this.flightdetails.numberOfPeople);
      this.url1 = this.flightUrl + this.flightdetails.departure + '&destination=' + this.flightdetails.destination + '&departure_date=' + strDepartue + '&return_date=' + str + '&adults=' + num + '&nonstop=' + this.stopSelected + '&travel_class=' + this.classSelected;
      this.IsVisible = true;
    }
    else {
      var str = JSON.stringify(this.flightdetails.departureDate);
      str = str.substring(1, 11);
      console.log(this.flightdetails.numberOfPeople);
      var num = parseInt(this.flightdetails.numberOfPeople);
      this.url1 = this.flightUrl + this.flightdetails.departure + '&destination=' + this.flightdetails.destination + '&departure_date=' + str + '&adults=' + num + '&nonstop=' + this.stopSelected + '&travel_class=' + this.classSelected;
    }
    
    this.http.get(this.url1)
        .subscribe(response => {
          this.posts = response.json().results;
          console.log(this.posts);
          console.log("length " + this.posts.length);

          for (var i = 0; i < this.posts.length; i++) {
            var temp = this.posts[i].fare.total_price;
            this.itinaries = this.posts[i].itineraries;

            for (var j = 0; j < this.posts[i].itineraries.length; j++) {
              //console.log(this.posts[i].itineraries[j]);

              console.log(this.posts[i].itineraries[j].outbound);
              console.log("stops:" + this.posts[i].itineraries[j].outbound.flights.length);

              this.totalDuration = this.posts[i].itineraries[j].outbound.duration;

              //for (var k = 0; k < this.posts[i].itineraries[j].outbound.flights.length; k++) {

              //  console.log(this.posts[i].itineraries[j].outbound.flights[k])
              //  if (this.posts[i].itineraries[j].outbound.flights.length == 2) {
              //    this.numberOfStops = 1;
              //    this.desDeparture = this.posts[i].itineraries[j].outbound.flights[0].departs_at;
              //    this.stop1Arrival = this.posts[i].itineraries[j].outbound.flights[0].arrives_at;
              //    this.stop1Departure = this.posts[i].itineraries[j].outbound.flights[1].departs_at;
              //    this.desArrival = this.posts[i].itineraries[j].outbound.flights[1].arrives_at;

              //    this.originAirport = this.posts[i].itineraries[j].outbound.flights[0].origin.airport;
              //    this.stop1Airport = this.posts[i].itineraries[j].outbound.flights[0].destination.airport;
              //    this.stop1DepartingAirport = this.posts[i].itineraries[j].outbound.flights[1].origin.airport;
              //    this.desAirport = this.posts[i].itineraries[j].outbound.flights[1].destination.airport;
              //  }
              //  if (this.posts[i].itineraries[j].outbound.flights.length == 1) {
              //    this.numberOfStops = 0;
              //    this.desDeparture = this.posts[i].itineraries[j].outbound.flights[0].departs_at;
              //    this.desArrival = this.posts[i].itineraries[j].outbound.flights[0].arrives_at;
              //    this.originAirport = this.posts[i].itineraries[j].outbound.flights[0].origin.airport;
              //    this.desAirport = this.posts[i].itineraries[j].outbound.flights[0].destination.airport;
              //  }

              //}
            }

            // console.log(this.posts[i].fare.price_per_adult);
          }
          //console.log(this.posts);
          //console.log(this.posts[0].fare.total_price);
        });
  }
  ngOnInit() {
    
  }

}
