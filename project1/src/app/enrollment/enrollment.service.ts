import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Enrollment } from './enrollment.model';
import { Course } from '../courselist/course.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private registerUrl: string = environment.apiBaseUrl + '/student/register';
  private courseListUrl: string = environment.apiBaseUrl + '/course/list';
  list: Course[] = [];

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  // API to register a student
  registerStudent(studentData: FormData): Observable<any> {
    return this.http.post(this.registerUrl, studentData, { headers: this.getHeaders() });
  }

  // API to get the course list
  courselist(): Observable<Course[]> {
    return this.http.get<Course[]>(this.courseListUrl, { headers: this.getHeaders() });
  }
}