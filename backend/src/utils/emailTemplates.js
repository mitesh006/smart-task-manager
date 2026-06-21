/**
 * Styled HTML email templates matching TaskFlow's dark luxury gold aesthetic.
 * All emails are inline-styled for maximum email client compatibility.
 */

const baseStyles = {
  body: 'margin:0; padding:0; background-color:#050508; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;',
  container: 'max-width:560px; margin:0 auto; padding:40px 24px;',
  card: 'background:linear-gradient(135deg, rgba(18,18,24,1) 0%, rgba(12,12,16,1) 100%); border:1px solid rgba(201,165,92,0.12); border-radius:16px; padding:40px 32px;',
  logo: 'width:36px; height:36px; border:1.5px solid rgba(201,165,92,0.4); border-radius:4px; text-align:center; line-height:36px; display:inline-block; margin-bottom:32px;',
  logoText: 'color:#c9a55c; font-weight:700; font-size:14px;',
  goldLine: 'height:1px; width:48px; background:linear-gradient(90deg, #c9a55c, transparent); margin:0 0 24px 0; border:none;',
  h1: 'color:#f0eee6; font-size:24px; font-weight:700; margin:0 0 8px 0; letter-spacing:-0.3px;',
  h1Gold: 'color:#c9a55c;',
  subtitle: 'color:#8a8a99; font-size:14px; font-weight:300; margin:0 0 32px 0; line-height:1.6;',
  divider: 'height:1px; background:rgba(201,165,92,0.08); border:none; margin:28px 0;',
  footer: 'text-align:center; margin-top:32px;',
  footerText: 'color:#4a4a5a; font-size:11px; letter-spacing:0.5px;',
}


/**
 * OTP verification email
 */
export const otpEmailTemplate = (name, otp) => {
  const digits = otp.toString().split('')

  const otpBoxes = digits.map((d) =>
    `<td style="width:44px; height:52px; text-align:center; vertical-align:middle; background:rgba(201,165,92,0.06); border:1px solid rgba(201,165,92,0.2); border-radius:10px; color:#c9a55c; font-size:24px; font-weight:700; font-family:monospace; letter-spacing:2px;">${d}</td>`
  ).join('<td style="width:8px;"></td>')

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${baseStyles.body}">
  <div style="${baseStyles.container}">
    <div style="${baseStyles.card}">
      <!-- Logo -->
      <div style="${baseStyles.logo}">
        <span style="${baseStyles.logoText}">T</span>
      </div>

      <!-- Gold accent line -->
      <hr style="${baseStyles.goldLine}" />

      <!-- Heading -->
      <h1 style="${baseStyles.h1}">
        Verify your <span style="${baseStyles.h1Gold}">email</span>
      </h1>
      <p style="${baseStyles.subtitle}">
        Hi ${name}, use the code below to verify your email address and complete your TaskFlow registration.
      </p>

      <!-- OTP Code -->
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 28px;">
        <tr>
          ${otpBoxes}
        </tr>
      </table>

      <!-- Info -->
      <p style="color:#8a8a99; font-size:12px; text-align:center; margin:0 0 8px 0; line-height:1.5;">
        This code expires in <strong style="color:#c9a55c;">10 minutes</strong>.
      </p>
      <p style="color:#5a5a6a; font-size:11px; text-align:center; margin:0; line-height:1.5;">
        If you didn't request this, you can safely ignore this email.
      </p>

      <hr style="${baseStyles.divider}" />

      <!-- Footer inside card -->
      <p style="color:#4a4a5a; font-size:10px; text-align:center; margin:0; letter-spacing:0.3px; text-transform:uppercase;">
        TaskFlow — Smart Team Management
      </p>
    </div>

    <!-- Outer footer -->
    <div style="${baseStyles.footer}">
      <p style="${baseStyles.footerText}">
        © ${new Date().getFullYear()} TaskFlow. Engineered for excellence.
      </p>
    </div>
  </div>
</body>
</html>`
}


/**
 * Welcome email sent after successful registration
 */
export const welcomeEmailTemplate = (name) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${baseStyles.body}">
  <div style="${baseStyles.container}">
    <div style="${baseStyles.card}">
      <!-- Logo -->
      <div style="${baseStyles.logo}">
        <span style="${baseStyles.logoText}">T</span>
      </div>

      <!-- Gold accent line -->
      <hr style="${baseStyles.goldLine}" />

      <!-- Heading -->
      <h1 style="${baseStyles.h1}">
        Welcome to <span style="${baseStyles.h1Gold}">TaskFlow</span>
      </h1>
      <p style="${baseStyles.subtitle}">
        Hi ${name}, your account is now active. You're ready to orchestrate your team's potential with intelligent project management.
      </p>

      <!-- Feature highlights -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding:12px 16px; background:rgba(201,165,92,0.04); border:1px solid rgba(201,165,92,0.08); border-radius:10px; margin-bottom:8px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="width:32px; vertical-align:top;">
                  <div style="width:24px; height:24px; background:rgba(201,165,92,0.1); border:1px solid rgba(201,165,92,0.15); border-radius:6px; text-align:center; line-height:24px; color:#c9a55c; font-size:12px;">✦</div>
                </td>
                <td style="padding-left:12px;">
                  <p style="color:#d0cec6; font-size:13px; font-weight:600; margin:0 0 2px 0;">Create your first project</p>
                  <p style="color:#6a6a7a; font-size:11px; margin:0; line-height:1.4;">Set up workspaces, define milestones, and invite team members.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 16px; background:rgba(201,165,92,0.04); border:1px solid rgba(201,165,92,0.08); border-radius:10px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="width:32px; vertical-align:top;">
                  <div style="width:24px; height:24px; background:rgba(201,165,92,0.1); border:1px solid rgba(201,165,92,0.15); border-radius:6px; text-align:center; line-height:24px; color:#c9a55c; font-size:12px;">◈</div>
                </td>
                <td style="padding-left:12px;">
                  <p style="color:#d0cec6; font-size:13px; font-weight:600; margin:0 0 2px 0;">Assign and track tasks</p>
                  <p style="color:#6a6a7a; font-size:11px; margin:0; line-height:1.4;">Use the Kanban board to manage tasks with drag-and-drop precision.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 16px; background:rgba(201,165,92,0.04); border:1px solid rgba(201,165,92,0.08); border-radius:10px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="width:32px; vertical-align:top;">
                  <div style="width:24px; height:24px; background:rgba(201,165,92,0.1); border:1px solid rgba(201,165,92,0.15); border-radius:6px; text-align:center; line-height:24px; color:#c9a55c; font-size:12px;">◆</div>
                </td>
                <td style="padding-left:12px;">
                  <p style="color:#d0cec6; font-size:13px; font-weight:600; margin:0 0 2px 0;">Monitor your dashboard</p>
                  <p style="color:#6a6a7a; font-size:11px; margin:0; line-height:1.4;">Real-time analytics, activity charts, and team performance at a glance.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <hr style="${baseStyles.divider}" />

      <!-- CTA Button -->
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
        <tr>
          <td style="background:linear-gradient(135deg, #c9a55c 0%, #a8884a 100%); border-radius:8px; padding:12px 32px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="color:#050508; text-decoration:none; font-size:13px; font-weight:600; letter-spacing:0.5px; display:inline-block;">
              Open TaskFlow →
            </a>
          </td>
        </tr>
      </table>

      <hr style="${baseStyles.divider}" />

      <!-- Footer inside card -->
      <p style="color:#4a4a5a; font-size:10px; text-align:center; margin:0; letter-spacing:0.3px; text-transform:uppercase;">
        TaskFlow — Smart Team Management
      </p>
    </div>

    <!-- Outer footer -->
    <div style="${baseStyles.footer}">
      <p style="${baseStyles.footerText}">
        © ${new Date().getFullYear()} TaskFlow. Engineered for excellence.
      </p>
    </div>
  </div>
</body>
</html>`
}
