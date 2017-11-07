import { TestBed, async } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { NextBusService } from './nextbus-service/nextbus.service';
import { NextBusServiceStub } from '../testing/nextbus-service-stub';
import { Route } from './nextbus-service/route';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ { provide: NextBusService, useClass: NextBusServiceStub } ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const app: AppComponent = fixture.debugElement.componentInstance;
    expect(compiled.querySelector('h1').textContent).toContain(app.title);
  }));

  it('should retrieve a list of routes from NextBusService', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app: AppComponent = fixture.debugElement.componentInstance;
    let len = 7;
    app.routeList.subscribe((routes: Route[]) => {
      expect(routes.length).toBe(len);
    });
    len = 7;
  });

  it('should be able to select and unselect routes with user mouse clicks', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const app: AppComponent = fixture.debugElement.componentInstance;
    let selNum = 0;
    app.routeList.subscribe((routes: Route[]) => {
      expect(routes.filter(r => r.selected).length).toBe(selNum);
    });
    const buttons: any[] = compiled.querySelectorAll("button");
    expect(buttons.length).toBe(2);
    selNum = 7;
    buttons[0].click();
    selNum = 0;
    buttons[1].click();
  });


});
