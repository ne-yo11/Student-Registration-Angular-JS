import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Course } from './course.model';

@Injectable({
  providedIn: 'root'
})
export class CourselistService {
  url: string = environment.apiBaseUrl + '/course/list';
  list: Course[] = [];

  constructor(private http: HttpClient) { }

  courselist() {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
    // If token exists, add it to the headers
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    this.http.get(this.url, { headers })
      .subscribe({
        next: (res) => {
          this.list = res as Course[];
        },
        error: (err) => {
          console.log('Error fetching course list:', err);
        }
      });
  }
}
