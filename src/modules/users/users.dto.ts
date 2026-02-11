export class usersDTO {
  login: string;
  password: string;
  name: string;
  surname: string;
}

export class UserResponseDTO {
  login: string;
  name: string;
  surname: string;

  constructor(user: { login: string; name: string; surname: string }) {
    this.login = user.login;
    this.name = user.name;
    this.surname = user.surname;
  }
}
