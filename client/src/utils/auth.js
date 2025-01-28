import decode from 'jwt-decode';
import { store } from '../store/store'; // Import the store
import { loginSuccess, logout } from '../store/slices/authSlice'; // Import the loginSuccess and logout actions

class AuthService {
  getProfile() {
    return decode(this.getToken());
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
      const token = this.getToken();
      const isValid = !!token && !this.isTokenExpired(token);
      if (isValid) {
        store.dispatch(loginSuccess({ token, user: this.getProfile() }));
      }
      return isValid;
    }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        store.dispatch(logout());
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    store.dispatch(loginSuccess({
      token: idToken,
      user: decode(idToken)
    }));
    window.location.assign('/');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // Reset the app state
    store.dispatch(logout());
    window.location.assign('/');
  }
}

const Auth = new AuthService();

export default new AuthService();
