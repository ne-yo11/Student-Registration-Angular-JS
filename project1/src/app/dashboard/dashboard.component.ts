import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.Emulated // Ensures styles are component-scoped
})
export class DashboardComponent {
  constructor(private router: Router) { }

  refreshDashboard(event: Event) {
    event.preventDefault(); // Prevents default anchor behavior

    if (this.router.url === '/dashboard') {
      window.location.reload(); // Refresh the page only if already on the dashboard
    } else {
      this.router.navigate(['/dashboard']); // Navigate if not already on the dashboard
    }
  }

  onEnroll() {
    this.router.navigate(['/enrollment']);
  }

  onMaster() {
    this.router.navigate(['/masterlist']);
  }

  onCourse() {
    this.router.navigate(['/courselist']); // Ensure this route is correct
  }

  onLogout() {
    this.router.navigate(['/login']); // Redirect to login page on logout
  }
}
