import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IAPIResponseUserDataModel,
  IAPIResponseUserMessageModel,
  IAPIResponseUserTokenModel,
  IUser,
} from '../model/interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserLogin, Username, UserRegister } from '../model/class/user';
import { environment } from '../../environments/environment.development';
import { Constant } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userListSubject = new BehaviorSubject<IUser[]>([]);
  userList$ = this.userListSubject.asObservable();

  setUserList(userList: IUser[]) {
    this.userListSubject.next(userList);
  }
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<IAPIResponseUserDataModel> {
    return this.http.get<IAPIResponseUserDataModel>(
      environment.API_URL + Constant.API_METHOD.GET_ALL_USERS
    );
  }

  getAllBlacklistedUsers(): Observable<IAPIResponseUserDataModel> {
    return this.http.get<IAPIResponseUserDataModel>(
      environment.API_URL + Constant.API_METHOD.GET_ALL_BLACKLISTED_USERS
    );
  }

  registerUser(obj: UserRegister): Observable<IAPIResponseUserMessageModel> {
    return this.http.post<IAPIResponseUserMessageModel>(
      environment.API_URL + Constant.API_METHOD.REGISTER_USER,
      obj
    );
  }

  unblockUser(obj: Username): Observable<IAPIResponseUserMessageModel> {
    return this.http.post<IAPIResponseUserMessageModel>(
      environment.API_URL + Constant.API_METHOD.UNBLOCK_USER,
      obj
    );
  }

  loginUser(obj: UserLogin): Observable<IAPIResponseUserTokenModel> {
    return this.http.post<IAPIResponseUserTokenModel>(
      environment.API_URL + Constant.API_METHOD.LOGIN_USER,
      obj
    );
  }

  getUserInfoForEdit(): Observable<IAPIResponseUserDataModel> {
    return this.http.get<IAPIResponseUserDataModel>(
      environment.API_URL + Constant.API_METHOD.EDIT_PROFILE
    );
  }

  editUser(obj: UserRegister): Observable<IAPIResponseUserTokenModel> {
    return this.http.post<IAPIResponseUserTokenModel>(
      environment.API_URL + Constant.API_METHOD.EDIT_PROFILE,
      obj
    );
  }
}
