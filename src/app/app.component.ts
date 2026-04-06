import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly darkModeKey = 'urbannest_dark_mode';
  isDarkMode = false;
  routeAnimating = true;
  showIntroLoader = false;
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeTheme();
    this.setupRouteTransitions();
    this.initializeIntroLoader();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem(this.darkModeKey, this.isDarkMode ? '1' : '0');
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  private initializeTheme(): void {
    this.isDarkMode = localStorage.getItem(this.darkModeKey) === '1';
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  private setupRouteTransitions(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.routeAnimating = false;
        requestAnimationFrame(() => {
          this.routeAnimating = true;
        });
      });
  }

  private initializeIntroLoader(): void {
    this.showIntroLoader = true;
    setTimeout(() => {
      this.showIntroLoader = false;
    }, 2400);
  }
}
