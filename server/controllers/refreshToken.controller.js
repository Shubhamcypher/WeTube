import jwt from 'jsonwebtoken'
import refreshTokenModel from '../model/refreshToken.model.js';

export const refreshAccessToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return next(createError(401, "No refresh token provided"));

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
        const storedToken = await refreshToken.findOne({ userId: decoded.id, token: refreshToken });//this token is stored in database

        if (!storedToken || new Date() > storedToken.expiresAt) {
            await refreshTokenModel.deleteOne({ _id: storedToken._id });
            return next(createError(401, "Invalid or expired refresh token"));
        }

        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1m' });

        res
            .cookie("access_token", newAccessToken, options)
            .status(200)
            .json({ accessToken: newAccessToken });

    } catch (error) {
        next(error);
    }
};