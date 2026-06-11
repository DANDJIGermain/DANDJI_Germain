import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const contactsFilePath = path.join(process.cwd(), 'content/contacts.json');
    let messages = [];

    if (fs.existsSync(contactsFilePath)) {
      try {
        const fileData = fs.readFileSync(contactsFilePath, 'utf-8');
        messages = JSON.parse(fileData);
      } catch (err) {
        console.error('Error parsing contacts.json:', err);
      }
    }

    const newMessage = {
      id: Date.now().toString() + '-' + Math.floor(Math.random() * 1000),
      name,
      email,
      subject,
      message,
      date: new Date().toISOString(),
    };

    messages.unshift(newMessage); // put new message at the top
    try {
      fs.writeFileSync(contactsFilePath, JSON.stringify(messages, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn("Could not save to contacts.json (expected on Vercel):", fsErr.message);
    }
    // Attempt to send email via Gmail/SMTP
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailTo = process.env.EMAIL_TO || 'germaindandji04@gmail.com';

    if (emailUser && emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        const mailOptions = {
          from: `Portfolio Germain DANDJI <${emailUser}>`,
          to: emailTo,
          subject: `[Portfolio Germain] Nouveau message: ${subject}`,
          text: `Nouveau message de contact reçu depuis votre portfolio :\n\n` +
                `Nom complet : ${name}\n` +
                `Adresse e-mail : ${email}\n` +
                `Objet : ${subject}\n\n` +
                `Message :\n${message}\n\n` +
                `Ce message a également été sauvegardé dans votre console d'administration.`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', emailTo);
      } catch (emailErr) {
        console.error('Error sending email via nodemailer:', emailErr);
        // Do not crash the API, message is already stored in JSON!
      }
    } else {
      console.log('Email credentials not configured in .env, saved to JSON only.');
    }

    return res.status(200).json({ success: true, message: 'Votre message a été enregistré avec succès.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de l'enregistrement du message.", error: error.message });
  }
}
