import { Component, inject, OnInit } from '@angular/core';
import {
  IAPIResponseRelationshipsMessageModel,
  IAPIResponseRelationshipsPendingRequests,
  IPendingFriendRequests,
} from '../../model/interfaces/relationships';
import { RelationshipsService } from '../../services/relationships.service';
import { CommonModule } from '@angular/common';
import { RespondeAddFriend } from '../../model/class/relationships';
import { Constant } from '../../constant/constant';

@Component({
  selector: 'app-pending-friend-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-friend-requests.component.html',
  styleUrl: './pending-friend-requests.component.css',
})
export class PendingFriendRequestsComponent implements OnInit {
  pendingRequestsList: IPendingFriendRequests[] = [];
  relationshipService = inject(RelationshipsService);
  respondeFriendRequest: RespondeAddFriend = new RespondeAddFriend();

  ngOnInit(): void {
    this.relationshipService.getPendingRequests().subscribe(
      (res: IAPIResponseRelationshipsPendingRequests) => {
        this.pendingRequestsList = res.pending_requests;
      },
      (error) => {
        alert('ERROR Geting Pending Friend Requests');
      }
    );
  }

  onAcceptOrReject(requestid: string, status: string) {
    this.respondeFriendRequest.request_id = requestid;
    this.respondeFriendRequest.status = status;

    this.relationshipService
      .respondeFriendRequest(this.respondeFriendRequest)
      .subscribe(
        (res: IAPIResponseRelationshipsMessageModel) => {
          alert(res.message);
          this.pendingRequestsList = this.pendingRequestsList.filter(
            (request) => request.requestid !== requestid
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
