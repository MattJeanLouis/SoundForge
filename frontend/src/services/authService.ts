interface AuthToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

class AuthService {
  private static TOKEN_KEY = 'soundforge_auth_token';

  static setToken(token: AuthToken): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
  }

  static getToken(): AuthToken | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token ? JSON.parse(token) : null;
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default AuthService;
