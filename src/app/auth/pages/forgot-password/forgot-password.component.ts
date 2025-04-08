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
  emailChecked = false;
  emailValue = '';
  isRegistered = false;
  passwordValue = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.emailChecked = false;
    this.emailValue = this.forgotForm.value.email;

    console.log('Enviando solicitud para:', this.emailValue);

    this.authService.forgotPassword({ email: this.emailValue }).subscribe({
      next: (result) => {
        console.log('Resultado:', result);
        this.emailChecked = true;
        
        if (result) {
          this.isRegistered = true;
          this.passwordValue = result.password;
        } else {
          this.isRegistered = false;
          this.passwordValue = '';
        }
      },
      error: (error) => {
        console.error('Error en recuperación:', error);
        this.emailChecked = true;
        this.isRegistered = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
} 