import nodemailer from "nodemailer";

const APP_NAME = "StakeWise";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function getTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

function brandedTemplate(title: string, body: string) {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Inter',system-ui,sans-serif;">
<div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 32px 24px;text-align:center;">
    <h1 style="color:#ffffff;font-size:28px;margin:0;font-weight:800;letter-spacing:-0.5px;">${APP_NAME}</h1>
    <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:6px 0 0;">Own Smarter. Grow Together.</p>
  </div>
  <!-- Body -->
  <div style="padding:32px;">
    <h2 style="color:#0f172a;font-size:20px;font-weight:700;margin:0 0 16px;">${title}</h2>
    ${body}
  </div>
  <!-- Footer -->
  <div style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
    <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
    <p style="color:#94a3b8;font-size:11px;margin:8px 0 0;">This is an automated message. Do not reply.</p>
  </div>
</div>
</body>
</html>`;
}

function buttonHtml(text: string, url: string) {
    return `<a href="${url}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;border-radius:12px;font-weight:700;font-size:15px;margin:8px 0 16px;">${text}</a>`;
}

export async function sendVerificationEmail(email: string, token: string) {
    const url = `${APP_URL}/verify-email?token=${token}`;
    const html = brandedTemplate(
        "Verify Your Email",
        `<p style="color:#475569;font-size:15px;line-height:1.6;">Welcome to ${APP_NAME}! Please verify your email address to activate your account.</p>
        <div style="text-align:center;margin:24px 0;">${buttonHtml("Verify Email", url)}</div>
        <p style="color:#94a3b8;font-size:13px;">If the button doesn't work, copy this link:<br>
        <a href="${url}" style="color:#6366f1;word-break:break-all;">${url}</a></p>`
    );

    const transporter = getTransporter();
    await transporter.sendMail({
        from: `"${APP_NAME}" <${process.env.SMTP_USER || "noreply@stakewise.com"}>`,
        to: email,
        subject: `Verify your ${APP_NAME} account`,
        html,
    });
}

export async function sendPasswordResetEmail(email: string, token: string) {
    const url = `${APP_URL}/reset-password?token=${token}`;
    const html = brandedTemplate(
        "Reset Your Password",
        `<p style="color:#475569;font-size:15px;line-height:1.6;">We received a request to reset your password. Click the button below to set a new password.</p>
        <div style="text-align:center;margin:24px 0;">${buttonHtml("Reset Password", url)}</div>
        <p style="color:#94a3b8;font-size:13px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>`
    );

    const transporter = getTransporter();
    await transporter.sendMail({
        from: `"${APP_NAME}" <${process.env.SMTP_USER || "noreply@stakewise.com"}>`,
        to: email,
        subject: `${APP_NAME} — Password Reset`,
        html,
    });
}

export async function sendAccountUpdateNotification(email: string, change: string) {
    const html = brandedTemplate(
        "Account Updated",
        `<p style="color:#475569;font-size:15px;line-height:1.6;">Your ${APP_NAME} account was recently updated:</p>
        <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:16px 0;border-left:4px solid #6366f1;">
          <p style="color:#0f172a;font-size:14px;font-weight:600;margin:0;">${change}</p>
        </div>
        <p style="color:#94a3b8;font-size:13px;">If you didn't make this change, please reset your password immediately.</p>`
    );

    const transporter = getTransporter();
    await transporter.sendMail({
        from: `"${APP_NAME}" <${process.env.SMTP_USER || "noreply@stakewise.com"}>`,
        to: email,
        subject: `${APP_NAME} — Account Updated`,
        html,
    });
}
