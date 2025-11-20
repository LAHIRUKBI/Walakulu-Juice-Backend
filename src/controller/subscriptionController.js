const EmailSubscription = require('../model/emailSubscription');
const { success, error } = require('consola');



//Create new subscription
const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email presence
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if email already exists
    const existingSubscription = await EmailSubscription.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        return res.status(409).json({
          success: false,
          message: 'This email is already subscribed to our mailing list'
        });
      } else {
        // Reactivate unsubscribed email
        existingSubscription.status = 'active';
        existingSubscription.subscribedAt = new Date();
        await existingSubscription.save();
        
        success({ message: `✅ Email resubscribed: ${email}`, badge: true });
        
        return res.status(200).json({
          success: true,
          message: 'Welcome back! You have been resubscribed to our mailing list'
        });
      }
    }

    // Create new subscription
    const newSubscription = new EmailSubscription({
      email: email.toLowerCase().trim()
    });

    await newSubscription.save();

    success({ message: `✅ New email subscription: ${email}`, badge: true });

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! We will notify you when we launch',
      data: {
        email: newSubscription.email,
        subscribedAt: newSubscription.subscribedAt
      }
    });

  } catch (err) {
    error({ message: `❌ Subscription error: ${err.message}`, badge: true });
    
    // Handle duplicate key error (unique email constraint)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed'
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};






//get subscription
const getSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const subscriptions = await EmailSubscription.find({ status: 'active' })
      .sort({ subscribedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await EmailSubscription.countDocuments({ status: 'active' });

    res.status(200).json({
      success: true,
      data: subscriptions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalSubscriptions: total
      }
    });

  } catch (err) {
    error({ message: `❌ Get subscriptions error: ${err.message}`, badge: true });
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions'
    });
  }
};




const unsubscribeEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const subscription = await EmailSubscription.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our subscription list'
      });
    }

    if (subscription.status === 'unsubscribed') {
      return res.status(400).json({
        success: false,
        message: 'Email is already unsubscribed'
      });
    }

    subscription.status = 'unsubscribed';
    await subscription.save();

    success({ message: `✅ Email unsubscribed: ${email}`, badge: true });

    res.status(200).json({
      success: true,
      message: 'You have been successfully unsubscribed from our mailing list'
    });

  } catch (err) {
    error({ message: `❌ Unsubscribe error: ${err.message}`, badge: true });
    
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe'
    });
  }
};

module.exports = {
  subscribeEmail,
  getSubscriptions,
  unsubscribeEmail
};