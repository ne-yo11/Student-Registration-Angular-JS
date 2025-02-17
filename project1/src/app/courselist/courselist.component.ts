import { Component, ViewEncapsulation ,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourselistService } from './courselist.service';
import { CommonModule, NgFor} from '@angular/common';

@Component({
  selector: 'app-courselist',
  templateUrl: './courselist.component.html',
  styleUrls: ['./courselist.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.Emulated,
  imports: [CommonModule, NgFor]
})
export class CourselistComponent implements OnInit {
  constructor(private router: Router, public service: CourselistService) {

   }
  ngOnInit(): void {
    this.service.courselist();
  }


  onDashboard() {
    this.router.navigate(['/dashboard']);
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
    localStorage.removeItem('token'); // Or whatever storage method you're using

    // Optionally, navigate to the login page
    this.router.navigate(['/']);
  }
}
