// lib/mail.ts (or wherever you have this function)

import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.warn("RESEND_API_KEY is not set. Email sending will likely fail.");
}
const resend = new Resend(resendApiKey);
const appBaseUrl = 'http://localhost:3000';

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${appBaseUrl}/reset-password?token=${token}`;
  const fromEmail = 'Playnote <onboarding@resend.dev>';

  try {
    const { data, error: resendError } = await resend.emails.send({
      from: fromEmail,
      to: [email], 
      subject: 'Reset your password - Playnote',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hi there,</p>
          <p>We received a request to reset the password for your account associated with this email address.</p>
          <p>If this was you, please click the link below to set a new password. This link will expire in 1 hour:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a
              href="${resetLink}"
              style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;"
            >
              Reset Your Password
            </a>
          </p>
          <p>If you did not request a password reset, please ignore this email. Your password will not be changed.</p>
          <p>Thanks,<br/>The YourApp Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.9em; color: #777;">
            If you're having trouble clicking the "Reset Your Password" button, copy and paste the URL below into your web browser:
            <br />
            <a href="${resetLink}">${resetLink}</a>
          </p>
        </div>
      `,
    });

    if (resendError) {
      console.error('Error sending password reset email (Resend API):', resendError);
      return { success: false, error: `Failed to send email: ${resendError.message}` };
    }

    console.log(`Password reset email sent to ${email}. Message ID: ${data?.id}`);
    return { success: true, messageId: data?.id };

  } catch (error) { 
    console.error('Unexpected error in sendPasswordResetEmail function:', error);
    return { success: false, error: "An unexpected error occurred while trying to send the email." };
  }
};