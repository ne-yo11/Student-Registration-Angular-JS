import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CourselistService } from './courselist.service';
import { Course } from './course.model';

@Component({
  selector: 'app-courselist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgFor, FormsModule],
  templateUrl: './courselist.component.html',
  styleUrls: ['./courselist.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CourselistComponent implements OnInit {
  // Main and filtered course lists
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  generalSearch: string = '';

  // Flags for modals
  isEditing = false;
  isAdding = false;
  editingIndex: number | null = null;

  // Reactive form for editing a course
  editForm: FormGroup = new FormGroup({
    courseName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    courseCode: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    department: new FormControl<string>('', { nonNullable: true }),
    duration: new FormControl<string>('', { nonNullable: true }),
    description: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<string>('', { nonNullable: true, validators: Validators.required })
  });

  // Reactive form for adding a new course
  addForm: FormGroup = new FormGroup({
    courseName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    courseCode: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    department: new FormControl<string>('', { nonNullable: true }),
    duration: new FormControl<string>('', { nonNullable: true }),
    description: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<string>('Active', { nonNullable: true, validators: Validators.required })
  });

  constructor(private router: Router, public service: CourselistService) { }

  ngOnInit(): void {
    // Request the courses from the service
    this.service.courselist();

    // Poll for the list until it's populated (in production, consider using an observable)
    const intervalId = setInterval(() => {
      if (this.service.list && this.service.list.length > 0) {
        this.updateCourseList();
        clearInterval(intervalId);
      }
    }, 100);
  }

  // Update local courses from the service and refresh the filtered list
  updateCourseList(): void {
    this.courses = this.service.list;
    this.filteredCourses = [...this.courses];
  }

  // Filter courses based on a general search query across all course properties
  applyGeneralSearch(): void {
    const query = this.generalSearch.toLowerCase().trim();
    if (!query) {
      this.filteredCourses = [...this.courses];
    } else {
      this.filteredCourses = this.courses.filter(course =>
        String(course.courseName).toLowerCase().includes(query) ||
        String(course.courseCode).toLowerCase().includes(query) ||
        String(course.department).toLowerCase().includes(query) ||
        String(course.duration).toLowerCase().includes(query) ||
        String(course.description).toLowerCase().includes(query) ||
        String(course.status).toLowerCase().includes(query)
      );
    }
  }

  // Apply filter based on course name and course code fields
  applyFilter(courseName: string, courseCode: string): void {
    const nameQuery = courseName.toLowerCase().trim();
    const codeQuery = courseCode.toLowerCase().trim();
    this.filteredCourses = this.courses.filter(course =>
      String(course.courseName).toLowerCase().includes(nameQuery) &&
      String(course.courseCode).toLowerCase().includes(codeQuery)
    );
  }

  // Clear filter inputs and reset the filtered courses list
  clearFilters(courseFilter: HTMLInputElement, codeFilter: HTMLInputElement): void {
    courseFilter.value = '';
    codeFilter.value = '';
    this.generalSearch = '';
    this.filteredCourses = [...this.courses];
  }

  // Enter edit mode for a selected course
  onEdit(index: number): void {
    this.isEditing = true;
    this.editingIndex = index;
    const course = this.filteredCourses[index];
    this.editForm.setValue({
      courseName: String(course.courseName) || '',
      courseCode: String(course.courseCode) || '',
      department: String(course.department) || '',
      duration: String(course.duration) || '',
      description: String(course.description) || '',
      status: String(course.status) || 'Active'
    });
  }

  // Update course data after editing
  updateCourse(): void {
    if (this.editForm.valid && this.editingIndex !== null) {
      const courseCode = this.filteredCourses[this.editingIndex].courseCode;
      this.service.updateCourse(courseCode, this.editForm.value).subscribe({
        next: (res) => {
          //console.log('Course successfully updated:', res);
          alert('Course successfully updated!');
          this.onRefresh();
          this.isEditing = false;  
          this.service.courselist(); 
        },
        error: (err) => {
          console.error('Error updating course:', err);
        }
      });
    }
  }

  // Cancel the editing process
  cancelEdit(): void {
    this.isEditing = false;
    this.editingIndex = null;
  }

  // Remove a course from the list after confirmation
  removeCourse(index: number): void {
    if (confirm("Are you sure you want to deactivate this course?")) {
      const courseCode = this.filteredCourses[index].courseCode;
      
      this.service.softDeleteCourse(courseCode).subscribe({
        next: (res) => {
          //console.log('Course successfully deactivated:', res);
          alert('Course successfully deactivated!');
          this.onRefresh();
          this.service.courselist(); // Refresh list
        },
        error: (err) => {
          console.error('Error deactivating course:', err);
        }
      });
    }
  }
  // Restore a course (change status from 'Inactive' to 'Active')
restoreCourse(index: number): void {
  if (confirm("Are you sure you want to Restore this course?")) {
    const courseCode = this.filteredCourses[index].courseCode;
    
    this.service.softRestoreCourse(courseCode).subscribe({
      next: (res) => {
        //console.log('Course successfully Restored:', res);
        alert('Course successfully Restored!');
        this.onRefresh();
        this.service.courselist(); // Refresh list
      },
      error: (err) => {
        console.error('Error restoring course:', err);
      }
    });
  }
}

  // Begin "Add Course" process by opening the add modal
  onAddCourse(): void {
    this.isAdding = true;
    this.addForm.reset({
      courseName: '',
      courseCode: '',
      department: '',
      duration: '',
      description: '',
      status: 'Active'
    });
  }

  // Handle the add course form submission
  addCourse(): void {
    this.service.addCourse(this.addForm.value).subscribe({
      next: (res) => {
        //console.log('Course successfully added:', res);
        alert('Course successfully added!');
        this.onRefresh();
        this.isAdding = false;  // Close the modal
        this.service.courselist(); // Refresh the list
      },
      error: (err) => {
        console.error('Error adding course:', err);
      }
    });
}

  // Cancel the add course process
  cancelAdd(): void {
    this.isAdding = false;
  }
  onRefresh() {
    window.location.reload();
  }
  

  // Navigation functions
  onDashboard(): void {
    this.router.navigate(['/dashboard']);
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
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }
}
