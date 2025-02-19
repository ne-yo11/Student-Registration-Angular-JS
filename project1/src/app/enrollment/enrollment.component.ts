import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
 
// Custom Validator for Age Range (16 to 35 years old)
function birthdateValidator(control: FormControl): ValidationErrors | null {
  const birthdate = new Date(control.value);
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
 
  // Adjust age calculation if birthdate hasn't passed yet this year
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
 
  if (age < 16 || age > 35) {
    return { invalidAge: true }; // Custom validation error if age is out of range
  }
  return null;
}
 
// Custom Validator for Contact Numbers (starts with '+63' or '09' and must be 11 digits)
function contactNumberValidator(control: FormControl): ValidationErrors | null {
  const contactNumber = control.value;
  const contactRegex = /^(?:\+63\d{9}|09\d{9})$/;
  if (!contactRegex.test(contactNumber)) {
    return { invalidContact: true };
  }
  return null;
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
  studentCount = 1; // Simulating auto-increment (Fetch from DB in real case)
 
  constructor(private router: Router) { }
 
  // Course Mapping
  courseMapping: { [key: string]: string } = {
    'Bachelor of Architecture': 'ARCH106',
    'Bachelor of Business Administration': 'BA101',
    'Bachelor of Science in Civil Engineering': 'CE101',
    'Computer Science': 'CS101',
    'Bachelor of Science Information Technology': 'IT101'
  };
 
  // Form Group for Registration
  registrationForm = new FormGroup({
    firstName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    middleName: new FormControl<string>(''),
    lastName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    birthdate: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, birthdateValidator] }),
    age: new FormControl<number | null>(null, { nonNullable: false, validators: [Validators.required] }), // Age is dynamically calculated
    gender: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    address: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    contactNumber: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, contactNumberValidator] }),
 
    // Guardian Details
    guardianName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    guardianAddress: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    guardianContact: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, contactNumberValidator] }),
 
    // Course Selection
    courseName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    courseCode: new FormControl<string>({ value: '', disabled: true }, { nonNullable: true, validators: Validators.required }), // Read-only
 
    status: new FormControl<string>('Enrolled', { nonNullable: true }),
 
    // Documents
    documents: new FormControl<File | null>(null, { nonNullable: false }),
  });
 
  ngOnInit() {
    this.fetchStudentCount(); // Get the current student count (Simulating DB)
    this.setupCourseNameListener();
    this.setupGuardianNameListener();
    this.setupBirthdateListener();
  }
 
  fetchStudentCount() {
    // Simulate fetching the latest student count from DB/API
    this.studentCount = 5; // Example: Assume 5 students already exist
  }
 
  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Student Registered:', this.registrationForm.value);
      alert('Student successfully registered!');
      this.registrationForm.reset();
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
 
  // Auto-fill Course Code when Course Name is selected
  setupCourseNameListener() {
    this.registrationForm.controls.courseName.valueChanges.subscribe((selectedCourse) => {
      if (selectedCourse) {
        const courseCode = this.courseMapping[selectedCourse] || '';
        this.registrationForm.controls.courseCode.setValue(courseCode);
      }
    });
  }
 
  // Auto-fill Guardian Name with Student's Full Name
  setupGuardianNameListener() {
  }
 
  updateGuardianName() {
    const firstName = this.registrationForm.controls.firstName.value || '';
    const middleName = this.registrationForm.controls.middleName.value || '';
    const lastName = this.registrationForm.controls.lastName.value || '';
 
    const fullName = [firstName, middleName, lastName].filter(name => name.trim() !== '').join(' ');
    this.registrationForm.controls.guardianName.setValue(fullName);
  }
 
  // Auto-calculate Age based on Birthdate
  setupBirthdateListener() {
    this.registrationForm.controls.birthdate.valueChanges.subscribe((birthdate: string) => {
      const birthDateObj = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const m = today.getMonth() - birthDateObj.getMonth();
 
      // Adjust age calculation if birthdate hasn't passed yet this year
      if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
      }
 
      this.registrationForm.controls.age.setValue(age); // Update age dynamically
 
      // Check if the age is valid (between 16 and 35)
      if (age < 16 || age > 35) {
        this.registrationForm.controls.age.setErrors({ invalidAge: true }); // Show error if not valid
      }
    });
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
    this.router.navigate(['/login']);
  }
}