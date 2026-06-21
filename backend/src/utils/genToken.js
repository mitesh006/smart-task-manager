import jwt from 'jsonwebtoken'


const generateTokenAndSetCookie = (res, userID) => {

    const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    })


}

export default generateTokenAndSetCookie