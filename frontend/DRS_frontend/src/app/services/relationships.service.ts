import { Injectable } from '@angular/core';
import {
  DeleteFriend,
  RequestAddFriend,
  RespondeAddFriend,
} from '../model/class/relationships';
import {
  IAPIMyFriends,
  IAPIResponseRelationshipsMessageModel,
  IAPIResponseRelationshipsPendingRequests,
} from '../model/interfaces/relationships';
import { Constant } from '../constant/constant';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RelationshipsService {
  constructor(private http: HttpClient) {}

  addFriend(
    obj: RequestAddFriend
  ): Observable<IAPIResponseRelationshipsMessageModel> {
    return this.http.post<IAPIResponseRelationshipsMessageModel>(
      environment.API_URL + Constant.API_METHOD.ADD_FRIEND,
      obj
    );
  }

  getPendingRequests(): Observable<IAPIResponseRelationshipsPendingRequests> {
    return this.http.get<IAPIResponseRelationshipsPendingRequests>(
      environment.API_URL + Constant.API_METHOD.GET_FRIEND_REQUESTS
    );
  }

  respondeFriendRequest(
    obj: RespondeAddFriend
  ): Observable<IAPIResponseRelationshipsMessageModel> {
    return this.http.post<IAPIResponseRelationshipsMessageModel>(
      environment.API_URL + Constant.API_METHOD.RESPONDE_FRIEND_REQUEST,
      obj
    );
  }

  getMyFriends(): Observable<IAPIMyFriends> {
    return this.http.get<IAPIMyFriends>(
      environment.API_URL + Constant.API_METHOD.GET_MY_FRIENDS
    );
  }

  DeleteFriend(
    obj: DeleteFriend
  ): Observable<IAPIResponseRelationshipsMessageModel> {
    return this.http.request<IAPIResponseRelationshipsMessageModel>(
      'DELETE',
      environment.API_URL + Constant.API_METHOD.DELETE_FRIEND,
      {
        body: obj,
      }
    );
  }
}
