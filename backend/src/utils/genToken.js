import jwt from 'jsonwebtoken'


const generateTokenAndSetCookie = (res, userID) => {

    const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })

    const cookieOptions = {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
        secure: true
    }

    res.cookie('token', token, cookieOptions)


}

export default generateTokenAndSetCookie