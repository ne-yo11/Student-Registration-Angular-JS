import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EnrollmentComponent implements OnInit {
  studentCount = 1; // Simulating auto-increment (Fetch from DB in real case)
 
  constructor(private router: Router) { }
 
  registrationForm = new FormGroup({
    studentCode: new FormControl<string>('', { nonNullable: true }), // Auto-generated & non-editable
    firstName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    middleName: new FormControl<string>(''),
    lastName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    birthdate: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    age: new FormControl<number | null>(null, { nonNullable: false }),
    gender: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    address: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    contactNumber: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
 
    guardianName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    guardianAddress: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    guardianContact: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
 
    courseName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    courseCode: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    status: new FormControl<string>('Enrolled', { nonNullable: true }),
 
    documents: new FormControl<File | null>(null, { nonNullable: false }),
  });
 
  ngOnInit() {
    this.fetchStudentCount(); // Get the current student count (Simulating DB)
    this.registrationForm.controls.studentCode.disable();
  }
 
  fetchStudentCount() {
    // 🔹 Simulate fetching the latest student count from DB/API
    // Example: this.http.get<number>('/api/students/count').subscribe(count => { this.studentCount = count + 1; });
    this.studentCount = 5; // Example: Assume 5 students already exist
    this.generateStudentCode();
  }
 
  generateStudentCode() {
    const year = new Date().getFullYear().toString().slice(-2);
    const studentNumber = this.studentCount.toString().padStart(4, '0'); // Format as 0001, 0002, etc.
    this.registrationForm.controls.studentCode.setValue(`SC${year}-${studentNumber}`);
  }
 
  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Student Registered:', this.registrationForm.value);
      alert('Student successfully registered!');
 
      // 🔹 Increment student count for the next registration
      this.studentCount++;
      this.generateStudentCode(); // Generate a new student code for the next entry
 
      this.registrationForm.reset();
    } else {
      alert('Please fill in all required fields.');
    }
  }
 
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
    this.router.navigate(['/login']);
  }
}