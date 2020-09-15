import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  password2: string;
  loading: boolean = false;

  // Inject authservice & flashMessages as dependency
  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.password != this.password2) {
      this.flashMessage.show('Please ensure both passwords match.', {
        cssClass: 'alert-danger mt-3 mx-auto auth-toast',
        timeout: 3000,
      });
    } else {
      this.loading = true;
      // Call register function from authService injected above - pass in email/pw (modelled from form inputs)
      this.authService
        .register(this.email, this.password)
        // Returns a promise so use .then - if successful
        .then((res) => {
          // Show success message
          this.flashMessage.show(
            'Registration successful. You are now logged into MyCarDealership',
            { cssClass: 'alert-success mt-3', timeout: 3000 }
          );

          this.loading = false;

          // Redirect to dashboard as will automatically be logged in
          this.router.navigate(['dashboard']);
        })

        .catch((err) => {
          this.loading = false;

          this.flashMessage.show(err.message, {
            cssClass: 'alert-danger mt-3 mx-auto auth-toast',
            timeout: 3000,
          });
        });
    }
  }
}
