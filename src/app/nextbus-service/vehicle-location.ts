export class Vehicle {
    id: string;
    lon: string;
    lat: string;
    routeTag: string;
    predictable: string;
    speedKmHr: string;
    dirTag: string;
    heading: string;
    secsSinceReport: string;
    leadingVehicleId: string;
}


export class VehicleLocations {
    vehicle: Vehicle[];
    epochTime: string;

    constructor(vehicle: Vehicle[], time: string) {
        this.vehicle = vehicle;
        this.epochTime = time;
    }
}