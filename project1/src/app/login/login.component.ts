import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';  
import { Login } from './login.model';
import { CommonModule, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule]
})
export class LoginComponent {
  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  errorMessage: string = '';

  constructor(private router: Router, private loginService: LoginService) { }

  login(event: Event) {
    event.preventDefault();  // Prevent the default form submit behavior
    const username = this.usernameInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;
  
    const loginData: Login = { username, password };
  
    this.loginService.login(loginData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('Authentication successful!');
          this.router.navigate(['/dashboard']);
        } else {
          console.log('No token received.');
        }
      },
      error: (error) => {
        console.log('Error:', error);  // Log the error response
        this.errorMessage = 'Invalid credentials';
      }
    });
  }
}
