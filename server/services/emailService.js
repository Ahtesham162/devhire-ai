const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendResetEmail = async (toEmail, resetLink) => {
  await resend.emails.send({
    from: 'DevHire AI <onboarding@resend.dev>',
    to: toEmail,
    subject: 'Reset your DevHire AI password',
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
        <a href="${resetLink}" style="display:inline-block; background:#F5A623; color:#000; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:bold;">Reset Password</a>
        <p style="color:#888; font-size:12px; margin-top:20px;">If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
};

exports.sendOtpEmail = async (toEmail, otp) => {
  await resend.emails.send({
    from: 'DevHire AI <onboarding@resend.dev>',
    to: toEmail,
    subject: 'Your DevHire AI verification code',
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; text-align: center;">
        <h2>Verify your email</h2>
        <p>Enter this code to activate your account. It expires in 10 minutes.</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color:#888; font-size:12px;">If you didn't create this account, you can ignore this email.</p>
      </div>
    `,
  });
};