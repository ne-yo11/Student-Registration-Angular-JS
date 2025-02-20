import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgFor} from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MasterlistService } from './masterlist.service';
import { Masterlist } from './masterlist.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-masterlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgFor,FormsModule],
  templateUrl: './masterlist.component.html',
  styleUrls: ['./masterlist.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MasterlistComponent implements OnInit {
  constructor(private router: Router, public service: MasterlistService) { }

  ngOnInit(): void {
    this.service.getStudentList();
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

  isEditing = false;
  editingIndex: number | null = null;

  editForm = new FormGroup({
    firstname: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    lastname: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    middlename: new FormControl<string>('', { nonNullable: true }),
    address: new FormControl<string>('', { nonNullable: true }),
    contact: new FormControl<string>('', { nonNullable: true }),
    courseName: new FormControl<string>('', { nonNullable: true }),
    courseCode: new FormControl<string>('', { nonNullable: true })
  });

  // Fetch the list of students from the service and assign it to the students array
  updateStudentList() {
    this.students = this.service.list;

 
  this.students.forEach(student => {
    if (student.courseStatus === 'Active') {
      student.courseStatus = 'Enrolled';
    } else if (student.courseStatus !== 'Enrolled') {
      student.courseStatus = 'Taken';  
    }
  });
    this.filteredStudents = [...this.students];
  }
// Apply the general search filter
applyGeneralSearch() {
  const query = this.generalSearch.toLowerCase().trim();

  if (!query) {
    this.filteredStudents = [...this.students]; // Reset to all students if no search query
  } else {
    this.filteredStudents = this.students.filter(student => {
      return (
        student.studentCode?.toLowerCase().includes(query) ||
        student.firstName?.toLowerCase().includes(query) ||
        student.lastName?.toLowerCase().includes(query) ||
        student.middleName?.toLowerCase().includes(query) ||
        student.address?.toLowerCase().includes(query) ||
        student.contact?.toLowerCase().includes(query) ||
        student.courseName?.toLowerCase().includes(query) ||
        student.courseCode?.toLowerCase().includes(query) ||
        student.gender?.toLowerCase().includes(query) ||
        student.guardianName?.toLowerCase().includes(query) ||
        student.guardianAddress?.toLowerCase().includes(query) ||
        student.guardianContact?.toLowerCase().includes(query) ||
        student.hobby?.toLowerCase().includes(query)
      );
    });
  }
}
  applyFilter(name: string, course: string, yearLevel: string) {
    this.filteredStudents = this.students.filter(student => {
      // Extract the first number from courseCode to determine the year level
      const studentYearLevel = student.courseCode ? parseInt(student.courseCode.charAt(2), 10) : null;
  
      return (
        // Filter by name (first name or last name)
        (student.firstName?.toLowerCase().includes(name.toLowerCase().trim()) || 
        student.lastName?.toLowerCase().includes(name.toLowerCase().trim())) &&
        
        // Filter by course name
        (student.courseName?.toLowerCase().includes(course.toLowerCase().trim()) || course === '') &&
        
        // Filter by year level, based on the first number of the course code
        (studentYearLevel?.toString() === yearLevel || yearLevel === '')
      );
    });
  }
  
  clearFilters(nameFilter: HTMLInputElement, courseFilter: HTMLInputElement, yearLevelFilter: HTMLSelectElement) {
    this.filteredStudents = [...this.students];
    nameFilter.value = '';
    courseFilter.value = '';
    yearLevelFilter.value = '';
    this.generalSearch = '';  
    this.applyGeneralSearch(); 
  }

  onEdit(index: number) {
    this.isEditing = true;
    this.editingIndex = index;
    const student = this.filteredStudents[index];

    this.editForm.setValue({
      firstname: student.firstName || '',  
      lastname: student.lastName || '',    
      middlename: student.middleName || '',
      address: student.address || '',
      contact: student.contact || '',
      courseName: student.courseName || '',
      courseCode: student.courseCode || ''
    });
  }

  updateStudent() {
    if (this.editingIndex !== null) {
      const updatedStudent = {
        ...this.students[this.editingIndex],
        firstName: this.editForm.value.firstname!,
        lastName: this.editForm.value.lastname!,
        middleName: this.editForm.value.middlename!,
        address: this.editForm.value.address!,
        contact: this.editForm.value.contact!,
        courseName: this.editForm.value.courseName!,
        courseCode: this.editForm.value.courseCode!
      };
      this.students[this.editingIndex] = updatedStudent;
      this.filteredStudents = [...this.students];
    }
    this.isEditing = false;
    this.editingIndex = null;
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
  
  removeStudent(index: number) {
    if (confirm("Are you sure you want to remove this student?")) {
      this.students.splice(index, 1);
      this.filteredStudents = [...this.students];
    }
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
    localStorage.removeItem('token'); 
    this.router.navigate(['/']);
  }
}
