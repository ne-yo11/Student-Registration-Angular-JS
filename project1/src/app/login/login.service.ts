import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Login } from './login.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl: string = environment.apiBaseUrl + '/Auth/login';

  constructor(private http: HttpClient) { }

  
  login(credentials: Login): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }
}
