import { IncomingForm } from "formidable";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" });
  }

  // Auth guard
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Non autorisé" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== "germain-portfolio-admin-session-token") {
    return res.status(401).json({ success: false, message: "Token invalide" });
  }

  const form = new IncomingForm();
  
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ success: false, message: "Erreur lors du traitement du fichier" });
    }

    // formidable v2 uses fields/files where files can be single or array
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "Aucun fichier fourni" });
    }

    try {
      const filePath = file.filepath || file.path;
      if (!filePath) {
        throw new Error("Chemin du fichier temporaire manquant");
      }

      // Read file to buffer
      const fileBuffer = fs.readFileSync(filePath);
      const originalName = file.originalFilename || file.name || "certificate.png";
      const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${Date.now()}_${cleanName}`;

      // Upload to Supabase Storage certificates bucket
      const { data, error } = await supabase.storage
        .from("certificates")
        .upload(fileName, fileBuffer, {
          contentType: file.mimetype || file.type || "image/png",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Get public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from("certificates")
        .getPublicUrl(fileName);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Impossible de générer l'URL publique");
      }

      return res.status(200).json({
        success: true,
        url: publicUrlData.publicUrl,
      });
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Erreur Supabase Storage: " + uploadError.message,
      });
    }
  });
}
