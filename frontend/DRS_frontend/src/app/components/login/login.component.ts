import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UserLogin, UserRegister } from '../../model/class/user';
import { FormsModule } from '@angular/forms';
import { IAPIResponseUserTokenModel } from '../../model/interfaces/user';
import { Constant } from '../../constant/constant';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  userObj: UserLogin = new UserLogin();
  userService = inject(UserService);
  router = inject(Router);

  constructor(private authService: AuthService) {}

  onLoginUser() {
    this.userService.loginUser(this.userObj).subscribe(
      (res: IAPIResponseUserTokenModel) => {
        if (res.message === 'Ok') {
          this.authService.login(res.token);
          this.router.navigate(['/index']);
        } else {
          alert(Constant.ALERT_MESSAGES.UNKNOWN_RESPONSE);
        }
      },
      (error) => {
        if (error.status === 400 && error.error.message) {
          alert(error.error.message);
        } else {
          alert(Constant.ALERT_MESSAGES.UNKONOW_ERROR);
        }
        console.error('Error:', error);
      }
    );
  }
}
