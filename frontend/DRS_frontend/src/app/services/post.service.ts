import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IAPIResponsePostDataModel,
  IAPIResponsePostMessageModel,
} from '../model/interfaces/post';
import { environment } from '../../environments/environment.development';
import { Constant } from '../constant/constant';
import { PostId, Post } from '../model/class/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  createPost(obj: FormData): Observable<IAPIResponsePostMessageModel> {
    return this.http.post<IAPIResponsePostMessageModel>(
      environment.API_URL + Constant.API_METHOD.CREATE_POST,
      obj
    );
  }

  getMyFriendsPosts(): Observable<IAPIResponsePostDataModel> {
    return this.http.get<IAPIResponsePostDataModel>(
      environment.API_URL + Constant.API_METHOD.GET_MY_FRIENDS_POSTS
    );
  }

  getUnapprovedPosts(): Observable<any[]> {
    return this.http.get<any[]>(
      environment.API_URL + Constant.API_METHOD.UNAPPROVED_POSTS
    );
  }

  getApprovedPostsForUser(): Observable<IAPIResponsePostDataModel> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage or another source
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<IAPIResponsePostDataModel>(
      `${environment.API_URL}${Constant.API_METHOD.APPROVED_POSTS_FOR_USER}`,
      { headers }
    );
  }

  approvePost(obj: PostId): Observable<IAPIResponsePostMessageModel> {
    return this.http.post<IAPIResponsePostMessageModel>(
      environment.API_URL + Constant.API_METHOD.APPROVE_POST,
      obj
    );
  }

  rejectPost(obj: PostId): Observable<IAPIResponsePostMessageModel> {
    return this.http.post<IAPIResponsePostMessageModel>(
      environment.API_URL + Constant.API_METHOD.REJECT_POST,
      obj
    );
  }

  deletePost(obj: PostId): Observable<IAPIResponsePostMessageModel> {
    return this.http.post<IAPIResponsePostMessageModel>(
      environment.API_URL + Constant.API_METHOD.DELETE_POST,
      obj
    );
  }

  getPostInfoForEdit(post_id: string): Observable<IAPIResponsePostDataModel> {
    return this.http.get<IAPIResponsePostDataModel>(
      `${environment.API_URL}${Constant.API_METHOD.EDIT_POST}?post_id=${post_id}`
    );
  }

  editPost(formData: FormData): Observable<IAPIResponsePostMessageModel> {
    return this.http.put<IAPIResponsePostMessageModel>(
      `${environment.API_URL}${Constant.API_METHOD.EDIT_POST}?post_id=ll`,
      formData
    );
  }
}
