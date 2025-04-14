import jwt from "jsonwebtoken"

export const generateToken = (UserID, res) => {
    const token = jwt.sign({UserID}, process.env.JWT_SECRET, 
        {    expiresIn: '7d' });

        //sending token to cookie
    res.cookie('jwt', token, {
        httpOnly: true, //prevents xss attacks cross-site scripting attacks
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, //milliseconds
    });
    return token;
}