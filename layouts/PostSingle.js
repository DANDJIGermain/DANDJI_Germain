import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ImageFallback from "@layouts/components/ImageFallback";
import InnerPagination from "@layouts/components/InnerPagination";
import dateFormat from "@lib/utils/dateFormat";
import { markdownify } from "@lib/utils/textConverter";
import { DiscussionEmbed } from "disqus-react";
import { MDXRemote } from "next-mdx-remote";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { FaRegCalendar, FaUserAlt, FaArrowLeft, FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";
import shortcodes from "./shortcodes/all";
const { disqus } = config;
const { meta_author } = config.metadata;

const PostSingle = ({
  frontmatter,
  content,
  mdxContent,
  slug,
  posts,
  allCategories,
  relatedPosts,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  let { description, title, date, image, categories, gallery } = frontmatter;
  description = description ? description : content.slice(0, 120);

  const { theme } = useTheme();
  const author = frontmatter.author ? frontmatter.author : meta_author;
  // Local copy so we don't modify global config.
  let disqusConfig = config.disqus.settings;
  disqusConfig.identifier = frontmatter.disqusId
    ? frontmatter.disqusId
    : config.settings.blog_folder + "/" + slug;

  return (
    <Base title={title} description={description}>
      <section className="section single-blog mt-6">
        <div className="container">
          <div className="row">
            <div className="lg:col-10 mx-auto">
              <div className="mb-6">
                <Link
                  href="/categories"
                  className="inline-flex items-center text-primary hover:underline font-bold"
                >
                  <FaArrowLeft className="mr-2" /> Retour aux projets
                </Link>
              </div>
              <article>
                <div className="relative group overflow-hidden rounded-xl shadow-lg border border-border dark:border-darkmode-border bg-black/5 dark:bg-white/5">
                  {gallery && gallery.length > 0 ? (
                    /* Interactive Image Slider */
                    <div className="relative h-[250px] sm:h-[480px] w-full">
                      {frontmatter.link ? (
                        <a href={frontmatter.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">
                          <ImageFallback
                            src={gallery[currentSlide]}
                            height={600}
                            width={1000}
                            alt={`${title} - Slide ${currentSlide + 1}`}
                            className="w-full h-full object-cover hover:opacity-95 transition-opacity duration-500 ease-in-out"
                          />
                        </a>
                      ) : (
                        <ImageFallback
                          src={gallery[currentSlide]}
                          height={600}
                          width={1000}
                          alt={`${title} - Slide ${currentSlide + 1}`}
                          className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                        />
                      )}
                      
                      {/* Left Arrow */}
                      <button
                        onClick={() => setCurrentSlide((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 z-10"
                        aria-label="Image précédente"
                      >
                        <FaChevronLeft size={16} />
                      </button>
 
                      {/* Right Arrow */}
                      <button
                        onClick={() => setCurrentSlide((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 z-10"
                        aria-label="Image suivante"
                      >
                        <FaChevronRight size={16} />
                      </button>
 
                      {/* Indicator Dots */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm z-10">
                        {gallery.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2.5 w-2.5 rounded-full transition-all ${
                              currentSlide === index ? "bg-white w-5" : "bg-white/50 hover:bg-white/80"
                            }`}
                            aria-label={`Aller à la diapositive ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Default Static Image */
                    image && (
                      frontmatter.link ? (
                        <a href={frontmatter.link} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                          <ImageFallback
                            src={image}
                            height="500"
                            width="1000"
                            alt={title}
                            className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
                          />
                        </a>
                      ) : (
                        <ImageFallback
                          src={image}
                          height="500"
                          width="1000"
                          alt={title}
                          className="w-full h-auto object-cover"
                        />
                      )
                    )
                  )}

                </div>

                {/* Thumbnail previews */}
                {gallery && gallery.length > 1 && (
                  <div className="mt-4 flex space-x-3 overflow-x-auto pb-2">
                    {gallery.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                          currentSlide === index
                            ? "border-primary scale-[0.98]"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <ImageFallback
                          src={img}
                          height={100}
                          width={150}
                          alt={`Miniature ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {markdownify(title, "h1", "lg:text-[42px] mt-4")}
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
                    {frontmatter.duration ? frontmatter.duration : dateFormat(date)}
                  </li>
                  {categories && categories.length > 0 && (
                    <li className="inline-flex items-center">
                      <span className="bg-theme-light dark:bg-darkmode-theme-light text-primary px-2.5 py-0.5 rounded text-xs font-semibold tracking-wider">
                        {categories[0]}
                      </span>
                    </li>
                  )}
                  {frontmatter.link && (
                    <li className="inline-flex items-center">
                      <a
                        href={frontmatter.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary dark:text-darkmode-primary hover:underline text-xs font-bold font-secondary leading-3"
                      >
                        <FaExternalLinkAlt className="mr-1.5" />
                        Visiter le projet
                      </a>
                    </li>
                  )}
                </ul>
                <div className="content mb-16">
                  <MDXRemote {...mdxContent} components={shortcodes} />
                </div>



              </article>
              <div className="mt-16">
                {disqus.enable && (
                  <DiscussionEmbed
                    key={theme}
                    shortname={disqus.shortname}
                    config={disqusConfig}
                  />
                )}
              </div>
            </div>
          </div>
        </div>


      </section>
    </Base>
  );
};

export default PostSingle;
