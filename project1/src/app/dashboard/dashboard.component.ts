import { Component, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartOptions, ChartType, registerables } from 'chart.js';
 
Chart.register(...registerables);
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DashboardComponent implements AfterViewInit {
 
  // Student Enrollment Data
  studentData = {
    "First Year": 120,
    "Second Year": 150,
    "Third Year": 100,
    "Fourth Year": 80,
  };
 
  // Course Status Data
  courseData = {
    "Enrolled": 200,
    "Taken": 120,
    "Pending": 60
  };
 
  @ViewChild('studentChart', { static: false }) studentChartCanvas!: ElementRef;
  @ViewChild('courseChart', { static: false }) courseChartCanvas!: ElementRef;
 
  studentChart!: Chart;
  courseChart!: Chart;
 
  constructor(private router: Router) {}
 
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        this.createStudentChart();
        this.createCourseChart();
      }
    }, 500);
  }
 
  createStudentChart(): void {
    const studentLabels = Object.keys(this.studentData);
    const studentValues = Object.values(this.studentData);
 
    const ctx = this.studentChartCanvas.nativeElement.getContext('2d');
 
    if (!ctx) {
      console.error("Canvas context not found!");
      return;
    }
 
    this.studentChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: studentLabels,
        datasets: [{
          label: 'Total Enrolled Students',
          data: studentValues,
          backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f'],
          borderColor: '#333',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
 
  createCourseChart(): void {
    const courseLabels = Object.keys(this.courseData);
    const courseValues = Object.values(this.courseData);
 
    const ctx = this.courseChartCanvas.nativeElement.getContext('2d');
 
    if (!ctx) {
      console.error("Canvas context not found!");
      return;
    }
 
    this.courseChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: courseLabels,
        datasets: [{
          label: 'Course Status',
          data: courseValues,
          backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
 
  refreshDashboard(event: Event): void {
    event.preventDefault();
    if (this.router.url === '/dashboard') {
      window.location.reload();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
 
  onEnroll(): void {
    this.router.navigate(['/enrollment']);
  }
 
  onMaster(): void {
    this.router.navigate(['/masterlist']);
  }
 
  onCourse(): void {
    this.router.navigate(['/courselist']);
  }
 
  onLogout(): void {
    this.router.navigate(['/login']);
  }
}