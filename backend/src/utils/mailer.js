import { BrevoClient } from '@getbrevo/brevo'

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body
 */
const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY
})

export const sendMail = async (to, subject, html) => {
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: subject,
      htmlContent: html,
      sender: {
        name: 'PrismGrid',
        email: process.env.BREVO_FROM
      },
      to: [{email: to}],
    })    
  } catch (error) {
    console.error('Email send error:', error)
    throw new Error('Failed to send email. Please try again.')
  }
}
