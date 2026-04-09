import transporter from "../config/mailConfig.js";

/**
 * Stuur een bevestigingsmail naar de gebruiker na het boeken van een afspraak
 * @param {string} userEmail - Email adres van de gebruiker
 * @param {string} userName - Naam van de gebruiker
 * @param {string} serviceName - Naam van de service (knip, fade, baard)
 * @param {string} serviceDate - Datum van de afspraak (ISO format)
 * @param {string} serviceTime - Tijd van de afspraak
 * @param {number} servicePrice - Prijs van de service
 */
export const sendBookingConfirmation = async (
  userEmail,
  userName,
  serviceName,
  serviceDate,
  serviceTime,
  servicePrice
) => {
  try {
    if (process.env.NODE_ENV === "test") {
      return true;
    }
    // Formatteer de datum naar Nederlands formaat
    const date = new Date(serviceDate);
    const formattedDate = date.toLocaleDateString("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Vertaal servicenamen
    const serviceTranslations = {
      knip: "Standaard haarknip",
      fade: "Fade haircut",
      baard: "Baard Trimmen",
    };

    const serviceDescription = serviceTranslations[serviceName] || serviceName;

    // HTML-template voor de email
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .header {
              background-color: #2c3e50;
              color: white;
              padding: 20px;
              border-radius: 5px 5px 0 0;
              text-align: center;
            }
            .content {
              padding: 20px;
              background-color: #f9f9f9;
            }
            .booking-details {
              background-color: white;
              padding: 15px;
              border-left: 4px solid #2c3e50;
              margin: 15px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #2c3e50;
            }
            .footer {
              text-align: center;
              padding: 15px;
              color: #666;
              font-size: 12px;
              background-color: #f0f0f0;
              border-radius: 0 0 5px 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Afspraak Bevestigd! ✓</h1>
            </div>
            <div class="content">
              <p>Hallo <strong>${userName}</strong>,</p>
              <p>Bedankt voor het boeken van uw afspraak! Hieronder vindt u de details van uw boeking:</p>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="label">Service:</span>
                  <span>${serviceDescription}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Datum:</span>
                  <span>${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Tijd:</span>
                  <span>${serviceTime}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Prijs:</span>
                  <span>€${servicePrice.toFixed(2)}</span>
                </div>
              </div>
              
              <p>Wij kijken ernaar uit om u te ontvangen!</p>
              <p>Met vriendelijke groeten,<br><strong>Barbershop Team</strong></p>
            </div>
            <div class="footer">
              <p>Dit is een automatische mail. Gelieve niet op deze mail te antwoorden.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Verstuur de email
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: userEmail,
      subject: `Afspraak bevestigd - ${serviceDescription}`,
      html: htmlTemplate,
    });

    console.log(`✓ Bevestigingsmail verstuurd naar: ${userEmail}`);
  } catch (error) {
    // Log de error, maar gooi deze niet verder
    console.error(
      `✗ Fout bij het versturen van de bevestigingsmail naar ${userEmail}:`,
      error.message
    );
    // Retourneer false zodat we weten dat er iets fout ging, maar de boeking staat wel in de database
    return false;
  }
};
