import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupService } from '../Services/popup.service';
import { ApiService } from '../Services/api.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  showPopup = false;
  isLoggedIn = false;
  registrationSuccess = false;
  loginSuccess = false;
  isRegistering = false;

  apiService = inject(ApiService);
  private titleService = inject(Title);
  private router = inject(Router);

  ngOnInit(): void {
    this.titleService.setTitle('RetroScore | Register');
    this.isLoggedIn = this.apiService.isLoggedIn();
  }

  constructor(private popupService: PopupService, private fb: FormBuilder) {
    this.popupService.popupVisible$.subscribe((visible) => {
      this.showPopup = visible;
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  closePopup() {
    this.popupService.hidePopup();
    if (this.isLoggedIn) {
      window.location.reload();
    }
  }

  toggleRegister() {
    this.isRegistering = !this.isRegistering;
  }

  clearForm() {
    this.loginForm.reset();
    this.registerForm.reset();
  }

  register() {
    if (this.registerForm.valid && this.registerForm.value.password === this.registerForm.value.confirmPassword) {
      const userData = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };

      this.apiService.createUser(userData).subscribe(
        (response: any) => {
          console.log('Usuario registrado:', response);
          this.clearForm();
          this.registrationSuccess = true;
          setTimeout(() => {
            this.registrationSuccess = false;
            this.closePopup();
          }, 3000);
          localStorage.setItem('user', JSON.stringify(response));
          this.router.navigate(['/']);
          this.isLoggedIn = true;
        },
        (error: any) => {
          if (error.status === 409) {
            console.error('Error: El correo ya está registrado.');
            alert('Este correo ya está registrado. Por favor, usa otro.');
          } else {
            console.error('Error desconocido:', error);
            alert('Ocurrió un error. Por favor, inténtalo más tarde.');
          }
        }
      );
    } else {
      alert('Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.');
    }
  }

  login() {
    if (this.loginForm.valid) {
      const userData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
      this.apiService.login(userData).subscribe(
        (response: any) => {
          console.log(response);
          localStorage.setItem('user', JSON.stringify(response));
          this.clearForm();
          this.loginSuccess = true;
          setTimeout(() => {
            this.loginSuccess = false;
            this.closePopup();
          }, 3000);
          this.router.navigate(['/']);
          this.isLoggedIn = true;
        },
        (error: any) => {
          console.error('Error de inicio de sesión:', error);
          alert('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
        }
      );
    }
  }

  logout() {
    this.apiService.logout();
    this.isLoggedIn = false;
    this.showPopup = false;
    window.location.reload();
  }
}