import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { UploaderModule } from '../../src/app/app';
import { MeepoCoreModule, MeepoCoreServiceModule } from 'meepo-core';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UploaderModule,
    MeepoCoreModule.forRoot(),
    MeepoCoreServiceModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

