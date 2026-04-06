import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AboutComponent } from './pages/about/about.component';
import { HomeSearchComponent } from './pages/home-search/home-search.component';
import { ListPropertyComponent } from './pages/list-property/list-property.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeSearchComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'list-property', component: ListPropertyComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
