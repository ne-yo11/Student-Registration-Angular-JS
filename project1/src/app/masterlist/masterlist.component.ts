import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-masterlist',
  templateUrl: './masterlist.component.html',
  styleUrls: ['./masterlist.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MasterlistComponent implements AfterViewInit {
  constructor(private router: Router) { }

  courses = [
    { name: 'Computer Science', code: 'CS101', duration: '4', department: 'IT', description: 'Programming basics', status: 'Active' },
    { name: 'Business Management', code: 'BM202', duration: '3', department: 'Business', description: 'Management principles', status: 'Inactive' },
  ];

  showModal = false;

  ngAfterViewInit() {
    this.renderTable();
  }

  renderTable() {
    const tableBody = document.getElementById('courseTableBody');
    if (tableBody) {
      tableBody.innerHTML = '';

      this.courses.forEach(course => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${course.name}</td>
          <td>${course.code}</td>
          <td>${course.duration}</td>
          <td>${course.department}</td>
          <td>${course.description}</td>
          <td><span class="${course.status === 'Active' ? 'active' : 'inactive'}">${course.status}</span></td>
        `;

        tableBody.appendChild(row);
      });
    }
  }

  openEnrollmentForm() {
    this.showModal = true;
    document.getElementById('enrollmentForm')!.style.display = 'flex';
  }

  closeEnrollmentForm() {
    this.showModal = false;
    document.getElementById('enrollmentForm')!.style.display = 'none';
  }

  confirmEnrollment() {
    const name = (document.getElementById('courseName') as HTMLInputElement).value;
    const code = (document.getElementById('courseCode') as HTMLInputElement).value;
    const duration = (document.getElementById('courseDuration') as HTMLInputElement).value;
    const department = (document.getElementById('courseDepartment') as HTMLInputElement).value;
    const description = (document.getElementById('courseDescription') as HTMLInputElement).value;
    const status = (document.getElementById('courseStatus') as HTMLSelectElement).value;

    if (!name || !code || !duration || !department || !description) {
      alert('Please fill in all fields.');
      return;
    }

    if (confirm('Are you sure you want to enroll this course?')) {
      this.courses.push({ name, code, duration, department, description, status });
      this.closeEnrollmentForm();
      this.renderTable();
    }
  }

 
  Dashboard() {
    this.router.navigate(['/dashboard'])

  }

  refreshDashboard(event: Event) {
    event.preventDefault();

    
  }


  onEnroll() {
    this.router.navigate(['/enrollment']);
  }

  onMaster(event: Event) {
    event.preventDefault(); // Prevents default anchor behavior

    if (this.router.url === '/masterlist') {
      window.location.reload(); // Refresh the page only if already on the dashboard
    } else {
      this.router.navigate(['/masterlist']); // Navigate if not already on the dashboard
    }
  }

  onCourse() {
    this.router.navigate(['/courselist']); // Ensure this route is correct
  }

  onLogout() {
    this.router.navigate(['/login']); // Redirect to login page on logout
  }
}
