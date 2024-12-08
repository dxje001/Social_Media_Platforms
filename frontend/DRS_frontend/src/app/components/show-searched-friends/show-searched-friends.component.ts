import { Component, inject } from '@angular/core';
import { IUser } from '../../model/interfaces/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { RelationshipsService } from '../../services/relationships.service';
import { RequestAddFriend } from '../../model/class/relationships';
import { IAPIResponseRelationshipsMessageModel } from '../../model/interfaces/relationships';
import { Constant } from '../../constant/constant';

@Component({
  selector: 'app-show-searched-friends',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-searched-friends.component.html',
  styleUrl: './show-searched-friends.component.css',
})
export class ShowSearchedFriendsComponent {
  userList: IUser[] = [];
  requestAddFriendObj: RequestAddFriend = new RequestAddFriend();
  relationshipsService: RelationshipsService = inject(RelationshipsService);

  constructor(private userService: UserService) {
    // Subscribe to the user list observable
    this.userService.userList$.subscribe((userList) => {
      this.userList = userList; // Update the user list when it changes
    });
  }

  onAddFriend(receiverUsername: string) {
    this.requestAddFriendObj.receiver_id = receiverUsername;
    this.relationshipsService.addFriend(this.requestAddFriendObj).subscribe(
      (res: IAPIResponseRelationshipsMessageModel) => {
        if (res.message == 'Friend request sent') {
          alert('Friend request sent');
          this.userList = this.userList.filter(
            (user) => user.username !== receiverUsername
          );
          const updatedUserList = this.userList.filter(
            (user) => user.username !== receiverUsername
          );
          this.userService.setUserList(updatedUserList);
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
