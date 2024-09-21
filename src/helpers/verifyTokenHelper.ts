import jwt from 'jsonwebtoken';
import config from '../../config/app'

export const verifyToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, config.jwt.token_secret);
        return decodedToken;
    } catch (error) {
        return error; // Or handle the error as needed
    }
}