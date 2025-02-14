import * as router from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MasterlistComponent } from './masterlist/masterlist.component';
import { LoginComponent } from './login/login.component';
import { CourselistComponent } from './courselist/courselist.component';

export const routes: router.Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // ✅ Default to login
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'enrollment', component: EnrollmentComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'courselist', component: CourselistComponent },
  { path: 'masterlist', component: MasterlistComponent },
  { path: '**', redirectTo: 'dashboard' }
];
