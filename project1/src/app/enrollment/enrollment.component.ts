import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, ValidationErrors, FormBuilder } from '@angular/forms';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './enrollment.model';
import { Course } from '../courselist/course.model';


// Custom Validators
function birthdateValidator(control: FormControl): ValidationErrors | null {
  const birthdate = new Date(control.value);
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  //console.log("Calculated Age in Validator:", age);
  return age < 16 || age > 100 ? { invalidAge: true } : null;
}
 
// Custom Validator for Contact Numbers (starts with '+63' or '09' and must be 11 digits)
function contactNumberValidator(control: FormControl): ValidationErrors | null {
  const contactRegex = /^(?:\+63\d{9}|09\d{9})$/;
  return !contactRegex.test(control.value) ? { invalidContact: true } : null;
}
 
@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EnrollmentComponent implements OnInit {
  studentCount = 1;
  registrationForm: FormGroup;
  courses: Course[] = [];
  // Course Mapping
  courseMapping: { [key: string]: string } = {};

  constructor(private router: Router, private enrollmentService: EnrollmentService, private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      birthdate: ['', [Validators.required, birthdateValidator]],
      age: [{ value: null, disabled: true }, Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      Contact: ['', [Validators.required, contactNumberValidator]],
  
      // Guardian
      guardianName: ['', Validators.required],
      guardianAddress: ['', Validators.required],
      guardianContact: ['', [Validators.required, contactNumberValidator]],
  
      // Course
      courseName: ['', Validators.required],
      courseCode: ['', Validators.required],
      CourseStatus: ['Enrolled', Validators.required],
  
      hobby: ['', Validators.required],
  
      // Documents
      documents: [null]
    });
  }
 
  ngOnInit() {
    this.fetchCourses();
    this.setupCourseNameListener();
    this.setupBirthdateListener();
  }
 
  fetchStudentCount() {
    // Simulate fetching the latest student count from DB/API
    this.studentCount = 5; 
  }
  fetchCourses() {
    this.enrollmentService.courselist().subscribe({
      next: (courses: Course[]) => {
        
        this.courses = courses;
        this.courseMapping = {};
        courses.forEach(course => {
          this.courseMapping[course.courseName] = course.courseCode;
        });
        //console.log("Course Mapping:", this.courseMapping);
      },
      error: (error) => {
        console.error('Failed to fetch courses:', error);
      }
    });    
  }
  
  updateCourseCode(event: any): void { 
    const selectedCourse = event.target.value;
    this.registrationForm.controls['courseName'].valueChanges.subscribe((selectedCourse) => {
      if (selectedCourse) {
        const courseCode = this.courseMapping[selectedCourse] || '';
        this.registrationForm.controls['courseCode'].enable();  // Enable field
        this.registrationForm.controls['courseCode'].setValue(courseCode);
      }
    });
    //console.log("Selected Course:", selectedCourse);
   // console.log("Mapped Course Code:", this.courseMapping[selectedCourse]);
  }
  selectedFile: File | null = null;
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Selected File:', file.name); // Debugging log
    }
}

 
  onSubmit() {
    if (this.registrationForm.valid) {
      //console.log('Form Submitted Successfully!');
      //console.log('Form is valid:', this.registrationForm.value);
      const formData = new FormData();

      // Append all form fields to FormData
      Object.keys(this.registrationForm.value).forEach((key) => {
        if (key !== 'documents') {
          const value = this.registrationForm.value[key];
          formData.append(key, value ? value.toString() : '');
        }
      });

      // Append file separately
      if (this.selectedFile) {
        formData.append('documents', this.selectedFile);
      }

      // Call service to submit form data
      this.enrollmentService.registerStudent(formData).subscribe({
        next: (response) => {
          //console.log('Student Registered:', response);
          alert('Student successfully registered!');
          this.registrationForm.reset();
        },
        error: (error) => {
          console.error('Registration failed:', error);
          alert('Failed to register student. Check console for details.');
        }
      });
    }
    else {
      //console.log('Form is INVALID', this.registrationForm.errors);
      //console.log('Individual Control Errors:', this.registrationForm.controls);
      Object.keys(this.registrationForm.controls).forEach((key) => {
        const control = this.registrationForm.controls[key];
        //console.log(`${key} Errors:`, control.errors);
      });
    }
  }

  
  // Auto-fill Course Code when Course Name is selected
  setupCourseNameListener() {
    this.registrationForm.controls['courseName'].valueChanges.subscribe((selectedCourse) => {
      if (selectedCourse) {
        const courseCode = this.courseMapping[selectedCourse] || '';
        this.registrationForm.controls['courseCode'].setValue(courseCode);
      }
    });
  }
 
  // Auto-calculate Age based on Birthdate
  setupBirthdateListener() {
    this.registrationForm.controls['birthdate'].valueChanges.subscribe(birthdate => {
      if (!birthdate) return;
  
      const birthDateObj = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
  
      if (
        today.getMonth() < birthDateObj.getMonth() ||
        (today.getMonth() === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())
      ) {
        age--;
      }
  
      // Enable the age field before setting the value
      this.registrationForm.controls['age'].enable();
      this.registrationForm.controls['age'].setValue(age);
    });
  }
  
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

 
  // Navigation Functions
  Dashboard() {
    this.router.navigate(['/dashboard']);
  }
 
  onEnroll() {
    this.router.navigate(['/enrollment']);
  }
 
  onMaster(event: Event) {
    event.preventDefault();
    this.router.navigate(['/masterlist']);
  }
 
  onCourse() {
    this.router.navigate(['/courselist']);
  }
 
  onLogout() {
    if (this.registrationForm.dirty && !confirm("You have unsaved changes. Do you really want to leave?")) {
      return;
    }
    this.router.navigate(['/login']);
  }
}