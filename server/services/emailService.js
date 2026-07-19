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