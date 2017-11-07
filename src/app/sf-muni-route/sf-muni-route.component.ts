import { Component, OnChanges, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Route, RouteDetails } from '../nextbus-service/route';
import { NextBusService } from '../nextbus-service/nextbus.service';
import { VehicleLocations, Vehicle } from '../nextbus-service/vehicle-location';
import * as d3 from 'd3';

@Component({
  selector: 'sf-muni-route',
  templateUrl: './sf-muni-route.component.html',
  styleUrls: ['./sf-muni-route.component.css']
})
export class SfMuniRouteComponent implements OnInit {
  routeList: Observable<Route[]>;
  routeDetails: Map<string, RouteDetails>;
  selectedRouteList: Route[];
  currentVehicleLocations: Map<string, VehicleLocations> = new Map();
  intervalHandles: Map<string, any> = new Map();
  @ViewChild('map') private chartContainer: ElementRef;
  freewaysJSON: any;
  arteriesJSON: any;
  streetsJSON: any;
  neighborsJSON: any;
  projection: any;
  vis: any;
  tooltip: any;



  constructor(private nextBusService: NextBusService) { }

  ngOnInit() {
    this.routeList = this.nextBusService.routeListObservable;
    this.getData();
  }

  getData() {
    d3.json("../assets/sfmaps/freeways.json", fJson => {
      this.freewaysJSON = fJson;
      d3.json("../assets/sfmaps/arteries.json", aJson => {
        this.arteriesJSON = aJson;
        d3.json("../assets/sfmaps/streets.json", sJson => {
          this.streetsJSON = sJson;
          d3.json("../assets/sfmaps/neighborhoods.json", nJson => {
            this.neighborsJSON = nJson;
            this.drawAll();
          })
        })
      });
    });
  }

  getProjection(width: number, height: number) {
    this.projection = d3.geoProjection((x, y) => { return [x, y];})
    .precision(0)
    .scale(1)
    .translate([0, 0]);

    let bounds = d3.geoPath().projection(this.projection).bounds(this.freewaysJSON);
    let scale  = .8 / Math.max((bounds[1][0] - bounds[0][0]) / width, (bounds[1][1] - bounds[0][1]) / height);
    let translx = (width - scale * (bounds[1][0] + bounds[0][0])) / 2+160;
    let transly = (height - scale * (bounds[1][1] + bounds[0][1])) / 2+50;

    this.projection
      .scale(scale)
      .translate([translx, transly]);
  }

  startTimerForSingleRoute(routeTag) {
    const that = this;
    const handle = setInterval(function timer() {
      that.nextBusService.getVehicleLocation(routeTag)
        .subscribe((newVehicleLocations: VehicleLocations) => {
          let oldVehiclesLocations: VehicleLocations = that.currentVehicleLocations[routeTag];
          that.currentVehicleLocations[routeTag] = newVehicleLocations;
          if(!oldVehiclesLocations) {
            oldVehiclesLocations = new VehicleLocations([], '0');
          }
          let newLocations = newVehicleLocations.vehicle;
          let oldLocations = oldVehiclesLocations.vehicle;
          if(newLocations && newLocations.length) {
            newLocations = newLocations.filter(v => v.predictable==='true');
          } else {
            newLocations = [];
          }
          if(oldLocations && oldLocations.length) {
            oldLocations = oldLocations.filter(v => v.predictable==='true');
          } else {
            oldLocations = [];
          }
          that.drawVehicles(newLocations, oldLocations, routeTag);
        });
      return timer;
    }(), 15*1000);
    this.intervalHandles[routeTag] = handle;
  }

  drawAll() {
    const element = this.chartContainer.nativeElement;
    const height = 750;
    const width  = 1000;
    
    this.getProjection(width, height);
    this.vis = d3.select(element)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    
    this.tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden");
    
    
    this.drawNeightborhoods();
    this.drawFreeWays();
    this.drawArteries();
    this.drawStreets();
    this.drawRoutes();
  }


  drawVehicles(newLocations: Vehicle[], oldLocations: Vehicle[], tag: string) {

    oldLocations.filter(oldV => !newLocations.find(newV => newV.id === oldV.id)).forEach(oldV => {
      this.vis.selectAll(".g"+tag).selectAll("rect[id='" + oldV.id + "']").remove();
    });

    const that = this;

    this.vis.selectAll(".g"+tag).selectAll("rect")
      .data(newLocations, function(d) {return d.id;})
      .transition()
      .duration(15000)
      .delay(0)
      .attr("x", function(d) { return that.projection([d.lon, d.lat])[0]; })
      .attr("y", function(d) { return that.projection([d.lon, d.lat])[1]; })
      .attr("width", 12)
      .attr("height", 11);

    this.vis.selectAll(".g"+tag).selectAll("rect")
      .data(newLocations, function(d) {return d.id;})
      .enter()
      .append("rect")
      .attr("x", function(d) { return that.projection([d.lon, d.lat])[0]; })
      .attr("y", function(d) { return that.projection([d.lon, d.lat])[1]; })
      .attr("id", function(d){ return d.id; })
      .attr("class", "vehicles")
      .attr("width", 12)
      .attr("height", 11)
      .on("mouseover", function(d){return that.tooltip.style("visibility", "visible").text(d.routeTag+d.id);})
      .on("mousemove", function(){return that.tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){return that.tooltip.style("visibility", "hidden");});  
    
  }


  private drawPaths(json, style) {
    const paths = d3.geoPath().projection(this.projection);    
    this.vis.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("class", style)
      .attr("d", paths);
  }

  drawFreeWays() {
    this.drawPaths(this.freewaysJSON, "freeways");
  }

  drawArteries() {
    this.drawPaths(this.arteriesJSON, "arteries");
  }

  drawStreets() {
    this.drawPaths(this.streetsJSON, "streets");
  }

  private drawPolygons(coordinates) {
    this.vis.append("polygon")
    .attr("class", "neighborhoods")
    .attr("points", coordinates.map(p => {
      return this.projection(p).join(', ');
    }));
  }

  drawNeightborhoods() {
    this.neighborsJSON.features.forEach(fet => {
      if(fet.geometry.type === 'Polygon') {
        this.drawPolygons(fet.geometry.coordinates[0]);
      } else if(fet.geometry.type === 'MultiPolygon') {
        fet.geometry.coordinates.forEach(poly => {
          if(poly.size === 1) {
            this.drawPolygons(poly[0]);
          }  else {
            poly.forEach(cor => {
              this.drawPolygons(cor);
            })
          }
        })
      }
    })
  }

  private getPathString(path, projection) {
    var str;
    str = 'M '+projection([path.point[0].lon, path.point[0].lat])[0]+' '+projection([path.point[0].lon, path.point[0].lat])[1];
    for(let i=1; i<path.point.length; i++) {
      str = str + ' L '+projection([path.point[i].lon, path.point[i].lat])[0]+' '+projection([path.point[i].lon, path.point[i].lat])[1];
    }
    return str;
  }

  private drawSingleRoute(route: RouteDetails, tag: string) {
    const paths = route.path.map(p => this.getPathString(p, this.projection));
    
    paths.forEach(p => {
      this.vis.selectAll(".g"+tag)
        .append("path")
        .attr("class", "routes")
        .attr("d", p)
        .style("stroke", '#'+route.color);
    });

    route.stop.forEach(s => {
      this.vis.selectAll(".g"+tag)
        .append("circle")
        .attr("class", "busstops")
        .attr("cx", this.projection([s.lon, s.lat])[0])
        .attr("cy", this.projection([s.lon, s.lat])[1])
        .attr("r", 2)
    });
  }

  drawRoutes() {
    this.routeList.subscribe((routes: Route[]) => {
      if(routes && routes.length) {
        this.vis.selectAll("g")
          .data(routes, function(d) {return d.tag;})
          .enter()
          .append("g")
          .attr("class", function(d) {return "g"+d.tag;})

        if(this.selectedRouteList) {
          this.selectedRouteList
            .filter(sr => routes.find(r => r.tag === sr.tag && !r.selected))
            .forEach(sr => {
              this.vis.selectAll(".g"+sr.tag).remove();
              clearInterval(this.intervalHandles[sr.tag]);
            });

          routes.filter(r => r.selected && !this.selectedRouteList.find(sr => r.tag === sr.tag))
            .forEach(route => {
              this.drawSingleRoute(this.routeDetails[route.tag], route.tag);
              this.startTimerForSingleRoute(route.tag);
            })
          this.selectedRouteList = routes.filter(r => r.selected);
        } else {
          this.selectedRouteList = routes.filter(r => r.selected);
          this.routeDetails = new Map<string, RouteDetails>();
          routes.forEach(route => {
            this.nextBusService.getRouteDetails(route.tag).subscribe(details => {
              this.routeDetails[route.tag] = details;
              if(route.selected) {
                this.drawSingleRoute(details, route.tag);
              }
            });
          });
        }
      }

    
    });      
  }
}
