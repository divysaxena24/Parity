/**
 * Parity Email Notification System
 * Mandated by PRD Section 13
 */

// If you have a Resend API Key, add it to your .env as RESEND_API_KEY
// and uncomment the following lines to enable production emails.
// import { Resend } from 'resend';
// const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendSystemEmail({ to, subject, type, data }) {
  console.log(`[SYSTEM EMAIL] To: ${to} | Subject: ${subject} | Type: ${type}`);
  
  // LOGIC FOR DIFFERENT TYPES
  let html = "";
  
  switch(type) {
    case "WELCOME":
      html = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
          <h1 style="color: #059669;">Welcome to Parity!</h1>
          <p>You've successfully set up your Impact Partner: <strong>${data.charityName}</strong>.</p>
          <p>Your ${data.donationPercentage}% contribution will be included in the next monthly draw.</p>
          <a href="${process.env.APP_URL}/dashboard" style="background: #059669; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Go to Dashboard</a>
        </div>
      `;
      break;

    case "DRAW_RESULT":
      html = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
          <h1 style="color: #059669;">Draw Results Are In!</h1>
          <p>The ${data.month} results for Parity have been published.</p>
          <p>Check the dashboard to see if you've matched 3, 4, or 5 numbers!</p>
          <a href="${process.env.APP_URL}/dashboard" style="background: #059669; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">View Results</a>
        </div>
      `;
      break;

    case "WINNER_ALERT":
      html = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
          <h1 style="color: #059669;">🎉 You're a Winner!</h1>
          <p>Congratulations! You've matched ${data.matchType} numbers in the latest draw.</p>
          <p><strong>Your Prize: $${data.prizeAmount}</strong></p>
          <p>Please log in to your dashboard to upload your winner proof and claim your payout.</p>
          <a href="${process.env.APP_URL}/dashboard/scores" style="background: #059669; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Claim Prize</a>
        </div>
      `;
      break;

    default:
      html = `<p>${subject}</p>`;
  }

  // If Resend is configured, send the actual email
  /*
  if (resend) {
    try {
      await resend.emails.send({
        from: 'Parity <notifications@parity.golf>',
        to: [to],
        subject: subject,
        html: html,
      });
      return { success: true };
    } catch (e) {
      console.error("Resend error:", e);
    }
  }
  */

  // Mock Success for now
  return { success: true, mocked: true };
}
