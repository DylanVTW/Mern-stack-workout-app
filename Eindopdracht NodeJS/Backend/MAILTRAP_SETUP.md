# Email Confirmatie Setup - Mailtrap Guide

## 🎯 Wat is geïmplementeerd?

Na elke succesvolle afspraakboeking wordt automatisch een bevestigingsmail verzonden naar de gebruiker. De implementatie:

✅ Verstuurt een HTML-formatted email naar de klant  
✅ Bevat alle afspraakdetails (service, datum, tijd, prijs)  
✅ Crasht de applicatie NIET als het mailen mislukt - de boeking staat al in de database  
✅ Slaat gevoelige SMTP-gegevens veilig op in `.env`  
✅ Gebruikt Mailtrap voor veilig testen zonder echte emails te versturen  

---

## 📧 Mailtrap Instellingen

### 1. Account Aanmaken

1. Ga naar [Mailtrap.io](https://mailtrap.io)
2. Klik op **Sign up** en maak een gratis account aan
3. Bevestig je email

### 2. SMTP Credentials Ophalen

1. Log in op Mailtrap
2. Ga naar **Sandboxes** (linkermenu)
3. Klik op de sandbox die je wilt gebruiken (standaard eerste)
4. Je ziet tabs bovenaan - klik op **SMTP & POP3** tab
5. Je ziet direct je SMTP credentials:
   - **Host**: `sandbox.smtp.mailtrap.io`
   - **Port**: `2525`
   - **Username**: (je Mailtrap SMTP username - lang getal/code)
   - **Password**: (je Mailtrap SMTP password - lang getal/code)

### 3. .env Bestand Configureren

Update je `Backend/.env` bestand met je Mailtrap credentials:

```env
# Mailtrap SMTP Configuration
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=jouw_mailtrap_username
SMTP_PASS=jouw_mailtrap_password
MAIL_FROM=noreply@barbershop.com
```

---

## 🚀 Hoe werkt het?

### Bestandsstructuur

```
Backend/
├── src/
│   ├── config/
│   │   └── mailConfig.js          # Mailtrap transporter setup
│   ├── utils/
│   │   └── sendMail.js            # Email verzendlogic
│   ├── controllers/
│   │   └── servicesController.js  # Updated met email sending
│   └── models/
│       └── User.js                # Email van gebruiker
├── .env                           # Mailtrap credentials
└── package.json                   # nodemailer dependency
```

### Workflow

1. **Gebruiker boekt afspraak** → `POST /api/service`
2. **Afspraak opgeslagen** in MongoDB
3. **Email verzonden** met try-catch (niet-kritiek)
4. **Response teruggegeven** naar frontendungeacht het emailresultaat

```javascript
// Boeking gaat altijd door, email is optioneel
try {
  const service = await Service.create({...});
  
  // Email verzenden (non-blocking)
  try {
    await sendBookingConfirmation(...);
  } catch (emailError) {
    console.log("Email mislukt, maar boeking staat wel opgeslagen");
  }
  
  res.status(201).json(service); // Succes!
} catch (error) {
  res.status(500).json({ message: "Server error" });
}
```

---

## 📬 Email Template

De verzonden email bevat:

- **Header**: "Afspraak Bevestigd! ✓"
- **Inhoud**:
  - Naam van de klant
  - Servicetype (bijv. "Standaard haarknip")
  - Datum (Nederlands formaat)
  - Tijd
  - Prijs
- **Professioneel design** met CSS-styling

---

## 🧪 Testen

### 1. Server Starten

```bash
cd Backend
npm run dev
```

### 2. Test Boeking Maken (via Frontend of cURL)

**cURL voorbeeld:**

```bash
curl -X POST http://localhost:5000/api/service \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "Name": "knip",
    "Date": "2025-04-15T14:00:00",
    "Time": "14:00"
  }'
```

### 3. Email Controleren

1. Log in op [Mailtrap.io](https://mailtrap.io)
2. Ga naar **Inbox**
3. Je zult je test-email zien met alle details ✓

---

## 🔐 Beveiliging

**Gevoelige gegevens:**
- SMTP username → `SMTP_USER` in `.env`
- SMTP password → `SMTP_PASS` in `.env`

Deze staan NIET in de code, alleen in `.env` (voeg `.env` toe aan `.gitignore`!)

---

## ⚠️ Error Handling

De implementatie is **zelfherstellend**:

| Scenario | Actie |
|----------|--------|
| Email verzenden lukt | ✓ Bevestigingsmail verstuurd |
| Email verzenden mislukt | ⚠️ Error gelogd, boeking blijft staan |
| SMTP credentials fout | ⚠️ Error gelogd, boeking blijft staan |
| Gebruiker email ontbreekt | ⚠️ Email overgeslagen, boeking blijft staan |

**Console output bij succesvolle email:**
```
✓ Bevestigingsmail verstuurd naar: user@example.com
```

**Console output bij fout:**
```
✗ Fout bij het versturen van de bevestigingsmail naar user@example.com: Connection timeout
```

---

## 🔄 Production Setup

Voor productie (echte emails versturen):

1. **Mailtrap Premium** → kosten gerelateerd
2. **SendGrid, AWS SES, Gmail SMTP**, etc.

Update in `.env`:

```env
SMTP_HOST=smtp.sendgrid.net    # Voorbeeld voor SendGrid
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxx
```

Geen code-wijzigingen nodig! 🎉

---

## 📝 Bestanden Gewijzigd

1. ✅ `Backend/.env` - Mailtrap credentials toegevoegd
2. ✅ `Backend/src/config/mailConfig.js` - Nieuw (transporter setup)
3. ✅ `Backend/src/utils/sendMail.js` - Nieuw (email logica)
4. ✅ `Backend/src/controllers/servicesController.js` - Updated (email trigger)
5. ✅ `Backend/package.json` - nodemailer dependency toegevoegd

---

## 🆘 Troubleshooting

### "Cannot find module 'nodemailer'"
```bash
cd Backend
npm install
```

### "Invalid credentials" error in console
- Controleer je Mailtrap username/password in `.env`
- Login op Mailtrap en haal nieuwe credentials op

### Emails worden niet verzonden
1. Controleer SMTP_HOST/PORT in Mailtrap settings
2. Kijk in Mailtrap Inbox (niet in spam!)
3. Check de console logs voor errors

### Email template werkt niet
- Kijk in [sendMail.js](./src/utils/sendMail.js) op lijn ~30
- Pas HTML aan naar je voorkeur

---

## 🎓 Verdere Customization

### Email Template Aanpassen

Edit `Backend/src/utils/sendMail.js` (lijnen 30-80):

```javascript
const htmlTemplate = `
  // Hier je HTML aanpassen
  <h1>Je Custom Titel</h1>
  <p>Je custom bericht</p>
`;
```

### Service Vertalingen Toevoegen

In `Backend/src/utils/sendMail.js` (lijn ~27):

```javascript
const serviceTranslations = {
  knip: "Standaard haarknip",
  fade: "Fade haircut",
  baard: "Baard Trimmen",
  // Hier kunnen meer services
};
```

---

**Klaar! Je barbershop stuurt nu automatische bevestigingsmails! 🎉**
