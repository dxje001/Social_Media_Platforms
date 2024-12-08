import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  IAPIResponseUserDataModel,
  IAPIResponseUserMessageModel,
  IUser,
} from '../../model/interfaces/user';
import { UserService } from '../../services/user.service';
import { Constant } from '../../constant/constant';
import { Username } from '../../model/class/user';

@Component({
  selector: 'app-blacklisted-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blacklisted-users.component.html',
  styleUrl: './blacklisted-users.component.css',
})
export class BlacklistedUsersComponent implements OnInit {
  BlacklistedUsersList: IUser[] = [];
  userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getAllBlacklistedUsers().subscribe(
      (res: IAPIResponseUserDataModel) => {
        this.BlacklistedUsersList = res.data;
      },
      (error) => {
        if (
          (error.status === 400 || error.status === 500) &&
          error.error.message
        ) {
          alert(error.error.message);
        } else {
          alert(Constant.ALERT_MESSAGES.UNKONOW_ERROR);
        }
        console.error('Error:', error);
      }
    );
  }

  onUnblockUser(username: string) {
    const userObj = new Username();
    userObj.username = username;

    this.userService.unblockUser(userObj).subscribe(
      (res: IAPIResponseUserMessageModel) => {
        alert(res.message);
        this.BlacklistedUsersList = this.BlacklistedUsersList.filter(
          (user) => user.username !== username
        );
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
