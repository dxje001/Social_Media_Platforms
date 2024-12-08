export class RequestAddFriend {
  receiver_id: string;

  constructor() {
    this.receiver_id = '';
  }
}

export class RespondeAddFriend {
  request_id: string;
  status: string;

  constructor() {
    (this.request_id = ''), (this.status = '');
  }
}

export class DeleteFriend {
  request_id: string;

  constructor() {
    this.request_id = '';
  }
}
