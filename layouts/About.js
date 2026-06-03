import { markdownify } from "@lib/utils/textConverter";
import shortcodes from "@shortcodes/all";
import { MDXRemote } from "next-mdx-remote";
import ImageFallback from "./components/ImageFallback";
import { useState } from "react";

const CertificateCard = ({ cert, onExpand }) => {
  const [showBack, setShowBack] = useState(false);

  const displayImage = showBack && cert.image_back ? cert.image_back : cert.image;

  return (
    <div className="h-full rounded-2xl bg-white dark:bg-darkmode-theme-light p-4 shadow-md border border-border dark:border-darkmode-border hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 dark:bg-darkmode-body border border-border dark:border-darkmode-border mb-4 flex items-center justify-center group-hover:shadow-inner">
          {displayImage ? (
            <img
              src={displayImage}
              alt={cert.title}
              className="object-contain w-full h-full p-1 cursor-pointer transition-all duration-300 hover:scale-[1.03]"
              onClick={() => onExpand(displayImage)}
            />
          ) : (
            <div className="text-xs text-gray-400 font-bold">Aucune image fournie</div>
          )}
          
          {/* Action Overlay */}
          {displayImage && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <span className="text-white text-xs font-bold bg-primary/80 px-3 py-1.5 rounded-full shadow backdrop-blur-sm pointer-events-auto cursor-pointer" onClick={() => onExpand(displayImage)}>
                Agrandir l'image
              </span>
            </div>
          )}

          {/* Recto / Verso Switcher Pill if image_back exists */}
          {cert.image_back && (
            <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-darkmode-theme-light/90 shadow-lg border border-border dark:border-darkmode-border px-1.5 py-1 rounded-full flex gap-1 text-[10px] font-extrabold z-10 backdrop-blur-md">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowBack(false); }}
                className={`px-2.5 py-1 rounded-full transition-all border-0 cursor-pointer ${!showBack ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 bg-transparent'}`}
              >
                Recto
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowBack(true); }}
                className={`px-2.5 py-1 rounded-full transition-all border-0 cursor-pointer ${showBack ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 bg-transparent'}`}
              >
                Verso
              </button>
            </div>
          )}
        </div>

        <h3 className="text-base font-extrabold text-dark dark:text-white px-1 tracking-tight text-center">
          {cert.title}
        </h3>
      </div>
    </div>
  );
};

const About = ({ data }) => {
  const { frontmatter, mdxContent } = data;
  const { title, image, education, experience, certificates } = frontmatter;
  const [lightboxImage, setLightboxImage] = useState(null);

  return (
    <section className="section pt-0 mt-8">
      {/* Lightbox / Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-300"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button 
              type="button"
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all border-0 backdrop-blur-md z-[10000] cursor-pointer"
              onClick={() => setLightboxImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={lightboxImage} 
              alt="Certificat Agrandi" 
              className="object-contain max-w-full max-h-[85vh] rounded-xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

      <div className="container text-center">
        {image && (
          <div className="mb-8 w-full">
            <ImageFallback
              src={image}
              width={1298}
              height={420}
              alt={title}
              className="rounded-2xl w-full h-[420px] object-cover object-[center_40%] shadow-md border border-border dark:border-darkmode-border"
            />
          </div>
        )}
        {markdownify(title, "h1", "h1 text-left lg:text-[55px] mt-12")}

        <div className="content text-left">
          <MDXRemote {...mdxContent} components={shortcodes} />
        </div>

        <div className="row mt-24 text-left">
          {/* Expériences Professionnelles Column */}
          <div className="lg:col-6 mb-10 lg:mb-0">
            <div className="rounded border border-border p-6 dark:border-darkmode-border h-full bg-theme-light/30 dark:bg-darkmode-theme-light/10">
              {markdownify(experience.title, "h2", "section-title mb-10 border-b border-border dark:border-darkmode-border pb-4")}
              
              <div className="relative border-l-2 border-primary/20 pl-6 ml-3 space-y-8">
                {experience.list && experience.list.map((item, index) => (
                  <div className="relative" key={"experience-" + index}>
                    {/* Circle Bullet */}
                    <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-darkmode-body shadow-sm"></div>
                    
                    {/* Duration Badge */}
                    <span className="inline-block text-xs font-bold text-primary tracking-wide uppercase px-2 py-0.5 bg-primary/10 rounded">
                      {item.duration}
                    </span>
                    
                    {/* Position/Role */}
                    <h3 className="text-xl font-bold text-dark dark:text-white mt-2 leading-snug">
                      {item.role}
                    </h3>
                    
                    {/* Company and Location */}
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1 flex flex-wrap gap-2 items-center">
                      <span>{item.company}</span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span className="italic text-xs">{item.location}</span>
                    </div>
                    
                    {/* Description */}
                    <p className="mt-3 text-sm text-light dark:text-darkmode-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Éducation Column */}
          <div className="lg:col-6">
            <div className="rounded border border-border p-6 dark:border-darkmode-border h-full bg-theme-light/30 dark:bg-darkmode-theme-light/10">
              {markdownify(education.title, "h2", "section-title mb-10 border-b border-border dark:border-darkmode-border pb-4")}
              
              <div className="relative border-l-2 border-primary/20 pl-6 ml-3 space-y-8">
                {education.list && education.list.map((item, index) => (
                  <div className="relative" key={"education-" + index}>
                    {/* Circle Bullet */}
                    <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-darkmode-body shadow-sm"></div>
                    
                    {/* Duration Badge */}
                    <span className="inline-block text-xs font-bold text-primary tracking-wide uppercase px-2 py-0.5 bg-primary/10 rounded">
                      {item.duration}
                    </span>
                    
                    {/* Degree */}
                    <h3 className="text-xl font-bold text-dark dark:text-white mt-2 leading-snug">
                      {item.degree}
                    </h3>
                    
                    {/* Institution and Location */}
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1 flex flex-wrap gap-2 items-center">
                      <span>{item.institution}</span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span className="italic text-xs">{item.location}</span>
                    </div>
                    
                    {/* Description */}
                    <p className="mt-3 text-sm text-light dark:text-darkmode-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {certificates && (
          <div className="mt-24 text-left">
            <div className="rounded border border-border p-6 dark:border-darkmode-border">
              {markdownify(certificates.title, "h2", "section-title mb-12")}
              <div className="row">
                {certificates.list && certificates.list.length > 0 ? (
                  certificates.list.map((cert, index) => (
                    <div className="col-12 md:col-6 lg:col-4 mb-8" key={"cert-" + index}>
                      <CertificateCard cert={cert} onExpand={setLightboxImage} />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-8 text-gray-500 font-medium">
                    Aucune certification ajoutée pour le moment.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
