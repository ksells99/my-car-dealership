import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean;
  loggedInUser: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit(): void {
    // Subscribe to auth status
    this.authService.getAuth().subscribe((auth) => {
      // If logged in...
      if (auth) {
        // Set logged in to true, get user's email address
        this.isLoggedIn = true;
        this.loggedInUser = auth.email;

        // Else if not logged in
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  onLogoutClick() {
    // Call logout function in authService injected above
    this.authService.logout();
    this.isLoggedIn = false;

    this.router.navigate(['/login']);
  }
}
