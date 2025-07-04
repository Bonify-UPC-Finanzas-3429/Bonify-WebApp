import { Routes } from '@angular/router';
import {HomeComponent} from './public/pages/home/home.component';
import {UserProfileComponent} from './profile/pages/user-profile/user-profile.component';
import {ProfileListComponent} from './profile/pages/profile-list/profile-list.component';
import {BondsPageComponent} from './bonds/pages/bonds-page/bonds-page.component';
import {BondDetailsComponent} from './bonds/pages/bond-details/bond-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile/:id', component: UserProfileComponent },
  { path: 'management', component: ProfileListComponent },
  { path: 'bonds/:userId', component: BondsPageComponent },
  { path: 'bonds/:userId/details/:bondId', component: BondDetailsComponent }
];
