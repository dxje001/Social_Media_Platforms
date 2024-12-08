export interface IPendingFriendRequests {
  requestid: string;
  username: string;
  name: string;
  lastname: string;
  email: string;
  address: string;
  phonenumber: string;
  state: string;
  city: string;
}

export interface IAPIResponseRelationshipsMessageModel {
  message: string;
}

export interface IAPIResponseRelationshipsPendingRequests {
  pending_requests: any;
}

export interface IMyFriends {
  requestid: string;
  username: string;
  name: string;
  lastname: string;
  email: string;
  address: string;
  phonenumber: string;
  state: string;
  city: string;
}

export interface IAPIMyFriends {
  friends: any;
}
