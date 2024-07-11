import jwt from 'jsonwebtoken';

import refreshTokenModel from './model/refreshToken.model.js';
import { createError } from './error.js';

export const verifyToken = async (req, res, next) => {
    console.log("I am in token\n");
    const token = req.cookies.access_token;
    console.log(token);
    if (!token) {
        return next(createError(405, "No token found in cookies"));
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Access token expired, check refresh token
                const refreshToken = req.body.refreshToken; // Get refresh token from the request body
                if (!refreshToken) return next(createError(401, "No refresh token provided"));

                try {
                    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
                    const storedToken = await refreshTokenModel.findOne({ userId: decoded.id, token: refreshToken });

                    if (!storedToken || new Date() > storedToken.expiresAt) {
                        if (storedToken) {
                            await refreshTokenModel.deleteOne({ _id: storedToken._id }); // Delete the expired refresh token
                        }
                        return next(createError(401, "Invalid or expired refresh token"));
                    }

                    const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_KEY, { expiresIn: '2m' });

                    res
                        .cookie("access_token", newAccessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'None',
                        })
                        .status(200)
                        .json({ accessToken: newAccessToken });

                } catch (refreshError) {
                    return next(createError(401, "Invalid or expired refresh token"));
                }
            } else {
                return next(createError(400, "Token verification failed!!"));
            }
        } else {
            req.user = user;
            next();
        }
    });
};
