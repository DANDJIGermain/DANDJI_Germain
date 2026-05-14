import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getTaxonomy } from "@lib/taxonomyParser";
import { humanize, markdownify, slugify } from "@lib/utils/textConverter";
import { getSinglePage } from "@lib/contentParser";
import { useState } from "react";
import Post from "@layouts/partials/Post";
import { FaFolder, FaSchool, FaLaptopCode, FaUser, FaBriefcase, FaHandshake } from "react-icons/fa";

const { blog_folder } = config.settings;

const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('epitech')) return <FaSchool className="mr-2" />;
  if (name.includes('tek') || name === 'eip') return <FaLaptopCode className="mr-2" />;
  if (name.includes('personnel')) return <FaUser className="mr-2" />;
  if (name.includes('entreprise')) return <FaBriefcase className="mr-2" />;
  if (name.includes('client')) return <FaHandshake className="mr-2" />;
  return <FaFolder className="mr-2" />;
};

const Categories = ({ categories, posts }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isEpitechOpen, setIsEpitechOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((post) =>
          (post.frontmatter.categories || []).map((e) => slugify(e)).includes(activeCategory)
        );

  // Group categories
  const epitechSubNames = ["tek1", "tek2", "tek3", "eip"];
  const epitechSubCategories = categories.filter((c) =>
    epitechSubNames.includes(c.name.toLowerCase())
  );
  const otherCategories = categories.filter(
    (c) =>
      !epitechSubNames.includes(c.name.toLowerCase()) &&
      c.name.toLowerCase() !== "epitech"
  );
  const epitechMain = categories.find((c) => c.name.toLowerCase() === "epitech");

  return (
    <Base title={"Projets par Catégories"}>
      <section className="section pt-0">
        {markdownify(
          "Projets",
          "h1",
          "h2 mb-16 bg-theme-light dark:bg-darkmode-theme-dark py-12 text-center lg:text-[55px]"
        )}
        <div className="container pt-12">
          <div className="row">
            {/* Sidebar Filtres */}
            <div className="lg:col-4 xl:col-3 mb-8 lg:mb-0">
              <div className="rounded border border-border p-6 dark:border-darkmode-border">
                <h4 className="section-title mb-8 text-center">Filtres</h4>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => {
                        setActiveCategory("all");
                        setIsEpitechOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 font-bold transition ${
                        activeCategory === "all"
                          ? "bg-primary text-white"
                          : "bg-theme-light text-dark hover:bg-primary/10 dark:bg-darkmode-theme-dark dark:text-darkmode-light"
                      }`}
                    >
                      <span className="flex items-center">
                        <FaFolder className="mr-2" />
                        Tous les projets
                      </span>
                      <span>{posts.length}</span>
                    </button>
                  </li>

                  {/* Epitech Accordion */}
                  {(epitechMain || epitechSubCategories.length > 0) && (
                    <li>
                      <button
                        onClick={() => {
                          setIsEpitechOpen(!isEpitechOpen);
                          setActiveCategory("epitech");
                          setCurrentPage(1);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 font-bold transition ${
                          activeCategory === "epitech"
                            ? "bg-primary text-white"
                            : "bg-theme-light text-dark hover:bg-primary/10 dark:bg-darkmode-theme-dark dark:text-darkmode-light"
                        }`}
                      >
                        <span className="flex items-center">
                          {getCategoryIcon("epitech")}
                          Epitech
                        </span>
                        <span>
                          {epitechMain
                            ? epitechMain.posts
                            : epitechSubCategories.reduce((acc, c) => acc + c.posts, 0)}
                        </span>
                      </button>
                      
                      {/* Sub-categories */}
                      {isEpitechOpen && (
                        <ul className="mt-2 space-y-2 pl-6">
                          {epitechSubCategories.map((category, i) => (
                            <li key={`sub-${i}`}>
                              <button
                                onClick={() => {
                                  setActiveCategory(category.name);
                                  setCurrentPage(1);
                                }}
                                className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-bold transition ${
                                  activeCategory === category.name
                                    ? "bg-primary/20 text-primary dark:bg-primary/40 dark:text-white"
                                    : "text-dark hover:text-primary dark:text-darkmode-light"
                                }`}
                              >
                                <span className="flex items-center">
                                  {getCategoryIcon(category.name)}
                                  {humanize(category.name)}
                                </span>
                                <span>{category.posts}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )}

                  {/* Other Categories */}
                  {otherCategories.map((category, i) => (
                    <li key={`category-${i}`}>
                      <button
                        onClick={() => {
                          setActiveCategory(category.name);
                          setIsEpitechOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 font-bold transition ${
                          activeCategory === category.name
                            ? "bg-primary text-white"
                            : "bg-theme-light text-dark hover:bg-primary/10 dark:bg-darkmode-theme-dark dark:text-darkmode-light"
                        }`}
                      >
                        <span className="flex items-center">
                          {getCategoryIcon(category.name)}
                          {humanize(category.name)}
                        </span>
                        <span>{category.posts}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Liste des projets */}
            <div className="lg:col-8 xl:col-9">
              <div className="row rounded border border-border p-4 px-3 dark:border-darkmode-border lg:p-6">
                {filteredPosts.length > 0 ? (
                  <>
                    {filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage).map((post, i) => (
                      <div key={`key-${i}`} className="col-12 mb-8 sm:col-6">
                        <Post post={post} />
                      </div>
                    ))}

                    {/* Pagination Controls */}
                    {filteredPosts.length > postsPerPage && (
                      <div className="col-12 mt-8 flex justify-center space-x-2">
                        <button
                          onClick={() => {
                            setCurrentPage(Math.max(1, currentPage - 1));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          disabled={currentPage === 1}
                          className={`rounded px-4 py-2 font-bold transition ${
                            currentPage === 1
                              ? "opacity-50 cursor-not-allowed bg-theme-light text-dark dark:bg-darkmode-theme-dark dark:text-darkmode-light"
                              : "bg-theme-light text-dark hover:bg-primary/20 dark:bg-darkmode-theme-dark dark:text-darkmode-light"
                          }`}
                        >
                          Précédent
                        </button>

                        {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setCurrentPage(index + 1);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`rounded px-4 py-2 font-bold transition ${
                              currentPage === index + 1
                                ? "bg-primary text-white"
                                : "bg-theme-light text-dark hover:bg-primary/20 dark:bg-darkmode-theme-dark dark:text-darkmode-light"
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => {
                            setCurrentPage(Math.min(Math.ceil(filteredPosts.length / postsPerPage), currentPage + 1));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
                          className={`rounded px-4 py-2 font-bold transition ${
                            currentPage === Math.ceil(filteredPosts.length / postsPerPage)
                              ? "opacity-50 cursor-not-allowed bg-theme-light text-dark dark:bg-darkmode-theme-dark dark:text-darkmode-light"
                              : "bg-theme-light text-dark hover:bg-primary/20 dark:bg-darkmode-theme-dark dark:text-darkmode-light"
                          }`}
                        >
                          Suivant
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="col-12 text-center py-10">
                    <p>Aucun projet trouvé pour cette catégorie.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Base>
  );
};

export default Categories;

export const getStaticProps = () => {
  const posts = getSinglePage(`content/${blog_folder}`);
  const categories = getTaxonomy(`content/${blog_folder}`, "categories");
  const categoriesWithPostsCount = categories.map((category) => {
    const filteredPosts = posts.filter((post) =>
      (post.frontmatter.categories || []).map((e) => slugify(e)).includes(category)
    );
    return {
      name: category,
      posts: filteredPosts.length,
    };
  });
  return {
    props: {
      categories: categoriesWithPostsCount,
      posts: posts,
    },
  };
};
