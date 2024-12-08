import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import {
  IAPIResponseUserDataModel,
  IAPIResponseUserTokenModel,
} from '../../model/interfaces/user';
import { FormsModule } from '@angular/forms';
import { UserRegister } from '../../model/class/user';
import { Constant } from '../../constant/constant';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-user-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.css',
})
export class EditUserProfileComponent implements OnInit, OnDestroy {
  userObj: UserRegister = new UserRegister();

  subscriptionList: Subscription[] = [];

  userService = inject(UserService);

  isLoader: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.subscriptionList.push(
      this.userService.getUserInfoForEdit().subscribe(
        (res: IAPIResponseUserDataModel) => {
          this.userObj = res.data;
          this.isLoader = false;
        },
        (error) => {
          alert(error.error.message);
          this.isLoader = false;
        }
      )
    );
  }

  onEditUser() {
    this.userService.editUser(this.userObj).subscribe(
      (res: IAPIResponseUserTokenModel) => {
        if (res.message === 'Ok') {
          this.authService.login(res.token);
          alert('Profile Updated Successfully');
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

  ngOnDestroy(): void {
    this.subscriptionList.forEach((element) => {
      element.unsubscribe();
    });
  }
}
