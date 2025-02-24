import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Masterlist } from './masterlist.model';

@Injectable({
  providedIn: 'root'
})
export class MasterlistService {

  url: string = environment.apiBaseUrl + '/student/list'; // Endpoint URL

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

        this.updateStudentList();
      },
      error: err => {
        console.error('❌ Error fetching student list:', err);
      }
    });
  }

  updateStudentList() {
    // You may need to notify the component that the data has been updated
    // This could be done with an event or by using observables
  }

  softdeactivateStudent(studentCode: string) {
   const url = `${environment.apiBaseUrl}/student/Softdeactivate/${studentCode}`;
   return this.http.put(url, {},{headers: this.getAuthHeaders()});
  }

  softReactivateStudent(studentCode: string) {
    const url = `${environment.apiBaseUrl}/student/Softreactivate/${studentCode}`;
    return this.http.put(url, {},{headers: this.getAuthHeaders()});
   }
}
