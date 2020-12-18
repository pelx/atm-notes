export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private tokenExpiryDate: Date
  ) { }

  get token() {
    if (!this.tokenExpiryDate || this.tokenExpiryDate <= new Date()) {
      return null;
    }
    return this._token;
  }

  get tokenDuration() {
    if (!this._token) {
      return 0;
    }
    const duration = this.tokenExpiryDate.getTime() - new Date().getTime();
    return duration;
  }
}
