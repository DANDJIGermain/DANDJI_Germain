import config from "@config/config.json";
import ImageFallback from "@layouts/components/ImageFallback";
import dateFormat from "@lib/utils/dateFormat";
import { plainify } from "@lib/utils/textConverter";
import Link from "next/link";
import { FaRegCalendar, FaUserAlt } from "react-icons/fa";

const Post = ({ post }) => {
  const { summary_length, blog_folder } = config.settings;
  const { meta_author } = config.metadata;
  const author = post.frontmatter.author ? post.frontmatter.author : meta_author;
  return (
    <div className="post">
      <div className="relative">
        {post.frontmatter.image && (
          post.frontmatter.link ? (
            <a href={post.frontmatter.link} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
              <ImageFallback
                className="rounded hover:opacity-90 transition-opacity"
                src={post.frontmatter.image}
                alt={post.frontmatter.title}
                width={405}
                height={208}
              />
            </a>
          ) : (
            <Link href={`/${blog_folder}/${post.slug}`} className="block">
              <ImageFallback
                className="rounded hover:opacity-90 transition-opacity"
                src={post.frontmatter.image}
                alt={post.frontmatter.title}
                width={405}
                height={208}
              />
            </Link>
          )
        )}
        <ul className="absolute top-3 left-2 flex flex-wrap items-center">
          {post.frontmatter.categories.map((tag, index) => (
            <li
              className="mx-2 inline-flex h-7 rounded-[35px] bg-primary px-3 text-white"
              key={"tag-" + index}
            >
              <Link
                className="capitalize"
                href={`/categories/${tag.replace(" ", "-")}`}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <h3 className="h5 mb-2 mt-4">
        <Link
          href={`/${blog_folder}/${post.slug}`}
          className="block hover:text-primary"
        >
          {post.frontmatter.title}
        </Link>
      </h3>
      <ul className="flex items-center space-x-4">
        <li>
          <Link
            className="inline-flex items-center font-secondary text-xs leading-3"
            href="/about"
          >
            <FaUserAlt className="mr-1.5" />
            {author}
          </Link>
        </li>
        <li className="inline-flex items-center font-secondary text-xs leading-3">
          <FaRegCalendar className="mr-1.5" />
          {post.frontmatter.duration ? post.frontmatter.duration : dateFormat(post.frontmatter.date)}
        </li>
      </ul>
      <p>{plainify(post.content).replace(/^Présentation\s*/i, "").slice(0, Number(summary_length))}...</p>
      <Link
        className="btn btn-outline-primary mt-4"
        href={`/${blog_folder}/${post.slug}`}
      >
        Lire la suite
      </Link>
    </div>
  );
};

export default Post;
