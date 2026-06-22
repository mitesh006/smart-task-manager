import jwt from 'jsonwebtoken'


const generateTokenAndSetCookie = (res, userID) => {

    const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
        secure: true
    })


}

export default generateTokenAndSetCookie