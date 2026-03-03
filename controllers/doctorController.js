import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"

// ================= LOGIN =================
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await doctorModel.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.json({
            success: true,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// // API to get all doctors list (Public / Admin)
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel
            .find({})
            .select("-password -email")

        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// ================= APPOINTMENTS =================
const appointmentsDoctor = async (req, res) => {
    try {
        const docId = req.docId

        const appointments = await appointmentModel.find({ docId })

        res.json({
            success: true,
            appointments
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ================= CANCEL APPOINTMENT =================
const appointmentCancel = async (req, res) => {
    try {
        const docId = req.docId
        const { appointmentId } = req.body

        const appointment = await appointmentModel.findOne({
            _id: appointmentId,
            docId
        })

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            })
        }

        appointment.cancelled = true
        await appointment.save()

        res.json({
            success: true,
            message: "Appointment Cancelled"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ================= COMPLETE APPOINTMENT =================
const appointmentComplete = async (req, res) => {
    try {
        const docId = req.docId
        const { appointmentId } = req.body

        const appointment = await appointmentModel.findOne({
            _id: appointmentId,
            docId
        })

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            })
        }

        appointment.isCompleted = true
        await appointment.save()

        res.json({
            success: true,
            message: "Appointment Completed"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// API to change doctor availability (Admin + Doctor).............
const changeAvailablity = async (req, res) => {
    try {
        // Doctor → from JWT
        // Admin → from body
        const docId = req.docId || req.body.docId

        if (!docId) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID is required"
            })
        }

        const doctor = await doctorModel.findById(docId)

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            })
        }

        doctor.available = !doctor.available
        await doctor.save()

        res.json({
            success: true,
            message: "Availability changed",
            available: doctor.available
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ================= DOCTOR PROFILE =================
const doctorProfile = async (req, res) => {
    try {
        const docId = req.docId

        const profileData = await doctorModel
            .findById(docId)
            .select("-password")

        res.json({
            success: true,
            profileData
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



// ================= UPDATE PROFILE =================
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.docId
        const { fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, {
            fees,
            address,
            available
        })

        res.json({
            success: true,
            message: "Profile Updated"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ================= DASHBOARD =================
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.docId

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0
        const patients = new Set()

        appointments.forEach(item => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
            patients.add(item.userId.toString())
        })

        res.json({
            success: true,
            dashData: {
                earnings,
                appointments: appointments.length,
                patients: patients.size,
                latestAppointments: appointments.reverse()
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ================= EXPORTS =================
export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile ,
    changeAvailablity,
    doctorList
}
