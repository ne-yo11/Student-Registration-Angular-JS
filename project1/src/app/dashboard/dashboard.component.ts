import { Component, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartOptions, ChartType, registerables } from 'chart.js';
import { environment } from '../../environments/environment';
import { Dashboard } from '../dashboard/dashboard.model';
import { DashboardService } from '../dashboard/dashboard.service';
import { CourseCountDashboard } from './course-count-dashboard.model';

Chart.register(...registerables);
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DashboardComponent implements OnInit, AfterViewInit {
 
   // Student Enrollment Data
  studentData: Dashboard = { "1": 0, "2": 0, "3": 0, "4": 0 };
 
  courseData: CourseCountDashboard = { Inactive: 0,Active: 0 };
  // Course Status Data

 
  @ViewChild('studentChart', { static: false }) studentChartCanvas!: ElementRef;
  @ViewChild('courseChart', { static: false }) courseChartCanvas!: ElementRef;
 
  studentChart!: Chart;
  courseChart!: Chart;

 
  constructor(private router: Router, public dashboardService: DashboardService) {}
  ngOnInit(): void {
    this.fetchStudentCount();
    this.fetchCourseCount();
  }
 
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        this.createStudentChart();
        this.createCourseChart();
      }
    }, 500);
  }
 
  createStudentChart(): void {
    const yearLabelsMap: { [key: string]: string } = {
      "1": "1st Year",
      "2": "2nd Year",
      "3": "3rd Year",
      "4": "4th Year"
    };
  
    const studentLabels = Object.keys(this.studentData).map(key => yearLabelsMap[key] || key);
    const studentValues = Object.values(this.studentData);
  
    const ctx = this.studentChartCanvas.nativeElement.getContext('2d');
  
    if (!ctx) {
      console.error("Canvas context not found!");
      return;
    }
  
    this.studentChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: studentLabels, // Updated Labels
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
        onClick: (event, elements) => {
          if (elements.length > 0) {
            this.onMaster(); // Redirect to student master list when clicked
          }
        }
      }
    });
  }
  fetchStudentCount() {
    this.dashboardService.getStudentCount().subscribe({
      next: (data) => {
        this.studentData = data;
      },
      error: (error) => {
        console.error('Error fetching student count:', error);
      }
    });
  }
  fetchCourseCount() {
    this.dashboardService.getCoursesCount().subscribe({
      next: (data) => {
        this.courseData = data;
      },
      error: (error) => {
        console.error('Error fetching course count:', error);
      }
    });
  }
  createCourseChart(): void {
    const courseLabelsMap: { [key: string]: string } = {
      "1": "Active Courses",
      "0": "Inactive Courses"
    };

    const courseLabels = Object.keys(this.courseData).map(key => courseLabelsMap[key] || key);
    const courseValues = Object.values(this.courseData);

    const ctx = this.courseChartCanvas.nativeElement.getContext('2d');

    if (!ctx) {
      console.error("Canvas context not found!");
      return;
    }

    this.courseChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: courseLabels, // Mapped Labels
        datasets: [{
          label: 'Course Status',
          data: courseValues,
          backgroundColor: ['#e74c3c','#2ecc71'] // Green for Active, Red for Inactive
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            this.onCourse(); // Redirect to course master list when clicked
          }
        }
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
    if(confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }
}