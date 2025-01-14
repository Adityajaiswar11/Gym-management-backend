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
            user: { id: user._id, email: user.email, name: user.name }, // Return safe user info
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await user.save(); // Save the token to the user in the database

        // Email content
        // const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        
        const mailOptions = {
            to: email,
            subject: "Aditya love you so much",
            html: `
                <p>Hi, my love ${user.name},</p>
                <p>As I sit down to put my thoughts into words, I can’t help but smile at how lucky I am to have you in my life. You are my sunshine on the cloudiest days, my calm in the chaos, and the reason my heart beats with so much joy</p>
                <p>Every moment with you feels like magic. From the way your eyes light up when you laugh to the warmth of your hand in mine, you make my world infinitely brighter. You have this incredible ability to make even the simplest moments feel extraordinary—whether it’s sharing a quiet meal, walking under the stars, or simply talking about life</p>
                <p>I want you to know how deeply I admire you. Your kindness, strength, and the way you see the beauty in everything inspire me to be a better person every single day. You make me believe in love, in dreams, and in the infinite possibilities of life</p>
                <p>I want you to know that I love you too. I want you to feel the same way I do. I want you to know that I'm always there for you, no matter how far away we are. And I want you to know that I love you the way you are.Thank you for being my partner, my confidant, and my greatest support. Thank you for loving me with all your heart and for allowing me to love you with all of mine. You’ve turned my world into a place where love is boundless, and happiness knows no limits.

I can’t wait to create more memories with you—traveling to places we’ve always dreamed of, dancing to our favorite songs, and building a life that reflects the love we share. With you by my side, I feel like I can conquer anything.</p>
 <P>Always remember this: You are my everything. My heart is yours, today and forever. I love you more than words could ever express, and I promise to cherish you every single day of my life.</p>

                <br />
                <p>With all my love,</p>
                <p>YOUR MAN ADITYA</p>
               
                
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
