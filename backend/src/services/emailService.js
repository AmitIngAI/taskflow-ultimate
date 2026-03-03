import nodemailer from 'nodemailer';

let transporter = null;

// Only create transporter if email is configured
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log('✅ Email service configured');
} else {
  console.log('⚠️ Email service not configured - emails disabled');
}

export const emailService = {
  sendWelcomeEmail: async (user) => {
    if (!transporter) {
      console.log('⚠️ Email not configured, skipping welcome email');
      return { success: false, message: 'Email not configured' };
    }

    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Welcome to TaskFlow! 🎉</h1>
          <p>Hi ${user.name},</p>
          <p>Thank you for joining TaskFlow. We're excited to have you on board!</p>
          <p>Get started by creating your first project.</p>
          <a href="${process.env.CLIENT_URL}/dashboard" 
             style="display: inline-block; padding: 12px 24px; background: #6366f1; 
                    color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
            Go to Dashboard
          </a>
        </div>
      `;

      await transporter.sendMail({
        from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Welcome to TaskFlow! 🚀',
        html,
      });

      return { success: true };
    } catch (error) {
      console.error('Email error:', error.message);
      return { success: false, error: error.message };
    }
  },

  sendTaskAssignedEmail: async (task, assignee) => {
    if (!transporter) {
      console.log('⚠️ Email not configured, skipping task assigned email');
      return { success: false, message: 'Email not configured' };
    }

    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Task Assigned 📋</h2>
          <p>Hi ${assignee.name},</p>
          <p>You have been assigned a new task:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <h3 style="margin: 0 0 8px 0;">${task.title}</h3>
            <p style="margin: 0; color: #6b7280;">${task.description || 'No description'}</p>
            <p style="margin: 8px 0 0 0;">
              <span style="color: #6366f1; font-weight: bold;">Priority:</span> ${task.priority}
            </p>
          </div>
          <a href="${process.env.CLIENT_URL}/board" 
             style="display: inline-block; padding: 12px 24px; background: #6366f1; 
                    color: white; text-decoration: none; border-radius: 8px;">
            View Task
          </a>
        </div>
      `;

      await transporter.sendMail({
        from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
        to: assignee.email,
        subject: `New Task: ${task.title}`,
        html,
      });

      return { success: true };
    } catch (error) {
      console.error('Email error:', error.message);
      return { success: false, error: error.message };
    }
  },

  sendDeadlineReminder: async (task, user) => {
    if (!transporter) {
      console.log('⚠️ Email not configured, skipping deadline reminder');
      return { success: false, message: 'Email not configured' };
    }

    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">⏰ Task Deadline Approaching</h2>
          <p>Hi ${user.name},</p>
          <p>This is a reminder that the following task is due soon:</p>
          <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #ef4444;">
            <h3 style="margin: 0 0 8px 0; color: #991b1b;">${task.title}</h3>
            <p style="margin: 0; color: #7f1d1d;">
              Due: ${new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
          <a href="${process.env.CLIENT_URL}/board" 
             style="display: inline-block; padding: 12px 24px; background: #ef4444; 
                    color: white; text-decoration: none; border-radius: 8px;">
            View Task
          </a>
        </div>
      `;

      await transporter.sendMail({
        from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `⏰ Deadline Reminder: ${task.title}`,
        html,
      });

      return { success: true };
    } catch (error) {
      console.error('Email error:', error.message);
      return { success: false, error: error.message };
    }
  },
};