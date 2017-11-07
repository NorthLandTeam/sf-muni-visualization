import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SfMuniRouteComponent } from './sf-muni-route.component';
import { NextBusService } from '../nextbus-service/nextbus.service';
import { NextBusServiceStub } from '../../testing/nextbus-service-stub';
import { Route } from '../nextbus-service/route';


describe('SfMuniRouteComponent', () => {
  let component: SfMuniRouteComponent;
  let fixture: ComponentFixture<SfMuniRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SfMuniRouteComponent ],
      providers: [ { provide: NextBusService, useClass: NextBusServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SfMuniRouteComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get data from json files', () => {
    const spy = spyOn(component, 'getData').and.callFake(() => {});
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should retrieve list of routes from NextBusService', fakeAsync(() => {
    spyOn(component, 'getData').and.callFake(() => {});
    fixture.detectChanges();
    let len = 0;
    component.routeList.subscribe((routes) => {
      expect(routes.length).toBe(len);
    });
    len = 7;
    tick();
  }));

});
