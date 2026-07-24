const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save to DB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send email to admin
    // In production, these should come from process.env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'etherealpassword'
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL || 'admin@college.edu',
      subject: `New Support Request from ${name}`,
      text: `You have received a new support request.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Support email sent to admin.');
    } catch (emailErr) {
      console.error('Error sending support email:', emailErr);
      // We still return success since it's saved in DB
    }

    res.status(201).json({ message: 'Support request submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
