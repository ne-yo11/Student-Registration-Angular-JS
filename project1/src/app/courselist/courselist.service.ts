import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Course } from './course.model';

@Injectable({
  providedIn: 'root'
})
export class CourselistService {
  url: string = environment.apiBaseUrl + '/course/list';
  private addCourseUrl: string = environment.apiBaseUrl + '/course/add';
  list: Course[] = [];

  constructor(private http: HttpClient) { }

  // Helper function to get headers with authorization token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  courselist() {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
    // If token exists, add it to the headers
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};

    this.http.get(this.url, { headers })
      .subscribe({
        next: (res) => {
          console.log('Course list:', res);
          this.list = res as Course[];
        },
        error: (err) => {
          console.log('Error fetching course list:', err);
        }
      });
  }

  addCourse(courseData: Course) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  
    return this.http.post(this.addCourseUrl, JSON.stringify(courseData), { headers });
  }

  updateCourse(courseCode: string, courseData: Course) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  
    const url = `${environment.apiBaseUrl}/course/update/${courseCode}`; // Correctly inject courseCode
    return this.http.put(url, JSON.stringify(courseData), { headers });
  }
  // Soft delete a course (set status to inactive)
  softDeleteCourse(courseCode: string) {
    const url = `${environment.apiBaseUrl}/course/Softdelete/${courseCode}`;
    return this.http.put(url, {}, { headers: this.getAuthHeaders() });
  }

  // Restore a course (set status to active)
  softRestoreCourse(courseCode: string) {
    const url = `${environment.apiBaseUrl}/course/Softrestore/${courseCode}`;
    return this.http.put(url, {}, { headers: this.getAuthHeaders() });
  }
  
}
