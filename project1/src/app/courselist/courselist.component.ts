import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courselist',
  templateUrl: './courselist.component.html',
  styleUrls: ['./courselist.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CourselistComponent implements AfterViewInit {
  constructor(private router: Router) { }

  courses = [
    { name: 'Computer Science', code: 'CS101', duration: '4', department: 'IT', description: 'Programming basics', status: 'Active' },
    { name: 'Business Management', code: 'BM202', duration: '3', department: 'Business', description: 'Management principles', status: 'Inactive' },
  ];

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
          <td>${course.code}</td>cls\

          <td>${course.duration}</td>
          <td>${course.department}</td>
          <td>${course.description}</td>
          <td><span class="${course.status === 'Active' ? 'active' : 'inactive'}">${course.status}</span></td>
        `;

        tableBody.appendChild(row);
      });
    }
  }

  refreshDashboard(event: Event) {
    event.preventDefault();
    window.location.reload();
  }

  onEnroll() {
    this.router.navigate(['/enrollment']);
  }

  onMaster() {
    this.router.navigate(['/masterlist']);
  }

  onCourse() {
    this.router.navigate(['/courselist']);
  }

  onLogout() {
    this.router.navigate(['/']);
  }
}
