"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
// import dotenv from 'dotenv';
const app_1 = __importDefault(require("../../config/app"));
class GoogleOAuthServiceProvider {
    constructor() {
        this.client = new google_auth_library_1.OAuth2Client(app_1.default.google.google_client_id, app_1.default.google.google_client_secret, app_1.default.google.google_redirect_uri);
        // Bind methods to ensure proper `this` reference
        this.generateAuthUrl = this.generateAuthUrl.bind(this);
        this.getToken = this.getToken.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
    }
    // Method to generate Google Auth URL
    generateAuthUrl() {
        return this.client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
        });
    }
    // Method to exchange the authorization code for tokens
    async getToken(data) {
        try {
            const { code } = data;
            const { tokens } = await this.client.getToken(code);
            this.client.setCredentials(tokens);
        }
        catch (error) {
            // Handle error (logging, etc.)
            console.error('Error getting tokens: ', error);
            throw error;
        }
    }
    // Method to fetch user info after setting the tokens
    async getUserInfo() {
        try {
            const response = await this.client.request({
                url: 'https://www.googleapis.com/oauth2/v3/userinfo',
            });
            return response.data;
        }
        catch (error) {
            // Handle error
            console.error('Error fetching user info: ', error);
            throw error;
        }
    }
    // Helper method to handle callback and get user info
    async handleCallback(code) {
        await this.getToken({ code });
        return this.getUserInfo();
    }
}
exports.default = new GoogleOAuthServiceProvider();
//# sourceMappingURL=googleOAuthServiceProvider.js.map