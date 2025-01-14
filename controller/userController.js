const bcrypt = require('bcrypt');
const User = require('../model/userModel'); // Import your User model
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
const createUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Checking if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the saltRounds

        // Create a new user with the hashed password
        const user = new User({
            ...req.body,          // Spread the other fields from req.body
            password: hashedPassword  // Assign the hashed password
        });
        
        await user.save();  // Save the user to the database
        user.password = undefined;

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: error.message});
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create a payload for the JWT
        const payload = {
            user:user._id
        };

        // Generate the JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Send the response with the token
        res.json({
            message: "Logged in successfully",
            token,
            user: { id: user._id, email: user.email, name: user.name }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a password reset token
        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Token valid for 1 hour
        );

        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Generate the reset password link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Email content
        const mailOptions = {
            to: email,
            subject: "Password Reset Request",
            html: `
                <h2>Password Reset Request</h2>
                <p>Hi ${user.name || "User"},</p>
                <p>You requested to reset your password. Please click the link below to reset your password:</p>
                <a href="${resetLink}" style="text-decoration: none; color: #007bff; font-weight: bold;">Reset Password</a>
                <p>This link is valid for 1 hour. If you did not request this, please ignore this email.</p>
                <br />
                <p>Thank you,</p>
            `,
        };

        // Send the email
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error sending email:", err);
                return res.status(500).json({ message: "Error sending email" });
            }
            console.log("Email sent:", info.response);
            res.status(200).json({ message: "Password reset email sent" });
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = { createUser,login,forgetPassword }
