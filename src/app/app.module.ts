import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

//other
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { UserService } from './shared/user.service';
import { HomeComponent } from './home/home.component';
import { GroupListComponent } from './home/group-list/group-list.component';
import { ProfileComponent } from './user/profile/profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GroupComponent } from './home/group/group.component';
import { PagenotfoundComponent } from './shared/pagenotfound/pagenotfound.component';
import { SchemaComponent } from './shared/schema/schema.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SignUpComponent,
    SignInComponent,
    UserProfileComponent,
    HomeComponent,
    GroupListComponent,
    ProfileComponent,
    GroupComponent,
    PagenotfoundComponent,
    SchemaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forRoot([
      {
        path: 'signup',
        component: UserComponent,
        children: [{ path: '', component: SignUpComponent }],
      },
      {
        path: 'login',
        component: UserComponent,
        children: [{ path: '', component: SignInComponent }],
      },
      {
        path: 'userprofile',
        component: UserProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'schema',
        component: SchemaComponent
      },
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
        children: [
          {
            path: '',
            component: PagenotfoundComponent
          },
          {
            path: 'group',
            component: GroupListComponent
          },

          {
            path: 'group/:id', //:id is dynamic here
            component: GroupComponent,
          },

        ],
        canActivate: [AuthGuard],
      },
    ]),
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthGuard,
    UserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
