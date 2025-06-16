import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

const resend = new Resend(resendApiKey);
const domain = 'http://localhost:3000';

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/verify-email?token=${token}`;
  const fromEmail = 'onboarding@resend.dev';

  try {
    const { data, error: resendError } = await resend.emails.send({
      from: fromEmail,
      to: [email], 
      subject: 'Подтвердите ваш адрес электронной почты - Playnote',
      html: `<p>Нажмите <a href="${confirmationLink}">сюда</a> чтобы подтвердить ваш адрес электронной почты.</p>`
    });

    if (resendError) {
      console.error('Ошибка при отправке электронной почты:', resendError);
      return { success: false, error: `Failed to send email: ${resendError.message}` };
    }

    return { success: true, messageId: data?.id };

  } catch (error) { 
    console.error('Непредвиденная ошибка при отправке электронной почты:', error);
    return { success: false, error: "Непредвиденная ошибка при отправке электронной почты." };
  }
};