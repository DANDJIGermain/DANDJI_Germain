import fs from 'fs';
import path from 'path';

function isAuthenticated(req) {
  const token = req.headers['authorization'];
  return token === 'Bearer germain-portfolio-admin-session-token';
}

export default function handler(req, res) {
  const contactsFilePath = path.join(process.cwd(), 'content/contacts.json');

  if (req.method === 'GET') {
    try {
      if (!fs.existsSync(contactsFilePath)) {
        return res.status(200).json([]);
      }
      const fileData = fs.readFileSync(contactsFilePath, 'utf-8');
      const messages = JSON.parse(fileData);
      return res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error retrieving messages', error: error.message });
    }
  }

  // DELETE and other methods require authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: 'Message ID is required' });
      }

      if (!fs.existsSync(contactsFilePath)) {
        return res.status(404).json({ message: 'No messages file found' });
      }

      const fileData = fs.readFileSync(contactsFilePath, 'utf-8');
      let messages = JSON.parse(fileData);

      const filteredMessages = messages.filter((msg) => msg.id !== id);
      fs.writeFileSync(contactsFilePath, JSON.stringify(filteredMessages, null, 2), 'utf-8');

      return res.status(200).json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting message', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
