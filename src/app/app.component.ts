import { Component, OnInit, ViewChild } from '@angular/core';
import { SfMuniRouteComponent } from './sf-muni-route/sf-muni-route.component';
import { Route } from './nextbus-service/route';
import { NextBusService } from './nextbus-service/nextbus.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('draw') draw: SfMuniRouteComponent;
  routeList: Observable<Route[]>;
  title = 'SF Muni Routes';
  
  constructor(private nextBusService: NextBusService) {}

  toggleCheckbox(index: number) {
    this.nextBusService.toggleRouteSelection(index);
  }

  selectAllRoute() {
    this.nextBusService.selectAllRoute();
  }    

  deselectAllRoute() {
    this.nextBusService.deselectAllRoute();
  }    

  ngOnInit() {
    this.routeList = this.nextBusService.routeListObservable;
    this.nextBusService.getRouteList();
    this.routeList.subscribe();
  }


  printVehicleInfo(tag){
    var v, x;
    const that=this;

    v=this.draw.currentVehicleLocations[tag].vehicle;
    /*v.forEach(element => {
      x=element.
    });*/
    console.log(v);
    return v;
  }
}
