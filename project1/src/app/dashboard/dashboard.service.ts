import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Dashboard } from '../dashboard/dashboard.model';
import { Observable } from 'rxjs';
import { CourseCountDashboard } from './course-count-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private countStudentURL: string = environment.apiBaseUrl + '/student/count';
  private countCourseURL: string = environment.apiBaseUrl + '/course/count';

  constructor(private http: HttpClient) { }
  
    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('token');
      return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
    }
    getStudentCount(): Observable<Dashboard> {
      return this.http.get<Dashboard>(this.countStudentURL, { headers: this.getHeaders() });
    }

    getCoursesCount(): Observable<CourseCountDashboard> {
      return this.http.get<CourseCountDashboard>(this.countCourseURL, { headers: this.getHeaders() });
    }
}
