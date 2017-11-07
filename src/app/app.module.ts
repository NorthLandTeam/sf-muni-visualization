import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { NextBusService } from './nextbus-service/nextbus.service';
import { SfMuniRouteComponent } from './sf-muni-route/sf-muni-route.component';

@NgModule({
  declarations: [
    AppComponent,
    SfMuniRouteComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [ NextBusService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
