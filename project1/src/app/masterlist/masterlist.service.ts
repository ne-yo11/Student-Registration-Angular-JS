import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Masterlist } from './masterlist.model';
import { Course } from '../courselist/course.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterlistService {

  url: string = environment.apiBaseUrl + '/student/list'; // Endpoint URL
  private courseListUrl: string = environment.apiBaseUrl + '/course/list';

  list: Masterlist[] = [];

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  getStudentList() {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
    // If token exists, add it to the headers
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    this.http.get<Masterlist[]>(this.url, { headers }).subscribe({
      next: res => {
        console.log('🟢 Student List:', res);
        this.list = res.map(student => ({
          ...student,
          documents: Array.isArray(student.documents) ? student.documents : [] 
        }));

        //console.log('🟢 Updated Student List:', this.list);
        //console.log('📄 First student documents:', this.list[0]?.documents);
      },
      error: err => {
        console.error('❌ Error fetching student list:', err);
      }
    });
  }

  updateStudentList(studentCode: string, updatedStudent: Partial<Masterlist>) {
    const url =`${environment.apiBaseUrl}/student/update/${studentCode}`;
    return this.http.put(url,updatedStudent, { headers: this.getAuthHeaders() });
  }

  softdeactivateStudent(studentCode: string) {
   const url = `${environment.apiBaseUrl}/student/Softdeactivate/${studentCode}`;
   return this.http.put(url, {},{headers: this.getAuthHeaders()});
  }

  softReactivateStudent(studentCode: string) {
    const url = `${environment.apiBaseUrl}/student/Softreactivate/${studentCode}`;
    return this.http.put(url, {},{headers: this.getAuthHeaders()});
   }
   // API to get the course list
     courselist(): Observable<Course[]> {
       return this.http.get<Course[]>(this.courseListUrl, { headers: this.getAuthHeaders() });
     }
}
