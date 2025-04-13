import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isSubmitting = false;
  
  // Estados para mostrar resultados
  usernameChecked = false;
  usernameValue = '';
  isRegistered = false;
  isDisabled = false;
  passwordValue = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.usernameChecked = false;
    this.usernameValue = this.forgotForm.value.username;
    this.isDisabled = false;

    this.authService.forgotPassword({ username: this.usernameValue }).subscribe({
      next: (result) => {
        this.usernameChecked = true;
        
        if (result) {
          this.isRegistered = true;
          if (result.isDisabled) {
            this.isDisabled = true;
            this.passwordValue = '';
          } else {
            this.isDisabled = false;
            this.passwordValue = result.password || '';
          }
        } else {
          this.isRegistered = false;
          this.passwordValue = '';
        }
      },
      error: (error) => {
        console.error('Error en recuperación:', error);
        this.usernameChecked = true;
        this.isRegistered = false;
        this.isDisabled = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
} 