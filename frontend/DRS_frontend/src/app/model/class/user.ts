export class UserRegister {
  username: string;
  lastname: string;
  name: string;
  password: string;
  email: string;
  address: string;
  city: string;
  state: string;
  phonenumber: string;

  constructor() {
    (this.username = ''),
      (this.lastname = ''),
      (this.name = ''),
      (this.password = ''),
      (this.email = ''),
      (this.address = ''),
      (this.city = ''),
      (this.state = ''),
      (this.phonenumber = '');
  }
}

export class UserLogin {
  username: string;
  password: string;

  constructor() {
    (this.username = ''), (this.password = '');
  }
}

export class Username {
  username: string;

  constructor() {
    this.username = '';
  }
}
