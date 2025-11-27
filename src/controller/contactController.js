const Contact = require("../model/contact");
const { sendContactNotification } = require("../services/emailService");

exports.createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({ 
        success: false, 
        error: "All fields are required" 
      });
    }

    // Create contact in database
    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      subject: subject || 'wholesale',
      message
    });

    // Send email notification (don't await to avoid delaying response)
    sendContactNotification(contact)
      .then(() => {
        console.log('📧 Email notification sent successfully');
      })
      .catch(emailError => {
        console.error('❌ Failed to send email notification:', emailError);
        // Don't throw error here - we don't want email failures to affect form submission
      });

    res.status(201).json({ 
      success: true, 
      message: "Contact form submitted successfully",
      data: contact 
    });

  } catch (err) {
    console.error('❌ Contact form submission error:', err);
    
    // Handle duplicate or validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        success: false, 
        error: errors.join(', ') 
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: "Duplicate entry found" 
      });
    }

    res.status(500).json({ 
      success: false, 
      error: "Internal server error. Please try again later." 
    });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (err) {
    console.error('❌ Get contacts error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};