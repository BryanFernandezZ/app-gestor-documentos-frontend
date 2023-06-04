import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  passwordPattern: RegExp = new RegExp("(?=.*[\\!@#$%^&*()\\\\{}\\-_+=~`|:;\"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{5,}");

  loginForm: FormGroup = new FormGroup({
    username: new FormControl("", [Validators.required, Validators.minLength(4)]),
    password: new FormControl("", [Validators.required, Validators.pattern(this.passwordPattern)]),
  });

  submited: boolean = false;
  isLoading: boolean = false;
  isUnauthorized: boolean = false;
  token: string = "";

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

  }

  login() {
    this.submited = true;

    if (this.loginForm.valid) {
      
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (data) => this.token = data.token,
        error: (err) => {
          this.isLoading = false;
          if(err.status == 401) this.isUnauthorized = true;
          console.error(err);
        },
        complete: () => {
          this.isLoading = false;
          this.guardarToken(this.token);
          this.router.navigateByUrl("/");
        }
      })

    } else alert("Something went wrong");
  }

  guardarToken(token: string) {
    localStorage.setItem("acctkn", token);
  }

  esconderAlerta() {
    this.isUnauthorized = false;
  }
}
