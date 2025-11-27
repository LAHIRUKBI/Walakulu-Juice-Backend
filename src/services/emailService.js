const transporter = require('../config/email');

/**
 * Send contact form notification email
 */
exports.sendContactNotification = async (contactData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Customer Message - ${contactData.subject.charAt(0).toUpperCase() + contactData.subject.slice(1)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #f8fafc;
                    padding: 20px;
                }
                
                .container {
                    max-width: 650px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                
                .header {
                    background: linear-gradient(135deg, #000000 0%, #2d3748 100%);
                    color: #ffffff;
                    padding: 30px 20px;
                    text-align: center;
                    border-bottom: 4px solid #1954EB;
                }
                
                .header h1 {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }
                
                .header-subtitle {
                    font-size: 16px;
                    opacity: 0.9;
                    font-weight: 400;
                }
                
                .content {
                    padding: 40px 30px;
                    background: #ffffff;
                }
                
                .field-group {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 15px;
                    align-items: start;
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #f1f5f9;
                }
                
                .field-group:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }
                
                .label {
                    font-weight: 600;
                    color: #4a5568;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .value {
                    color: #2d3748;
                    font-size: 15px;
                    font-weight: 500;
                }
                
                .message-container {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #1954EB;
                    margin-top: 8px;
                    font-size: 15px;
                    line-height: 1.7;
                    color: #4a5568;
                    white-space: pre-wrap;
                }
                
                .customer-name {
                    font-size: 18px;
                    font-weight: 700;
                    color: #2d3748;
                }
                
                .subject-badge {
                    display: inline-block;
                    background: #1954EB;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .footer {
                    background: #f8fafc;
                    padding: 25px 30px;
                    text-align: center;
                    border-top: 1px solid #e2e8f0;
                }
                
                .footer-text {
                    color: #64748b;
                    font-size: 13px;
                    line-height: 1.5;
                }
                
                .brand {
                    color: #1954EB;
                    font-weight: 700;
                }
                
                .timestamp {
                    background: #f1f5f9;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    color: #64748b;
                    text-align: center;
                    margin-top: 10px;
                }
                
                @media (max-width: 600px) {
                    .field-group {
                        grid-template-columns: 1fr;
                        gap: 8px;
                    }
                    
                    .content {
                        padding: 25px 20px;
                    }
                    
                    .header h1 {
                        font-size: 24px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Header Section -->
                <div class="header">
                    <h1>📩 New Customer Message</h1>
                    <div class="header-subtitle">Walakulu Juice Contact Form</div>
                </div>
                
                <!-- Content Section -->
                <div class="content">
                    <!-- Customer Information -->
                    <div class="field-group">
                        <div class="label">Customer</div>
                        <div class="value customer-name">${contactData.firstName} ${contactData.lastName}</div>
                    </div>
                    
                    <!-- Contact Details -->
                    <div class="field-group">
                        <div class="label">Contact Details</div>
                        <div class="value">
                            <div style="margin-bottom: 8px;">📧 ${contactData.email}</div>
                            <div>📞 ${contactData.phone}</div>
                        </div>
                    </div>
                    
                    <!-- Subject -->
                    <div class="field-group">
                        <div class="label">Inquiry Type</div>
                        <div class="value">
                            <span class="subject-badge">${contactData.subject}</span>
                        </div>
                    </div>
                    
                    <!-- Message -->
                    <div class="field-group">
                        <div class="label">Message</div>
                        <div class="value">
                            <div class="message-container">
                                ${contactData.message.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Timestamp -->
                    <div class="timestamp">
                        📅 Submitted on ${new Date().toLocaleString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true 
                        })}
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                    <p class="footer-text">
                        This email was automatically generated from your <span class="brand">Walakulu Juice</span> contact form.<br>
                        Please respond to the customer within 24 hours.
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Contact form email sent successfully');
    return result;
  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    throw error;
  }
};