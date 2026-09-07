import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required form fields" },
        { status: 400 },
      );
    }

    // Configure your secure SMTP transporter
    // (Recommended: Use App Passwords if utilizing a personal Gmail account)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your sending email address
        pass: process.env.EMAIL_PASS, // Your sending email app password
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "motiralemanish@gmail.com", // 💡 Target address
      replyTo: email,
      subject: `[AlgoArena Comms] ${subject}: Sent by ${name}`,
      text: message,
      html: `
        <div style="font-family: monospace; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #7c3aed; margin-top: 0;">NEW_TRANSMISSION_RECEIVED_</h2>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
          <p><strong>Sender Name:</strong> ${name}</p>
          <p><strong>Sender Email:</strong> ${email}</p>
          <p><strong>Subject Segment:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
          <p><strong>Message Stream:</strong></p>
          <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${message}</div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Signal delivered to control center." },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Nodemailer pipeline crash:", error);
    return NextResponse.json(
      { error: "Failed to dispatch email matrix." },
      { status: 500 },
    );
  }
}
