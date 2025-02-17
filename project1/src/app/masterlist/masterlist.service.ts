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

  getStudentList() {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
    // If token exists, add it to the headers
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    this.http.get(this.url, { headers })
      .subscribe({
        next: res => {
          this.list = res as Masterlist[];
          // Call updateStudentList method after fetching data
          this.updateStudentList();
        },
        error: err => {
          console.log('Error fetching student list:', err);
        }
      });
  }

  updateStudentList() {
    // You may need to notify the component that the data has been updated
    // This could be done with an event or by using observables
  }
}
