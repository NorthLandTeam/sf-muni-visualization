import { Observable } from 'rxjs/Rx';
import { RouteDetails, Route } from '../app/nextbus-service/route';
import { VehicleLocations } from '../app/nextbus-service/vehicle-location';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


export class NextBusServiceStub {
    private routeListSubject: BehaviorSubject<Route[]> = new BehaviorSubject([]);
    public readonly routeListObservable: Observable<Route[]> = this.routeListSubject.asObservable();

    routes: Route[] = [
        { "title": "E-Embarcadero", "tag": "E", "selected": false },
        { "title": "F-Market & Wharves", "tag": "F", "selected": false },
        { "title": "J-Church", "tag": "J", "selected": false },
        { "title": "KT-Ingleside/Third Street", "tag": "KT", "selected": false },
        { "title": "L-Taraval", "tag": "L", "selected": false },
        { "title": "M-Ocean View", "tag": "M", "selected": false },
        { "title": "N-Judah", "tag": "N", "selected": false }
    ] as Route[];

    getRouteList() {
        this.routeListSubject.next(this.routes);
    }

    toggleRouteSelection(index: number) { }

    selectAllRoute() {
        this.routes.forEach(r => {
            r.selected = true;
        });
        this.routeListSubject.next(this.routes);
    }

    deselectAllRoute() {
        this.routes.forEach(r => {
            r.selected = false;
        });
        this.routeListSubject.next(this.routes);
    }

    getRouteDetails(tag: string): Observable<RouteDetails> {
        return Observable.of(new RouteDetails([], [], '', ''));
    }
    
    getVehicleLocation(routTag: string): Observable<VehicleLocations> {
        return Observable.of(new VehicleLocations([], ''));
    }

}