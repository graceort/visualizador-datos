import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './components/home/home.component';
import { ChartViewComponent } from './components/chart-view/chart-view.component';
import { ApiDashboardComponent } from './components/api-dashboard/api-dashboard.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, ChartViewComponent, ApiDashboardComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    ChartModule,
    TableModule,
      FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
