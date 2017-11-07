import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { Route, RouteDetails } from './route';
import { VehicleLocations } from './vehicle-location';


@Injectable()
export class NextBusService {

    nextBusPath = 'http://webservices.nextbus.com/service/publicJSONFeed?';
    private routeList: Route[] = [];
    private routeListSubject: BehaviorSubject<Route[]> = new BehaviorSubject([]);
    public readonly routeListObservable: Observable<Route[]> = this.routeListSubject.asObservable();

    constructor(private http: Http) { }

    getRouteList() {
        this.http.get(this.nextBusPath+'command=routeList&a=sf-muni')
            .subscribe((res: Response) => {
                let dt = new Date();
                console.log(dt.getTime());
                this.routeList = res.json().route;
                this.deselectAllRoute();
            });
    }

    toggleRouteSelection(index: number) {
        this.routeList[index].selected = !this.routeList[index].selected;
        this.routeListSubject.next(this.routeList);
    }

    selectAllRoute() {
        this.routeList.forEach(r => r.selected = true);
        this.routeListSubject.next(this.routeList);
    }

    deselectAllRoute() {
        this.routeList.forEach(r => r.selected = false);
        this.routeListSubject.next(this.routeList);
    }

    getRouteDetails(tag: string): Observable<RouteDetails> {
        return this.http.get(this.nextBusPath+'command=routeConfig&a=sf-muni&r='+tag)
            .map((res:Response) => {
                const resRoute = res.json().route;
                return new RouteDetails(resRoute.stop, resRoute.path, resRoute.color, resRoute.tag);
            });
    }
    
    // Assumption: If a vehicle has not changed its location for 5 minutes, then it has stopped
    // calling nextbus service for vehicles changed in the last 5 minutes
    getVehicleLocation(routTag: string): Observable<VehicleLocations> {
        const time = (new Date()).getTime() - 5*60*1000;
        return this.http.get(this.nextBusPath+'command=vehicleLocations&a=sf-muni&r='+routTag+'&t='+time)
            .map((res: Response) => {
                return new VehicleLocations(res.json().vehicle, res.json().lastTime.time);
            });
    }
}

