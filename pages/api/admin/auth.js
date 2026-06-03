export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'germainadmin';

  if (password === adminPassword) {
    return res.status(200).json({ success: true, token: 'germain-portfolio-admin-session-token' });
  } else {
    return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
  }
}
