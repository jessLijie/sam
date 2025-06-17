import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { ProgramManageComponent } from './program-manage/program-manage.component';
import { SortApplicantsComponent } from './sort-applicants/sort-applicants.component';
import { ViewApplicantsComponent } from './view-applicants/view-applicants.component';

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent,
    FetchDataComponent,
  ],
  imports: [
    NavMenuComponent,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'program-manage',component: ProgramManageComponent},
      { path: 'view-applicants', component: ViewApplicantsComponent},
      { path: 'sort-applicants', component: SortApplicantsComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
