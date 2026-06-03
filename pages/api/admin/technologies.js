import fs from 'fs';
import path from 'path';

function isAuthenticated(req) {
  const token = req.headers['authorization'];
  return token === 'Bearer germain-portfolio-admin-session-token';
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { name, logoUrl } = req.body;
    if (!name || !logoUrl) {
      return res.status(400).json({ message: 'Name and Logo URL are required' });
    }

    const techFilePath = path.join(process.cwd(), 'content/technologies.md');
    if (!fs.existsSync(techFilePath)) {
      return res.status(404).json({ message: 'technologies.md file not found' });
    }

    let fileContent = fs.readFileSync(techFilePath, 'utf-8');

    // Find the last </div> in the file
    const lastDivIndex = fileContent.lastIndexOf('</div>');
    if (lastDivIndex === -1) {
      return res.status(500).json({ message: 'Could not find insertion point in technologies.md' });
    }

    const newBlock = `
  {/* ${name} */}
  <div className="flex flex-col items-center w-24 hover:scale-110 transition-transform duration-300">
    <span className="text-xs font-bold mb-3 tracking-wider text-gray-600 dark:text-gray-300">${name}</span>
    <img src="${logoUrl}" alt="${name}" className="w-16 h-16 drop-shadow-md" />
  </div>
`;

    const updatedContent = 
      fileContent.substring(0, lastDivIndex) + 
      newBlock + 
      fileContent.substring(lastDivIndex);

    fs.writeFileSync(techFilePath, updatedContent, 'utf-8');

    return res.status(200).json({ success: true, message: 'Technology added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding technology', error: error.message });
  }
}
