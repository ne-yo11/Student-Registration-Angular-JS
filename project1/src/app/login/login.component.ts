import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Import for *ngIf

@Component({
  selector: 'app-login',
  standalone: true, // ✅ Mark as standalone
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  imports: [CommonModule] // ✅ Import CommonModule for *ngIf
})
export class LoginComponent  {
  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  errorMessage: string = ''; // ✅ Declare errorMessage for *ngIf

  constructor(private router: Router) { }

  login() {
    const username = this.usernameInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;

    if (username === 'admin' && password === 'adminadmin') {
      this.router.navigate(['/dashboard']); // ✅ Fixed: Removed unnecessary `\`
    } else {
      this.errorMessage = 'Invalid credentials'; // ✅ Show error message
    }
  }
}
