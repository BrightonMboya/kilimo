import { render } from "@react-email/render";
import { JSXElementConstructor, ReactElement } from "react";
import { Resend } from "resend";


export const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_APP_ID);




// export const sendEmail = async ({
//   email,
//   subject,
//   from,
//   bcc,
//   text,
//   react,
//   marketing,
// }: {
//   email: string;
//   subject: string;
//   from?: string;
//   bcc?: string;
//   text?: string;
//   react?: ReactElement<any, string | JSXElementConstructor<any>>;
//   marketing?: boolean;
// }) => {
//   if (process.env.NODE_ENV === "development" && !resend) {
//     // Set up a fake email client for development
//     console.info(
//       `Email to ${email} with subject ${subject} sent from ${
//         from || process.env.NEXT_PUBLIC_APP_NAME
//       }`,
//     );
//     return Promise.resolve();
//   } else if (!resend) {
//     console.error(
//       "Postmark is not configured. You need to add a POSTMARK_API_KEY in your .env file for emails to work.",
//     );
//     return Promise.resolve();
//   }

//   return resend.emails.send({
//     from: from || marketing
//       ? "brighton.mboya.io@gmail.com"
//       : process.env.NEXT_PUBLIC_IS_DUB
//       ? "brighton.mboya.io@gmail.com"
//       : `${process.env.NEXT_PUBLIC_APP_NAME} <system@${process.env.NEXT_PUBLIC_APP_DOMAIN}>`,
//     to: email,
//     bcc: bcc,
//     reply_to: process.env.NEXT_PUBLIC_IS_DUB
//       ? "sbrighton.mboya.io@gmail.com"
//       //   : `support@${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
//       : "brighton.mboya.io@gmail.com",
//     subject: subject,
    
//   });
// };
