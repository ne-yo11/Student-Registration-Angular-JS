// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MasterlistComponent } from './masterlist/masterlist.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourselistComponent } from './courselist/courselist.component';
//import your components


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    EnrollmentComponent,
    SidebarComponent,
    MasterlistComponent, //add every new component here to generate import
    CourselistComponent,
    CommonModule
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
