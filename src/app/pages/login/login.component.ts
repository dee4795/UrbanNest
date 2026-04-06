import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';
  name = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  submit(): void {
    this.errorMessage = '';
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';

    if (this.mode === 'register') {
      const result = this.authService.register(this.name, this.email, this.password);
      if (!result.ok) {
        this.errorMessage = result.message ?? 'Unable to register.';
        return;
      }
      this.router.navigateByUrl(returnUrl);
      return;
    }

    const result = this.authService.login(this.email, this.password);
    if (!result.ok) {
      this.errorMessage = result.message ?? 'Unable to login.';
      return;
    }

    this.router.navigateByUrl(returnUrl);
  }
}
