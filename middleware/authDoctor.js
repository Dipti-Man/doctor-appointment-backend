import jwt from "jsonwebtoken"

// Doctor authentication middleware
const authDoctor = (req, res, next) => {

    const authHeader = req.headers.authorization

    // 1️⃣ Check Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized, login again"
        })
    }

    try {
        // 2️⃣ Extract token
        const token = authHeader.split(" ")[1]

        // 3️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 4️⃣ Validate payload
        if (!decoded || !decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid doctor token"
            })
        }

        // 5️⃣ Attach doctor id safely
        req.docId = decoded.id

        next()

    } catch (error) {
        console.log("authDoctor error:", error.message)
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}

export default authDoctor
