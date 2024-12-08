import { Component, inject, OnInit } from '@angular/core';
import {
  IAPIMyFriends,
  IMyFriends,
} from '../../model/interfaces/relationships';
import { RelationshipsService } from '../../services/relationships.service';
import { CommonModule } from '@angular/common';
import { Constant } from '../../constant/constant';
import { DeleteFriend } from '../../model/class/relationships';

@Component({
  selector: 'app-my-friends',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-friends.component.html',
  styleUrl: './my-friends.component.css',
})
export class MyFriendsComponent implements OnInit {
  myFriendsList: IMyFriends[] = [];
  relationshipService = inject(RelationshipsService);

  ngOnInit(): void {
    this.relationshipService.getMyFriends().subscribe(
      (res: IAPIMyFriends) => {
        this.myFriendsList = res.friends;
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

  onDeleteFriend(requestId: string): void {
    const deleteFriendRequest = new DeleteFriend();
    deleteFriendRequest.request_id = requestId;

    this.relationshipService.DeleteFriend(deleteFriendRequest).subscribe({
      next: (response) => {
        console.log(response.message); // Uspešan odgovor
        this.myFriendsList = this.myFriendsList.filter(
          (friend) => friend.requestid !== requestId
        );
      },
      error: (error) => {
        console.error('Error deleting friend:', error);
      },
    });
  }
}
