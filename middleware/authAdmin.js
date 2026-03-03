// import jwt from "jsonwebtoken"

// // admin authentication middleware  
// const authAdmin = async (req, res, next) => {
//     try {
//         const { atoken } = req.headers
//         if (!atoken) {
//             return res.json({ success: false, message: 'Not Authorized Login Again' })
//         }
//         const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)
//         if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
//             return res.json({ success: false, message: 'Not Authorized Login Again' })
//         }
//         next()
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

// export default authAdmin; 



// gpt authAdmin.js....................................................
import jwt from "jsonwebtoken"

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again"
      })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // optional: check admin role if you add it later
    // if (decoded.role !== "admin") { ... }

    req.adminId = decoded.id
    next()

  } catch (error) {
    console.log(error)
    return res.status(401).json({
      success: false,
      message: "Not Authorized Login Again"
    })
  }
}

export default authAdmin
