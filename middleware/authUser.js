import jwt from "jsonwebtoken"

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again"
      })
    }

    const token = authHeader.split(" ")[1]  // remove "Bearer"

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = decoded.id

    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({
      success: false,
      message: "Invalid token"
    })
  }
}

export default authUser
