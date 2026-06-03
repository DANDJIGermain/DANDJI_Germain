import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { execSync } from 'child_process';

const blogFolder = 'content/posts';

function isAuthenticated(req) {
  const token = req.headers['authorization'];
  return token === 'Bearer germain-portfolio-admin-session-token';
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function getFilesRecursively(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else if (file.endsWith('.md') && !file.startsWith('_')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const postsDir = path.join(process.cwd(), blogFolder);
      if (!fs.existsSync(postsDir)) {
        return res.status(200).json([]);
      }
      
      const filePaths = getFilesRecursively(postsDir);
      const posts = filePaths.map((filePath) => {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        const slug = path.basename(filePath, '.md');
        const relativePath = path.relative(postsDir, filePath);
        
        return {
          slug,
          relativePath,
          frontmatter: data,
          content
        };
      });
      
      posts.sort((a, b) => {
        const dateA = new Date(a.frontmatter.date || 0);
        const dateB = new Date(b.frontmatter.date || 0);
        return dateB - dateA;
      });
      
      return res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error retrieving projects', error: error.message });
    }
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { title, category, date, image, gallery, featured, link, content } = req.body;
      if (!title || !category) {
        return res.status(400).json({ message: 'Title and Category are required' });
      }

      const slug = slugify(title);
      const fileName = `projet-${slug}.md`;
      const postsDir = path.join(process.cwd(), blogFolder);
      const filePath = path.join(postsDir, fileName);

      const frontmatter = {
        title,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        image: image || '/images/post/default.png',
        categories: [category],
        featured: !!featured,
      };

      if (link) {
        frontmatter.link = link;
      }
      if (gallery && gallery.length > 0) {
        frontmatter.gallery = gallery;
      }

      const newContent = matter.stringify(content || '', frontmatter);
      fs.writeFileSync(filePath, newContent, 'utf-8');

      try {
        execSync('node lib/jsonGenerator.js', { cwd: process.cwd() });
      } catch (err) {
        console.error('Error generating json:', err);
      }

      return res.status(200).json({ success: true, slug, message: 'Project created successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating project', error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { relativePath } = req.body;
      if (!relativePath) {
        return res.status(400).json({ message: 'Relative path is required' });
      }

      const postsDir = path.join(process.cwd(), blogFolder);
      const filePath = path.join(postsDir, relativePath);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Project file not found' });
      }

      fs.unlinkSync(filePath);

      try {
        execSync('node lib/jsonGenerator.js', { cwd: process.cwd() });
      } catch (err) {
        console.error('Error generating json:', err);
      }

      return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
