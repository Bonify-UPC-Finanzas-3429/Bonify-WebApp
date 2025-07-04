export class UserProfile {
  constructor(
    public id: number,
    public userId: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phoneNumber: string,
    public profileImage: string,
    public role: string,
  ) {}
}
