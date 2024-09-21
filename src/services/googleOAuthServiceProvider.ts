import { OAuth2Client } from 'google-auth-library';
// import dotenv from 'dotenv';
import config from "../../config/app";
// dotenv.config();

interface GoogleTokenData {
  code: string;
}

class GoogleOAuthServiceProvider {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      config.google.google_client_id,
      config.google.google_client_secret,
      config.google.google_redirect_uri
    );

    // Bind methods to ensure proper `this` reference
    this.generateAuthUrl = this.generateAuthUrl.bind(this);
    this.getToken = this.getToken.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  // Method to generate Google Auth URL
  public generateAuthUrl(): string {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    });
  }

  // Method to exchange the authorization code for tokens
  public async getToken(data: GoogleTokenData): Promise<void> {
    try {
      const { code } = data;
      const { tokens } = await this.client.getToken(code);
      this.client.setCredentials(tokens);
    } catch (error) {
      // Handle error (logging, etc.)
      console.error('Error getting tokens: ', error);
      throw error;
    }
  }

  // Method to fetch user info after setting the tokens
  public async getUserInfo(): Promise<any> {
    try {
      const response = await this.client.request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });
      return response.data;
    } catch (error) {
      // Handle error
      console.error('Error fetching user info: ', error);
      throw error;
    }
  }

  // Helper method to handle callback and get user info
  public async handleCallback(code: string): Promise<any> {
    await this.getToken({ code });
    return this.getUserInfo();
  }
}

export default new GoogleOAuthServiceProvider();
