import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgFor} from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MasterlistService } from './masterlist.service';
import { Masterlist } from './masterlist.model';
import { FormsModule } from '@angular/forms';
import { Course } from '../courselist/course.model';

@Component({
  selector: 'app-masterlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgFor,FormsModule],
  templateUrl: './masterlist.component.html',
  styleUrls: ['./masterlist.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MasterlistComponent implements OnInit {
  courseMapping: { [key: string]: string } = {};
  courses: Course[] = [];
  constructor(private router: Router, public service: MasterlistService) { }

  ngOnInit(): void {
    this.service.getStudentList();
    
    this.fetchCourses();
    this.setupBirthdateListener();
    // Wait for the service to update the student list before proceeding
    setTimeout(() => {
      if (this.service.list.length > 0) {
        this.updateStudentList();
      }
    }, 1000); 
  }

  // Replace static student data with the fetched data
  students: Masterlist[] = [];
  filteredStudents: Masterlist[] = [];
  generalSearch: string = '';
  yearLevels: { [key: number]: boolean } = {}; // Stores selected year levels
  selectedYearLevel: string = ''; // Stores selected dropdown year level
  selectedCategory: string = '';

  isEditing = false;
  editingIndex: number | null = null;

  editForm = new FormGroup({
    firstname: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    lastname: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    middlename: new FormControl<string>('', { nonNullable: false }),
    birthdate: new FormControl<string | null>(null, { nonNullable: true }),
    age: new FormControl<number | null>(null, { nonNullable: true }),
    gender: new FormControl<string>('', { nonNullable: true }),
    address: new FormControl<string>('', { nonNullable: true }),
    contact: new FormControl<string>('', { nonNullable: true }),
    guardianName: new FormControl<string>('', { nonNullable: true }),
    guardianAddress: new FormControl<string>('', { nonNullable: true }),
    guardianContact: new FormControl<string>('', { nonNullable: true }),
    courseName: new FormControl<string>('', { nonNullable: true }),
    courseCode: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<string>('', { nonNullable: true }),
    hobby: new FormControl<string>('', { nonNullable: true }),
  });

  // Fetch the list of students from the service and assign it to the students array
  updateStudentList() {
    this.students = this.service.list.map(student => ({
      ...student,
      courseName: student.courseCode ? this.courseMapping[student.courseCode] || student.courseName : student.courseName,
    }));
    this.filteredStudents = [...this.students];
  }
 fetchCourses() {
    this.service.courselist().subscribe({
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

// Function to apply search and checkbox filtering
onSearchClick() {
  const query = this.generalSearch.toLowerCase().trim();


  if(!this.selectedCategory) {
    alert('Please select a search category!');
    return;
  }

  // Apply search filter when button is clicked
  let searchFiltered = this.students;
  if (query) {
    searchFiltered = this.students.filter(student => {
      switch (this.selectedCategory) {
        case 'By Student Code':
          return student.studentCode?.toLowerCase().includes(query);
        case 'By Name':
          const fullName = `${student.firstName?.toLowerCase()} ${student.middleName?.toLowerCase()} ${student.lastName?.toLowerCase()}`;
          return (
            student.firstName?.toLowerCase().includes(query) ||
            student.lastName?.toLowerCase().includes(query) ||
            student.middleName?.toLowerCase().includes(query) ||
            fullName.includes(query)
          );
        case 'By Course Name':
          return student.courseName?.toLowerCase().includes(query);
        default:
          return false; // If no valid category is selected, return nothing
      }
    });
  }

  // If search returns no results, use only the checkbox filter
  if (searchFiltered.length === 0) {
    alert('No results found! Based on your search criteria.');
    this.applyCheckboxFilter(this.students); // Fallback to checkbox-only filtering
  } else {
    this.applyCheckboxFilter(searchFiltered); // Apply checkbox filter on search results
  }
}

applyCheckboxFilter(studentList: any[]) {
  const selectedYears = Object.keys(this.yearLevels)
    .filter(year => this.yearLevels[Number(year)]) // Get checked year levels
    .map(Number); // Convert keys to numbers

  this.filteredStudents = studentList.filter(student => {
    const studentYearLevel = student.courseCode ? parseInt(student.courseCode.charAt(2), 10) : null;
    return selectedYears.length === 0 || (studentYearLevel !== null && selectedYears.includes(studentYearLevel));
  });
}

CheckboxSearch() {
  this.applyCheckboxFilter(this.students);
}


clearFilters() {
  this.generalSearch = ''; // Clear search field
  this.selectedCategory = ''; // Reset category selection
  this.yearLevels = {}; // Uncheck all checkboxes
  this.filteredStudents = [...this.students]; // Reset to all students
}


  onEdit(index: number) {
    this.isEditing = true;
    this.editingIndex = index;
    const student = this.filteredStudents[index];
  
    console.log('birthdate:', student.birthdate);
  
    let formattedBirthdate = student.birthdate ? new Date(student.birthdate + 'T00:00:00') : null;


    
    if (typeof student.birthdate === 'string' && student.birthdate.includes('-')) {
      const [year, month, day] = student.birthdate.split('-').map(Number);
      formattedBirthdate = new Date(year, month - 1, day +1); // month is zero-based
    }
  
    // Convert to "YYYY-MM-DD" format for <input type="date">
    const dateForInput = formattedBirthdate ? formattedBirthdate.toISOString().split('T')[0] : null;

    this.editForm.setValue({
      firstname: student.firstName || '',
      lastname: student.lastName || '',
      middlename: student.middleName || '',
      birthdate: dateForInput,  // YYYY-MM-DD format
      age: student.age || null,
      gender: student.gender || '',
      address: student.address || '',
      contact: student.contact || '',
      guardianName: student.guardianName || '',
      guardianAddress: student.guardianAddress || '',
      guardianContact: student.guardianContact || '',
      courseName: student.courseName || '',
      courseCode: student.courseCode || '',
      status: student.status || '',
      hobby: student.hobby || '',
    });
  
    console.log('Formatted birthdate for form:', this.editForm.value.birthdate);
  }
  
  
  
  updateStudent(index: number | null): void {
    if (index === null) {
        console.error("Index is null, cannot update student.");
        return;
    }

    // Extract form values
    const formValues = this.editForm.value;

    // Check if any required fields are empty (excluding birthdate, age, and middleName)
    const requiredFields = Object.keys(formValues).filter(
        key => !['birthdate', 'age', 'middlename'].includes(key)
    );

    const hasEmptyRequiredField = requiredFields.some(
        key => formValues[key as keyof typeof formValues] === null || formValues[key as keyof typeof formValues] === ''
    );

    if (hasEmptyRequiredField) {
        alert("Please check your details and make sure all required fields are filled out.");
        return;
    }

    if (this.editingIndex !== null) {
        const updatedStudent: Partial<Masterlist> = {
            firstName: formValues.firstname!,
            lastName: formValues.lastname!,
            middleName: formValues.middlename!, 
            birthdate: formValues.birthdate!,  
            age: formValues.age!,               
            gender: formValues.gender!,
            address: formValues.address!,
            contact: formValues.contact!,
            guardianName: formValues.guardianName!,
            guardianAddress: formValues.guardianAddress!,
            guardianContact: formValues.guardianContact!,
            courseName: formValues.courseName!,
            courseCode: formValues.courseCode!,
            status: formValues.status!,
            hobby: formValues.hobby!,
        };

        const studentCode = this.students[this.editingIndex].studentCode;
        //console.log('Updated student:', updatedStudent);
        //console.log('Student Code:', studentCode);

        if (studentCode) {
            this.service.updateStudentList(studentCode, updatedStudent).subscribe({
                next: (res) => {
                    //console.log('Student successfully updated:', res);
                    alert('Student successfully updated!');
                    this.service.getStudentList(); // Refresh list after update
                    this.isEditing = false;
                    this.editingIndex = null;
                    window.location.reload();
                },
                error: (err) => {
                    console.error('Error updating student:', err);
                }
            });
        }
    }
}

  updateCourseCode(event: any): void { 
    const selectedCourse = event.target.value;
  this.editForm.patchValue({
    courseCode: this.courseMapping[selectedCourse] || '',
  });
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingIndex = null;
  }

  downloadFile(doc: any) {
    const byteCharacters = atob(doc.data); // Decode Base64
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: doc.fileType });
  
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  removeStudent(index: number): void{
    if (confirm("Are you sure you want to deactivate this student?")) {
      const studentCode = this.filteredStudents[index].studentCode ?? '';

      this.service.softdeactivateStudent(studentCode).subscribe({
        next: (res) => {
          //console.log('Student successfully deactivated:', res);
          alert('Student successfully deactivated!');
          this.service.getStudentList();
          window.location.reload();
        },
        error: (err) => {
          console.error('Error deactivating student:', err);
        }
      });
    }
  }
  restoreStudent(index: number): void {
      if(confirm("Are you sure you want to Reactivate this student?")){
        const studentCode = this.filteredStudents[index].studentCode ?? '';
        this.service.softReactivateStudent(studentCode).subscribe({
          next: (res) => {
            //console.log('Student successfully reactivated:', res);
            alert('Student successfully reactivated!');
            this.service.getStudentList();
            window.location.reload();
          },
          error: (err) => {
            console.error('Error reactivating student:', err);
          }
        });
      }
  }
  // Auto-calculate Age based on Birthdate
  setupBirthdateListener() {
    this.editForm.controls['birthdate'].valueChanges.subscribe(birthdate => {
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
      this.editForm.controls['age'].enable();
      this.editForm.controls['age'].setValue(age);
    });
  }
  

  onDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onEnroll() {
    this.router.navigate(['/enrollment']);
  }

  onMaster() {
    this.router.url === '/masterlist'

  }

  onCourse() {
    this.router.navigate(['/courselist']);
  }

  onLogout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }
}
