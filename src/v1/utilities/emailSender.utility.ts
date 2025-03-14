import nodemailer from "nodemailer";
import { AppConfig } from "../configs/app.config";

/**
 * * Configure the email transporter using SMTP details
 * @host, @port, @auth - SMTP configuration from environment variables
 */
const transporter = nodemailer.createTransport({
  host: AppConfig.emailHost, // Your SMTP host (e.g., 'smtp.gmail.com')
  port: parseInt(AppConfig.emailPort || "587"), // Port (587 for TLS, 465 for SSL)
  secure: AppConfig.emailSecure === "false", // true for 465, false for other ports
  auth: {
    user: AppConfig.emailUser, // Email username from environment variables
    pass: AppConfig.emailPassword, // Email password from environment variables
  },
});

/**
 * * Send sign-up confirmation email to the user's email
 * @function sendSignUpEmail
 * @param {email} - Recipient's email address
 * @param {username} - User's chosen username
 * @param {password} - User's password
 */
export const sendSignUpEmail = async (
  email: string,
  username: string,
  password: string
) => {
  try {
    /**
     * * Mail options including sender, recipient, subject, and content (both text and HTML)
     */
    const mailOptions = {
      from: AppConfig.emailFrom,
      to: email, // Recipient email
      subject: "Welcome to Our Platform!", // Subject of the email
      text: `Dear ${username},\n\nWelcome to Our Platform!\n\nYour account has been successfully created. Below are your login details:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease log in and change your password for security purposes.\n\nThank you for joining us!\n\nBest regards,\nYour Company Team`, // Plain text body
      html: `<p>Dear <strong>${username}</strong>,</p>
             <p>Welcome to <strong>Our Platform</strong>! Your account has been successfully created.</p>
             <p><strong>Your login details are as follows:</strong></p>
             <p>Username: <strong>${username}</strong><br/>Password: <strong>${password}</strong></p>
             <p>Please log in and change your password as soon as possible for security purposes.</p>
             <p>Thank you for joining us!</p>
             <p>Best regards,<br/>RWWS Team</p>`, // HTML body
    };

    /**
     * * Send the email using the configured transporter
     * * Log the message ID after sending successfully
     */
    const info = await transporter.sendMail(mailOptions);
    console.log("Sign-up confirmation email sent: %s", info.messageId); // Log the message ID (optional)
  } catch (error) {
    /**
     * * Handle errors in the email sending process
     * * Log the error and throw a new error
     */
    console.error("Error sending sign-up confirmation email: ", error);
    throw new Error("Failed to send sign-up confirmation email");
  }
};

/**
 * * Send password reset email to the user's email
 * @function sendPasswordResetEmail
 * @param {email} - Recipient's email address
 * @param {tempPassword} - Temporary password to be sent in the email
 */
export const sendPasswordResetEmail = async (
  email: string,
  tempPassword: string
) => {
  try {
    /**
     * * Mail options including sender, recipient, subject, and content (both text and HTML)
     */
    const mailOptions = {
      from: process.env.EMAIL_FROM, // Sender email (e.g., 'no-reply@yourdomain.com')
      to: email, // Recipient email
      subject: "Password Reset Request", // Subject of the email
      text: `Your temporary password is: ${tempPassword}. Please use this password to log in and reset your password immediately.`, // Plain text body
      html: `<p>Dear User,</p>
             <p>Your temporary password is: <strong>${tempPassword}</strong>.</p>
             <p>Please use this password to log in and reset your password as soon as possible for security purposes.</p>
             <p>If you did not request a password reset, please contact support immediately.</p>
             <p>Best regards,<br/>RWWS Team</p>`, // HTML body
    };

    /**
     * * Send the email using the configured transporter
     * * Log the message ID after sending successfully
     */
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent: %s", info.messageId); // Log the message ID (optional)
  } catch (error) {
    /**
     * * Handle errors in email sending process
     * * Log the error and throw a new error
     */
    console.error("Error sending password reset email: ", error);
    throw new Error("Failed to send password reset email");
  }
};
