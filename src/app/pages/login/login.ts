import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  username = '';
  password = '';
  rememberMe = false;

  isLoading = signal(false);
  errorMessage = signal('');

  onSubmit(): void {

    this.errorMessage.set('');

    if (!this.username.trim() || !this.password) {
      this.errorMessage.set(
        'من فضلك أدخل اسم المستخدم وكلمة المرور'
      );
      return;
    }
    this.isLoading.set(true);
    this.authService
      .login(
        this.username.trim(),
        this.password,
        this.rememberMe
      )
      .subscribe({
        next: async () => {
          this.isLoading.set(false);
          if (!this.authService.isLoggedIn()) {
            this.errorMessage.set(
              'تم تسجيل الدخول ولكن لم يتم حفظ جلسة الدخول'
            );
            return;
          }

          const returnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl');
          const targetUrl =
            returnUrl && returnUrl.startsWith('/')
              ? returnUrl
              : '/dashboard';
          const navigationResult =
            await this.router.navigateByUrl(targetUrl, {
              replaceUrl: true
            });
          if (!navigationResult) {
            this.errorMessage.set(
              'تم تسجيل الدخول ولكن تعذر فتح لوحة التحكم'
            );
          }

        },
        error: (error: unknown) => {

          this.isLoading.set(false);

          this.errorMessage.set(
            error instanceof Error
              ? error.message
              : 'تعذر تسجيل الدخول. حاول مرة أخرى.'
          );

        }

      });
  }
}
