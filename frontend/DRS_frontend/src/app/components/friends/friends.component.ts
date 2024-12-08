import { Component } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ShowSearchedFriendsComponent } from '../show-searched-friends/show-searched-friends.component';
import { CommonModule } from '@angular/common';
import { PendingFriendRequestsComponent } from '../pending-friend-requests/pending-friend-requests.component';
import { MyFriendsComponent } from '../my-friends/my-friends.component';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [
    SearchBarComponent,
    ShowSearchedFriendsComponent,
    CommonModule,
    PendingFriendRequestsComponent,
    MyFriendsComponent,
  ],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css',
})
export class FriendsComponent {
  currentComponent: string = 'search';

  changeTab(tabName: string) {
    this.currentComponent = tabName;
  }
}
