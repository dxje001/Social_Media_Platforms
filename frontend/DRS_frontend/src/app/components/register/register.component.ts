import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserRegister } from '../../model/class/user';
import { UserService } from '../../services/user.service';
import { IAPIResponseUserMessageModel } from '../../model/interfaces/user';
import { Router } from '@angular/router';
import { Constant } from '../../constant/constant';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  userObj: UserRegister = new UserRegister();
  userService = inject(UserService);
  router = inject(Router);

  onRegisterUser() {
    this.userService.registerUser(this.userObj).subscribe(
      (res: IAPIResponseUserMessageModel) => {
        if (res.message === 'Created') {
          alert('Client Created Successfully');
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
