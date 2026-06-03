import fs from "fs";
import path from "path";
import matter from "gray-matter";

const filePath = path.join(process.cwd(), "content/about.md");

function isAuthenticated(req) {
  const token = req.headers["authorization"];
  return token === "Bearer germain-portfolio-admin-session-token";
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      if (!fs.existsSync(filePath)) {
        return res.status(200).json({ education: [], experience: [], certificates: [] });
      }
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      return res.status(200).json({
        education: data.education?.list || [],
        experience: data.experience?.list || [],
        certificates: data.certificates?.list || [],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la lecture du fichier" });
    }
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ success: false, message: "Non autorisé" });
  }

  if (req.method === "POST") {
    const { type, action, data: payload } = req.body;
    // type: "education" | "experience" | "certificates"
    // action: "add" | "delete"
    // payload: the item object

    if (!type || !action || !payload) {
      return res.status(400).json({ success: false, message: "Paramètres manquants" });
    }

    try {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      if (!data[type]) {
        let title = "Certifications & Formations";
        if (type === "education") title = "Éducation & Diplômes";
        if (type === "experience") title = "Expériences Professionnelles";
        data[type] = { title, list: [] };
      }
      if (!data[type].list) {
        data[type].list = [];
      }

      if (action === "add") {
        data[type].list.push(payload);
      } else if (action === "delete") {
        if (type === "education") {
          data[type].list = data[type].list.filter(
            (item) => item.degree !== payload.degree || item.institution !== payload.institution
          );
        } else if (type === "experience") {
          data[type].list = data[type].list.filter(
            (item) => item.role !== payload.role || item.company !== payload.company
          );
        } else if (type === "certificates") {
          data[type].list = data[type].list.filter(
            (item) => item.title !== payload.title || item.image !== payload.image
          );
        }
      }

      const updatedContent = matter.stringify(content, data);
      fs.writeFileSync(filePath, updatedContent, "utf8");

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Erreur lors de la sauvegarde" });
    }
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
}
