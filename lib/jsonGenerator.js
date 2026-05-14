const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const config = require("../config/config.json");
const { blog_folder } = config.settings;
const jsonDir = "./.json";

// get post data
const getPosts = fs.readdirSync(path.join(`content/${blog_folder}`), { recursive: true }).map(f => typeof f === 'string' ? f.replace(/\\/g, '/') : f);
const filterPosts = getPosts.filter((post) => {
  const basename = post.split('/').pop();
  return basename.match(/^(?!_)/);
});
const posts = filterPosts.map((filename) => {
  const slug = filename.split('/').pop().replace(".md", "");
  const postData = fs.readFileSync(
    path.join(`content/${blog_folder}/`, filename),
    "utf-8"
  );
  const { data } = matter(postData);
  const content = matter(postData).content;

  return {
    frontmatter: data,
    content: content,
    slug: slug,
  };
});

try {
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir);
  }
  fs.writeFileSync(`${jsonDir}/posts.json`, JSON.stringify(posts));
} catch (err) {
  console.error(err);
}
