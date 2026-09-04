import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMail(name: string, otp: number, email: string) {
  const { data, error } = await resend.emails.send({
    from: "account@learnloop.dev-shivam.in",
    to: [email],
    subject: "LearnLoop - Your Verification Code",
    template: {
      id: "otp-verification",
      variables: {
        NAME: name,
        OTP: otp.toString().padStart(6, "0"),
        USER_EMAIL: email,
      },
    },
  });

  if (error) {
    return console.error({ error });
  }
  return data;
}

export default sendMail;
