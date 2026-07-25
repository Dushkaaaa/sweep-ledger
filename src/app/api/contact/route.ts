import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, message } = await request.json();

    // Базова валідація
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Заповніть усі обов'язкові поля" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `Нове повідомлення від ${name}${company ? ` (${company})` : ""}`,
      text: `
Ім'я: ${name}
Email: ${email}
Компанія: ${company || "—"}

Повідомлення:
${message}
      `.trim(),
      html: `
        <h2>Нове повідомлення з форми контактів</h2>
        <p><strong>Ім'я:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Компанія:</strong> ${company || "—"}</p>
        <p><strong>Повідомлення:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Не вдалося надіслати повідомлення. Спробуйте пізніше." },
      { status: 500 }
    );
  }
}