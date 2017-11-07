export class Route {
    title: string;
    tag: string;
    selected: boolean;
}

export class BusStop {
    lon: string;
    lat: string;
    title: string;
    stopId: string;
    tag: string;
}

export class RoutePoint {
    lon: string;
    lat: string;
}

export class RoutePath {
    point: RoutePoint[];
}

export class RouteDetails {
    stop: BusStop[];
    path: RoutePath[];
    color: string;
    tag: string;

    constructor(stop: BusStop[], path: RoutePath[], color: string, tag: string){
        this.stop = stop;
        this.path = path;
        this.color = color;
        this.tag = tag;
    };
}