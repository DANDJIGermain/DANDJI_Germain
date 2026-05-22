import { markdownify } from "@lib/utils/textConverter";
import shortcodes from "@shortcodes/all";
import { MDXRemote } from "next-mdx-remote";
import ImageFallback from "./components/ImageFallback";
import { useState } from "react";

const CertificateCard = ({ cert }) => {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <div className="h-full rounded-lg bg-theme-light dark:bg-darkmode-theme-light p-4 shadow-sm border border-border dark:border-darkmode-border hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden bg-white dark:bg-darkmode-body border border-border dark:border-darkmode-border mb-4 flex items-center justify-center">
          {cert.image && !useFallback ? (
            <img
              src={cert.image}
              alt={cert.name}
              className="object-contain w-full h-full p-2"
              onError={() => setUseFallback(true)}
            />
          ) : (
            <svg viewBox="0 0 400 300" className="w-full h-full object-contain">
              {/* Background with gold border */}
              <rect x="10" y="10" width="380" height="280" rx="8" fill="#FBFBFC" stroke="#E2E8F0" strokeWidth="2" />
              <rect x="20" y="20" width="360" height="260" rx="4" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="8 4" />
              
              {/* Ribbon or seal icon */}
              <circle cx="200" cy="80" r="28" fill="#F59E0B" fillOpacity="0.1" />
              <path d="M200 62L206 75L220 77L210 87L212 101L200 94L188 101L190 87L180 77L194 75L200 62Z" fill="#F59E0B" />
              
              {/* Content */}
              <text x="200" y="140" fontFamily="Outfit, Inter, sans-serif" fontSize="14" fontWeight="bold" fill="#0F172A" textAnchor="middle">CERTIFICATE OF ACHIEVEMENT</text>
              <text x="200" y="165" fontFamily="Outfit, Inter, sans-serif" fontSize="10" fill="#64748B" textAnchor="middle">This is proudly presented to</text>
              <text x="200" y="190" fontFamily="Outfit, Inter, sans-serif" fontSize="16" fontWeight="800" fill="#0F172A" textAnchor="middle">Germain DANDJI</text>
              
              {/* Certificate title */}
              <text x="200" y="220" fontFamily="Outfit, Inter, sans-serif" fontSize="11" fontWeight="600" fill="#0F172A" textAnchor="middle">{cert.name}</text>
              
              {/* Footer */}
              <text x="70" y="260" fontFamily="Outfit, Inter, sans-serif" fontSize="8" fill="#64748B" textAnchor="middle">ISSUER: {cert.issuer}</text>
              <text x="330" y="260" fontFamily="Outfit, Inter, sans-serif" fontSize="8" fill="#64748B" textAnchor="middle">YEAR: {cert.date}</text>
            </svg>
          )}
        </div>

        <h3 className="text-lg font-bold text-dark dark:text-white mb-1 leading-snug">
          {cert.name}
        </h3>
        <p className="text-sm font-semibold text-primary mb-2">
          {cert.issuer}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-border dark:border-darkmode-border flex items-center justify-between text-xs text-light dark:text-darkmode-light">
        <span>Obtenu en {cert.date}</span>
        {cert.image && !useFallback && (
          <a 
            href={cert.image} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary font-bold hover:underline flex items-center gap-1"
          >
            Voir le certificat
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};

const About = ({ data }) => {
  const { frontmatter, mdxContent } = data;
  const { title, image, education, experience, certificates } = frontmatter;

  return (
    <section className="section mt-16">
      <div className="container text-center">
        {image && (
          <div className="mb-8">
            <ImageFallback
              src={image}
              width={1298}
              height={616}
              alt={title}
              className="rounded-lg"
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
                {experience.list.map((item, index) => (
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
                {education.list.map((item, index) => (
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
                {certificates.list.map((cert, index) => (
                  <div className="col-12 md:col-6 lg:col-4 mb-8" key={"cert-" + index}>
                    <CertificateCard cert={cert} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
