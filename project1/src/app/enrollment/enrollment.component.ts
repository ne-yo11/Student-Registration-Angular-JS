import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EnrollmentComponent {
  constructor(private router: Router) { }

  refreshDashboard(event: Event) {
    event.preventDefault(); // Prevents default anchor behavior

    if (this.router.url === '/enrollment') {
      window.location.reload(); // Refresh the page only if already on the dashboard
    } else {
      this.router.navigate(['/enrollment']); // Navigate if not already on the dashboard
    }
  }

  onDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onMaster() {
    this.router.navigate(['/masterlist']);
  }

  onCourse() {
    this.router.navigate(['/course-masterlist']); // Adjust route as needed
  }

  onLogout() {
    this.router.navigate(['/']); // Redirect to login
  }
}
