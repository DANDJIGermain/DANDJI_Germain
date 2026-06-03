import Base from "@layouts/Baseof";
import { useEffect, useState } from "react";
import { 
  FaLock, 
  FaFolderPlus, 
  FaTools, 
  FaPlus, 
  FaTrash, 
  FaSignOutAlt, 
  FaEye, 
  FaInbox, 
  FaEnvelopeOpen, 
  FaChartLine, 
  FaTasks,
  FaGraduationCap,
  FaBriefcase,
  FaAward
} from "react-icons/fa";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Profile elements from content/about.md
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Projects form
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("Projets d'Entreprise");
  const [projectDate, setProjectDate] = useState(new Date().toISOString().split("T")[0]);
  const [projectImage, setProjectImage] = useState("/images/post/default.png");
  const [projectFeatured, setProjectFeatured] = useState(false);
  const [projectLink, setProjectLink] = useState("");
  const [projectGallery, setProjectGallery] = useState("");
  const [projectContent, setProjectContent] = useState("");

  // Technologies form
  const [techName, setTechName] = useState("");
  const [techLogoUrl, setTechLogoUrl] = useState("");

  // Education form
  const [eduDegree, setEduDegree] = useState("");
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduDuration, setEduDuration] = useState("");
  const [eduLocation, setEduLocation] = useState("");
  const [eduDescription, setEduDescription] = useState("");

  // Experience form
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDuration, setExpDuration] = useState("");
  const [expLocation, setExpLocation] = useState("");
  const [expDescription, setExpDescription] = useState("");

  // Certificates form
  const [certTitle, setCertTitle] = useState("");
  const [certImage, setCertImage] = useState("");
  const [certImageBack, setCertImageBack] = useState("");
  const [uploadingRecto, setUploadingRecto] = useState(false);
  const [uploadingVerso, setUploadingVerso] = useState(false);
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "recto") {
      setUploadingRecto(true);
    } else if (type === "verso") {
      setUploadingVerso(true);
    } else if (type === "project") {
      setUploadingProjectImage(true);
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("germain_admin_token");
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        if (type === "recto") {
          setCertImage(data.url);
        } else if (type === "verso") {
          setCertImageBack(data.url);
        } else if (type === "project") {
          setProjectImage(data.url);
        }
      } else {
        alert(data.message || "Erreur lors du téléchargement");
      }
    } catch (err) {
      alert("Erreur de connexion lors du téléchargement");
    } finally {
      if (type === "recto") {
        setUploadingRecto(false);
      } else if (type === "verso") {
        setUploadingVerso(false);
      } else if (type === "project") {
        setUploadingProjectImage(false);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("germain_admin_token");
    if (token) {
      setIsAuthenticated(true);
      fetchProjects();
      fetchMessages();
      fetchAboutData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("germain_admin_token", data.token);
        setIsAuthenticated(true);
        fetchProjects();
        fetchMessages();
        fetchAboutData();
      } else {
        setError(data.message || "Mot de passe incorrect");
      }
    } catch (err) {
      setError("Une erreur est survenue.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("germain_admin_token");
    setIsAuthenticated(false);
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  const fetchAboutData = async () => {
    try {
      const res = await fetch("/api/admin/about");
      const data = await res.json();
      setEducation(data.education || []);
      setExperience(data.experience || []);
      setCertificates(data.certificates || []);
    } catch (err) {
      console.error("Error fetching profile details", err);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setError("");

    const token = localStorage.getItem("germain_admin_token");
    const galleryArray = projectGallery
      ? projectGallery.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: projectTitle,
          category: projectCategory,
          date: projectDate,
          image: projectImage,
          featured: projectFeatured,
          link: projectLink,
          gallery: galleryArray,
          content: projectContent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Projet ajouté avec succès !");
        setProjectTitle("");
        setProjectLink("");
        setProjectGallery("");
        setProjectContent("");
        setProjectFeatured(false);
        fetchProjects();
      } else {
        setError(data.message || "Erreur lors de l'ajout");
      }
    } catch (err) {
      setError("Erreur de connexion avec l'API");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (relativePath) => {
    if (!confirm("Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible !")) {
      return;
    }
    const token = localStorage.getItem("germain_admin_token");
    try {
      const res = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ relativePath }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects();
      }
    } catch (err) {
      console.error("Error deleting project", err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce message ?")) {
      return;
    }
    const token = localStorage.getItem("germain_admin_token");
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchMessages();
      }
    } catch (err) {
      console.error("Error deleting message", err);
    }
  };

  const handleAddTech = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setError("");

    const token = localStorage.getItem("germain_admin_token");
    try {
      const res = await fetch("/api/admin/technologies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: techName,
          logoUrl: techLogoUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Technologie ajoutée avec succès !");
        setTechName("");
        setTechLogoUrl("");
      } else {
        setError(data.message || "Erreur lors de l'ajout");
      }
    } catch (err) {
      setError("Erreur de connexion avec l'API");
    } finally {
      setLoading(false);
    }
  };

  // Profile additions
  const handleAddEducation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setError("");
    const token = localStorage.getItem("germain_admin_token");
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "education",
          action: "add",
          data: {
            degree: eduDegree,
            institution: eduInstitution,
            duration: eduDuration,
            location: eduLocation,
            description: eduDescription,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Diplôme ajouté avec succès !");
        setEduDegree("");
        setEduInstitution("");
        setEduDuration("");
        setEduLocation("");
        setEduDescription("");
        fetchAboutData();
      } else {
        setError(data.message || "Erreur lors de l'ajout");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEducation = async (item) => {
    if (!confirm("Voulez-vous supprimer ce diplôme ?")) return;
    const token = localStorage.getItem("germain_admin_token");
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "education",
          action: "delete",
          data: item,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAboutData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setError("");
    const token = localStorage.getItem("germain_admin_token");
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "experience",
          action: "add",
          data: {
            role: expRole,
            company: expCompany,
            duration: expDuration,
            location: expLocation,
            description: expDescription,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Expérience professionnelle ajoutée avec succès !");
        setExpRole("");
        setExpCompany("");
        setExpDuration("");
        setExpLocation("");
        setExpDescription("");
        fetchAboutData();
      } else {
        setError(data.message || "Erreur lors de l'ajout");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (item) => {
    if (!confirm("Voulez-vous supprimer cette expérience ?")) return;
    const token = localStorage.getItem("germain_admin_token");
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "experience",
          action: "delete",
          data: item,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAboutData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    if (!certImage) {
      setError("Veuillez uploader ou renseigner l'URL de la photo Recto (Face A) du certificat.");
      return;
    }
    setLoading(true);
    setSuccessMessage("");
    setError("");
    const token = localStorage.getItem("germain_admin_token");
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "certificates",
          action: "add",
          data: {
            title: certTitle,
            image: certImage || "/images/certificates/default.png",
            image_back: certImageBack || "",
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Certificat ajouté avec succès !");
        setCertTitle("");
        setCertImage("");
        setCertImageBack("");
        fetchAboutData();
      } else {
        setError(data.message || "Erreur lors de l'ajout");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertificate = async (item) => {
    if (!confirm("Voulez-vous supprimer cette certification ?")) return;
    const token = localStorage.getItem("germain_admin_token");
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "certificates",
          action: "delete",
          data: item,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAboutData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Base title="Administration — Germain Portfolio">
      <section className="section min-h-[85vh] flex items-center justify-center bg-gradient-to-tr from-gray-50 to-gray-100 dark:from-darkmode-body dark:to-darkmode-theme-light/10">
        <div className="container py-12 flex justify-center">
          {!isAuthenticated ? (
            <div className="w-full max-w-md p-8 rounded-3xl bg-white/80 dark:bg-darkmode-theme-light/80 shadow-2xl border border-border dark:border-darkmode-border backdrop-blur-xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary text-3xl shadow-inner shadow-primary/5">
                  <FaLock />
                </div>
                <h2 className="h3 font-bold text-gray-900 dark:text-white tracking-tight">Espace Admin</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  Connectez-vous pour piloter votre portfolio
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="admin-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Saisissez votre mot de passe"
                    className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
                    required
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-950/20 p-3.5 rounded-xl border border-red-100 dark:border-red-900/30 text-center">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  id="admin-login-button"
                  className="btn btn-primary w-full py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all text-sm tracking-wide"
                >
                  Se connecter
                </button>
              </form>
            </div>
          ) : (
            <div className="w-full max-w-6xl">
              {/* Top Bar */}
              <div className="flex flex-wrap items-center justify-between mb-8 pb-6 border-b border-border dark:border-darkmode-border gap-4">
                <div>
                  <h1 className="h2 font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                    <span className="bg-primary/10 text-primary p-2.5 rounded-xl text-lg hidden sm:block"><FaChartLine /></span>
                    Console d'Administration
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                    Pilotez vos projets, parcours, certifications et messages de contact en temps réel
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase border border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all duration-300 shadow hover:shadow-red-500/10"
                >
                  <FaSignOutAlt /> Se déconnecter
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                {/* Modern Floating Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-darkmode-theme-light rounded-3xl border border-border dark:border-darkmode-border p-5 shadow-xl space-y-6 sticky top-24 backdrop-blur-lg">
                    <div className="px-2 pb-3 border-b border-border dark:border-darkmode-border">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary/80">Menu principal</span>
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => { setActiveTab("dashboard"); setError(""); setSuccessMessage(""); }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-extrabold transition-all duration-300 ${
                          activeTab === "dashboard"
                            ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/25 translate-x-1"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary bg-transparent hover:bg-gray-50 dark:hover:bg-darkmode-body/50 border-0"
                        }`}
                      >
                        <FaChartLine className="text-base" /> Vue d'ensemble
                      </button>
                      <button
                        id="btn-tab-inbox"
                        onClick={() => { setActiveTab("inbox"); setError(""); setSuccessMessage(""); fetchMessages(); }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-extrabold transition-all duration-300 ${
                          activeTab === "inbox"
                            ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/25 translate-x-1"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary bg-transparent hover:bg-gray-50 dark:hover:bg-darkmode-body/50 border-0"
                        }`}
                      >
                        <FaInbox className="text-base" /> Boîte de Réception
                        {messages.length > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shadow-red-500/20 animate-pulse" id="admin-inbox-badge">
                            {messages.length}
                          </span>
                        )}
                      </button>
                      <button
                        id="btn-tab-add-project"
                        onClick={() => { setActiveTab("add-project"); setError(""); setSuccessMessage(""); }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-extrabold transition-all duration-300 ${
                          activeTab === "add-project"
                            ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/25 translate-x-1"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary bg-transparent hover:bg-gray-50 dark:hover:bg-darkmode-body/50 border-0"
                        }`}
                      >
                        <FaFolderPlus className="text-base" /> Ajouter Projet
                      </button>
                      <button
                        id="btn-tab-manage-projects"
                        onClick={() => { setActiveTab("manage-projects"); setError(""); setSuccessMessage(""); }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-extrabold transition-all duration-300 ${
                          activeTab === "manage-projects"
                            ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/25 translate-x-1"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary bg-transparent hover:bg-gray-50 dark:hover:bg-darkmode-body/50 border-0"
                        }`}
                      >
                        <FaTasks className="text-base" /> Gérer Projets
                      </button>
                      <button
                        id="btn-tab-education"
                        onClick={() => { setActiveTab("education"); setError(""); setSuccessMessage(""); fetchAboutData(); }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-extrabold transition-all duration-300 ${
                          activeTab === "education"
                            ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/25 translate-x-1"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary bg-transparent hover:bg-gray-50 dark:hover:bg-darkmode-body/50 border-0"
                        }`}
                      >
                        <FaGraduationCap className="text-base" /> Éducation / Diplômes
                      </button>
                      <button
                        id="btn-tab-experience"
                        onClick={() => { setActiveTab("experience"); setError(""); setSuccessMessage(""); fetchAboutData(); }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-extrabold transition-all duration-300 ${
                          activeTab === "experience"
                            ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/25 translate-x-1"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary bg-transparent hover:bg-gray-50 dark:hover:bg-darkmode-body/50 border-0"
                        }`}
                      >
                        <FaBriefcase className="text-base" /> Expériences Pro.
                      </button>
                      <button
                        id="btn-tab-certificates"
                        onClick={() => { setActiveTab("certificates"); setError(""); setSuccessMessage(""); fetchAboutData(); }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-extrabold transition-all duration-300 ${
                          activeTab === "certificates"
                            ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/25 translate-x-1"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary bg-transparent hover:bg-gray-50 dark:hover:bg-darkmode-body/50 border-0"
                        }`}
                      >
                        <FaAward className="text-base" /> Certifications
                      </button>
                      <button
                        id="btn-tab-add-tech"
                        onClick={() => { setActiveTab("add-tech"); setError(""); setSuccessMessage(""); }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-extrabold transition-all duration-300 ${
                          activeTab === "add-tech"
                            ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/25 translate-x-1"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary bg-transparent hover:bg-gray-50 dark:hover:bg-darkmode-body/50 border-0"
                        }`}
                      >
                        <FaTools className="text-base" /> Ajouter Technologie
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dashboard Panels */}
                <div className="lg:col-span-3">
                  {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold transition-all shadow-sm">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="mb-6 p-4 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-400 text-sm font-semibold transition-all shadow-sm">
                      {successMessage}
                    </div>
                  )}

                  {activeTab === "dashboard" && (
                    <div className="space-y-8">
                      {/* Grid Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-3xl bg-white dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border shadow-xl hover:shadow-2xl hover:border-primary/25 transition-all duration-300">
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">Total Projets</h3>
                          <p className="text-5xl font-black text-primary tracking-tight">{projects.length}</p>
                          <p className="text-[11px] font-semibold text-gray-400 mt-3">Projets sur le disque</p>
                        </div>
                        <div 
                          className="p-6 rounded-3xl bg-white dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border shadow-xl hover:shadow-2xl hover:border-primary/25 transition-all duration-300 cursor-pointer"
                          onClick={() => { setActiveTab("inbox"); fetchMessages(); }}
                        >
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">Messages reçus</h3>
                          <p className="text-5xl font-black text-primary tracking-tight" id="admin-messages-count">{messages.length}</p>
                          <p className="text-[11px] font-semibold text-gray-400 mt-3">Messages stockés localement</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border shadow-xl hover:shadow-2xl hover:border-primary/25 transition-all duration-300">
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">Parcours Profil</h3>
                          <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-3">
                            🎓 {education.length} Diplômes<br />
                            💼 {experience.length} Expériences<br />
                            🏆 {certificates.length} Certificats
                          </p>
                        </div>
                      </div>

                      {/* Floating CTA */}
                      <div className="p-8 rounded-3xl bg-white dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border shadow-xl text-center space-y-4">
                        <h3 className="h4 font-extrabold text-gray-800 dark:text-white tracking-tight">Besoin d'enrichir votre profil ?</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto font-medium">
                          Gérez en toute simplicité votre éducation, vos expériences en entreprise ainsi que vos certifications directement ci-dessous ou depuis les onglets latéraux.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-2">
                          <button
                            onClick={() => setActiveTab("education")}
                            className="btn btn-primary px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider shadow"
                          >
                            <FaGraduationCap /> Éducation
                          </button>
                          <button
                            onClick={() => setActiveTab("experience")}
                            className="btn btn-primary px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider shadow"
                          >
                            <FaBriefcase /> Expériences
                          </button>
                          <button
                            onClick={() => setActiveTab("certificates")}
                            className="btn btn-primary px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider shadow"
                          >
                            <FaAward /> Certifications
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "inbox" && (
                    <div className="bg-white dark:bg-darkmode-theme-light p-8 rounded-3xl border border-border dark:border-darkmode-border shadow-xl">
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border dark:border-darkmode-border">
                        <h2 className="h4 font-extrabold text-gray-800 dark:text-white flex items-center gap-2.5 tracking-tight">
                          <FaInbox className="text-primary text-xl" /> Boîte de Réception ({messages.length})
                        </h2>
                        <button onClick={fetchMessages} className="text-xs text-primary hover:underline font-extrabold tracking-wide uppercase">
                          Actualiser
                        </button>
                      </div>

                      {messages.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                          <FaEnvelopeOpen className="text-6xl mx-auto mb-4 text-gray-200 dark:text-gray-700" />
                          <p className="font-extrabold text-lg text-gray-700 dark:text-gray-300">Aucun message pour le moment</p>
                          <p className="text-sm mt-1 font-medium">Vos messages s'afficheront ici en temps réel.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className="p-6 rounded-2xl border border-border dark:border-darkmode-border bg-gray-50/50 dark:bg-darkmode-body/30 hover:shadow-lg transition-all duration-300 relative group"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                  <h3 className="text-base font-extrabold text-gray-800 dark:text-white flex items-center gap-2 flex-wrap tracking-tight">
                                    {msg.name}
                                    <span className="text-xs font-semibold text-gray-400">
                                      ({new Date(msg.date).toLocaleString("fr-FR")})
                                    </span>
                                  </h3>
                                  <a href={`mailto:${msg.email}`} className="text-xs text-primary hover:underline font-bold">
                                    {msg.email}
                                  </a>
                                </div>
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="text-red-500 hover:bg-red-500/10 p-2.5 rounded-xl transition-all duration-300 btn-delete-message border-0 bg-transparent"
                                  title="Supprimer ce message"
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              </div>

                              <div className="border-t border-border dark:border-darkmode-border pt-4">
                                <p className="text-sm font-extrabold text-gray-700 dark:text-gray-300 mb-2">
                                  Objet : {msg.subject}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed font-medium">
                                  {msg.message}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "education" && (
                    <div className="space-y-8">
                      {/* Add Form */}
                      <div className="bg-white dark:bg-darkmode-theme-light p-8 rounded-3xl border border-border dark:border-darkmode-border shadow-xl">
                        <h2 className="h4 font-extrabold text-gray-800 dark:text-white mb-6 flex items-center gap-2.5 tracking-tight">
                          <FaGraduationCap className="text-primary" /> Ajouter un Diplôme / Éducation
                        </h2>
                        <form onSubmit={handleAddEducation} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Intitulé du Diplôme</label>
                              <input
                                type="text"
                                value={eduDegree}
                                onChange={(e) => setEduDegree(e.target.value)}
                                placeholder="Ex: Master Ingénierie Logicielle"
                                className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Établissement / École</label>
                              <input
                                type="text"
                                value={eduInstitution}
                                onChange={(e) => setEduInstitution(e.target.value)}
                                placeholder="Ex: Epitech Bénin"
                                className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Durée (Dates)</label>
                              <input
                                type="text"
                                value={eduDuration}
                                onChange={(e) => setEduDuration(e.target.value)}
                                placeholder="Ex: 2024 - 2026"
                                className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Lieu / Ville</label>
                              <input
                                type="text"
                                value={eduLocation}
                                onChange={(e) => setEduLocation(e.target.value)}
                                placeholder="Ex: Cotonou, Bénin"
                                className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Description de la Formation</label>
                            <textarea
                              value={eduDescription}
                              onChange={(e) => setEduDescription(e.target.value)}
                              placeholder="Décrivez les cours majeurs, compétences clés ou projets scolaires notables..."
                              rows={4}
                              className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                          >
                            {loading ? "Création..." : "Ajouter le Diplôme"}
                          </button>
                        </form>
                      </div>

                      {/* List */}
                      <div className="bg-white dark:bg-darkmode-theme-light p-8 rounded-3xl border border-border dark:border-darkmode-border shadow-xl">
                        <h3 className="h4 font-extrabold text-gray-800 dark:text-white mb-6">Diplômes Existants</h3>
                        <div className="space-y-4">
                          {education.map((item, idx) => (
                            <div key={idx} className="p-5 rounded-2xl border border-border dark:border-darkmode-border bg-gray-50/50 dark:bg-darkmode-body/10 flex items-start justify-between gap-4">
                              <div>
                                <h4 className="text-sm font-extrabold text-gray-800 dark:text-white tracking-tight">{item.degree}</h4>
                                <p className="text-xs font-bold text-primary">{item.institution} — <span className="text-gray-400 font-semibold">{item.duration} ({item.location})</span></p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-semibold leading-relaxed">{item.description}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteEducation(item)}
                                className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-all border-0 bg-transparent"
                                title="Supprimer"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "experience" && (
                    <div className="space-y-8">
                      {/* Add Form */}
                      <div className="bg-white dark:bg-darkmode-theme-light p-8 rounded-3xl border border-border dark:border-darkmode-border shadow-xl">
                        <h2 className="h4 font-extrabold text-gray-800 dark:text-white mb-6 flex items-center gap-2.5 tracking-tight">
                          <FaBriefcase className="text-primary" /> Ajouter une Expérience Professionnelle
                        </h2>
                        <form onSubmit={handleAddExperience} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Poste / Rôle</label>
                              <input
                                type="text"
                                value={expRole}
                                onChange={(e) => setExpRole(e.target.value)}
                                placeholder="Ex: Développeur Full-Stack"
                                className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Entreprise / Organisation</label>
                              <input
                                type="text"
                                value={expCompany}
                                onChange={(e) => setExpCompany(e.target.value)}
                                placeholder="Ex: KAWA SERVICES"
                                className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Durée (Dates)</label>
                              <input
                                type="text"
                                value={expDuration}
                                onChange={(e) => setExpDuration(e.target.value)}
                                placeholder="Ex: Avril - Mai 2026"
                                className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Lieu</label>
                              <input
                                type="text"
                                value={expLocation}
                                onChange={(e) => setExpLocation(e.target.value)}
                                placeholder="Ex: Cotonou, Bénin"
                                className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Description de la Mission / Réalisations</label>
                            <textarea
                              value={expDescription}
                              onChange={(e) => setExpDescription(e.target.value)}
                              placeholder="Détaillez vos réalisations techniques clés, méthodologies ou technologies utilisées..."
                              rows={4}
                              className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                          >
                            {loading ? "Création..." : "Ajouter l'Expérience"}
                          </button>
                        </form>
                      </div>

                      {/* List */}
                      <div className="bg-white dark:bg-darkmode-theme-light p-8 rounded-3xl border border-border dark:border-darkmode-border shadow-xl">
                        <h3 className="h4 font-extrabold text-gray-800 dark:text-white mb-6">Expériences Existantes</h3>
                        <div className="space-y-4">
                          {experience.map((item, idx) => (
                            <div key={idx} className="p-5 rounded-2xl border border-border dark:border-darkmode-border bg-gray-50/50 dark:bg-darkmode-body/10 flex items-start justify-between gap-4">
                              <div>
                                <h4 className="text-sm font-extrabold text-gray-800 dark:text-white tracking-tight">{item.role}</h4>
                                <p className="text-xs font-bold text-primary">{item.company} — <span className="text-gray-400 font-semibold">{item.duration} ({item.location})</span></p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-semibold leading-relaxed">{item.description}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteExperience(item)}
                                className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-all border-0 bg-transparent"
                                title="Supprimer"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "certificates" && (
                    <div className="space-y-8">
                      {/* Add Form */}
                      <div className="bg-white dark:bg-darkmode-theme-light p-8 rounded-3xl border border-border dark:border-darkmode-border shadow-xl">
                        <h2 className="h4 font-extrabold text-gray-800 dark:text-white mb-6 flex items-center gap-2.5 tracking-tight">
                          <FaAward className="text-primary" /> Ajouter un Certificat
                        </h2>
                        <form onSubmit={handleAddCertificate} className="space-y-6">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Nom / Titre du Certificat</label>
                            <input
                              type="text"
                              value={certTitle}
                              onChange={(e) => setCertTitle(e.target.value)}
                              placeholder="Ex: Diplôme ou Certification Professionnelle"
                              className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Recto (Front) */}
                            <div className="space-y-3">
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Photo Recto (Face A)</label>
                              
                              {certImage ? (
                                <div className="relative rounded-2xl border border-dashed border-primary/40 p-4 bg-primary/5 flex flex-col items-center justify-center min-h-[140px] group transition-all">
                                  <img src={certImage} alt="Recto Preview" className="max-h-[100px] object-contain rounded-lg shadow-sm" />
                                  <button
                                    type="button"
                                    onClick={() => setCertImage("")}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full border-0 shadow-sm cursor-pointer"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              ) : (
                                <div className="relative rounded-2xl border border-dashed border-gray-300 dark:border-darkmode-border p-6 flex flex-col items-center justify-center min-h-[140px] bg-gray-50/50 dark:bg-darkmode-body/10 hover:border-primary/50 transition-colors">
                                  {uploadingRecto ? (
                                    <div className="flex flex-col items-center gap-2">
                                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                      <span className="text-xs font-bold text-gray-500">Téléchargement...</span>
                                    </div>
                                  ) : (
                                    <label className="flex flex-col items-center cursor-pointer text-center w-full">
                                      <span className="text-2xl text-primary mb-2">📸</span>
                                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Prendre une photo ou choisir un fichier</span>
                                      <span className="text-[10px] text-gray-400 mt-1">Image Recto (Obligatoire)</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, "recto")}
                                        className="hidden"
                                      />
                                    </label>
                                  )}
                                </div>
                              )}
                              
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">Ou URL:</span>
                                <input
                                  type="text"
                                  value={certImage}
                                  onChange={(e) => setCertImage(e.target.value)}
                                  placeholder="https://... ou /images/..."
                                  className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-xs font-semibold"
                                />
                              </div>
                            </div>

                            {/* Verso (Back - Optional) */}
                            <div className="space-y-3">
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Photo Verso (Face B - Optionnel)</label>
                              
                              {certImageBack ? (
                                <div className="relative rounded-2xl border border-dashed border-primary/40 p-4 bg-primary/5 flex flex-col items-center justify-center min-h-[140px] group transition-all">
                                  <img src={certImageBack} alt="Verso Preview" className="max-h-[100px] object-contain rounded-lg shadow-sm" />
                                  <button
                                    type="button"
                                    onClick={() => setCertImageBack("")}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full border-0 shadow-sm cursor-pointer"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              ) : (
                                <div className="relative rounded-2xl border border-dashed border-gray-300 dark:border-darkmode-border p-6 flex flex-col items-center justify-center min-h-[140px] bg-gray-50/50 dark:bg-darkmode-body/10 hover:border-primary/50 transition-colors">
                                  {uploadingVerso ? (
                                    <div className="flex flex-col items-center gap-2">
                                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                      <span className="text-xs font-bold text-gray-500">Téléchargement...</span>
                                    </div>
                                  ) : (
                                    <label className="flex flex-col items-center cursor-pointer text-center w-full">
                                      <span className="text-2xl text-primary mb-2">📸</span>
                                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Prendre une photo ou choisir un fichier</span>
                                      <span className="text-[10px] text-gray-400 mt-1">Image Verso (Optionnel)</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, "verso")}
                                        className="hidden"
                                      />
                                    </label>
                                  )}
                                </div>
                              )}
                              
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">Ou URL:</span>
                                <input
                                  type="text"
                                  value={certImageBack}
                                  onChange={(e) => setCertImageBack(e.target.value)}
                                  placeholder="https://... ou /images/..."
                                  className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-xs font-semibold"
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                          >
                            {loading ? "Création..." : "Ajouter le Certificat"}
                          </button>
                        </form>
                      </div>

                      {/* List */}
                      <div className="bg-white dark:bg-darkmode-theme-light p-8 rounded-3xl border border-border dark:border-darkmode-border shadow-xl">
                        <h3 className="h4 font-extrabold text-gray-800 dark:text-white mb-6">Certificats Existants</h3>
                        <div className="space-y-4">
                          {certificates.map((item, idx) => (
                            <div key={idx} className="p-5 rounded-2xl border border-border dark:border-darkmode-border bg-gray-50/50 dark:bg-darkmode-body/10 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="flex gap-2">
                                  {item.image && (
                                    <div className="text-center">
                                      <img src={item.image} alt="Recto" className="w-16 h-12 object-contain rounded-lg border border-border bg-white dark:bg-darkmode-body" />
                                      <span className="text-[9px] font-bold text-gray-400">Recto</span>
                                    </div>
                                  )}
                                  {item.image_back && (
                                    <div className="text-center">
                                      <img src={item.image_back} alt="Verso" className="w-16 h-12 object-contain rounded-lg border border-border bg-white dark:bg-darkmode-body" />
                                      <span className="text-[9px] font-bold text-gray-400">Verso</span>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-sm font-extrabold text-gray-800 dark:text-white tracking-tight">{item.title}</h4>
                                  <p className="text-xs font-semibold text-gray-400">
                                    {item.image_back ? "Double face (Recto-Verso)" : "Simple face"}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteCertificate(item)}
                                className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-all border-0 bg-transparent"
                                title="Supprimer"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "add-project" && (
                    <div className="bg-white dark:bg-darkmode-theme-light p-8 rounded-3xl border border-border dark:border-darkmode-border shadow-xl">
                      <h2 className="h4 font-extrabold text-gray-800 dark:text-white mb-8 tracking-tight">Ajouter un nouveau projet</h2>
                      <form onSubmit={handleAddProject} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Titre du Projet</label>
                            <input
                              type="text"
                              id="input-project-title"
                              value={projectTitle}
                              onChange={(e) => setProjectTitle(e.target.value)}
                              placeholder="Ex: Système de Gestion Aéroport"
                              className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Catégorie</label>
                            <select
                              id="select-project-category"
                              value={projectCategory}
                              onChange={(e) => setProjectCategory(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-white dark:bg-darkmode-theme-light text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold"
                            >
                              <option value="Projets d'Entreprise">Projets d'Entreprise</option>
                              <option value="Projets Freelance">Projets Freelance</option>
                              <option value="Projets Personnels">Projets Personnels</option>
                              <option value="Projets Epitech">Projets Epitech</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Date</label>
                            <input
                              type="date"
                              id="input-project-date"
                              value={projectDate}
                              onChange={(e) => setProjectDate(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Image Principale</label>
                            
                            {projectImage && projectImage !== "/images/post/default.png" ? (
                              <div className="relative rounded-2xl border border-dashed border-primary/40 p-4 bg-primary/5 flex flex-col items-center justify-center min-h-[140px] group transition-all">
                                <img src={projectImage} alt="Project Preview" className="max-h-[100px] object-contain rounded-lg shadow-sm" />
                                <button
                                  type="button"
                                  onClick={() => setProjectImage("/images/post/default.png")}
                                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full border-0 shadow-sm cursor-pointer"
                                >
                                  Supprimer
                                </button>
                              </div>
                            ) : (
                              <div className="relative rounded-2xl border border-dashed border-gray-300 dark:border-darkmode-border p-6 flex flex-col items-center justify-center min-h-[140px] bg-gray-50/50 dark:bg-darkmode-body/10 hover:border-primary/50 transition-colors">
                                {uploadingProjectImage ? (
                                  <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs font-bold text-gray-500">Téléchargement...</span>
                                  </div>
                                ) : (
                                  <label className="flex flex-col items-center cursor-pointer text-center w-full">
                                    <span className="text-2xl text-primary mb-2">📸</span>
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Prendre une photo ou choisir un fichier</span>
                                    <span className="text-[10px] text-gray-400 mt-1">Image du projet</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleFileUpload(e, "project")}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                              </div>
                            )}
                            
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">Ou URL:</span>
                              <input
                                type="text"
                                id="input-project-image"
                                value={projectImage}
                                onChange={(e) => setProjectImage(e.target.value)}
                                placeholder="https://... ou /images/..."
                                className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Lien Plateforme externe (Optionnel)</label>
                            <input
                              type="url"
                              id="input-project-link"
                              value={projectLink}
                              onChange={(e) => setProjectLink(e.target.value)}
                              placeholder="Ex: https://alodotech.com"
                              className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Galerie d'Images (Optionnel, séparés par virgules)</label>
                            <input
                              type="text"
                              id="input-project-gallery"
                              value={projectGallery}
                              onChange={(e) => setProjectGallery(e.target.value)}
                              placeholder="Ex: /images/post/img1.png, /images/post/img2.png"
                              className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <input
                            type="checkbox"
                            id="input-project-featured"
                            checked={projectFeatured}
                            onChange={(e) => setProjectFeatured(e.target.checked)}
                            className="w-5 h-5 rounded border-border text-primary focus:ring-primary bg-transparent cursor-pointer"
                          />
                          <label htmlFor="input-project-featured" className="text-sm font-extrabold text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                            Définir comme Projet Phare (Featured - affiché en haut de la page d'accueil)
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Description / Contenu (Markdown)</label>
                          <textarea
                            id="input-project-content"
                            value={projectContent}
                            onChange={(e) => setProjectContent(e.target.value)}
                            placeholder="Entrez le contenu de votre projet ici (Markdown supporté)"
                            rows={8}
                            className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          id="btn-submit-project"
                          disabled={loading}
                          className="btn btn-primary px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/10 flex items-center justify-center gap-2 min-w-[170px]"
                        >
                          {loading ? "Création..." : "Enregistrer le Projet"}
                        </button>
                      </form>
                    </div>
                  )}

                  {activeTab === "add-tech" && (
                    <div className="bg-white dark:bg-darkmode-theme-light p-8 rounded-3xl border border-border dark:border-darkmode-border shadow-xl">
                      <h2 className="h4 font-extrabold text-gray-800 dark:text-white mb-8 tracking-tight">Ajouter une nouvelle technologie</h2>
                      <form onSubmit={handleAddTech} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Nom de la Technologie</label>
                            <input
                              type="text"
                              id="input-tech-name"
                              value={techName}
                              onChange={(e) => setTechName(e.target.value)}
                              placeholder="Ex: Kubernetes, Svelte, Rust"
                              className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">URL du Logo (SimpleIcons/Devicon SVG)</label>
                            <input
                              type="text"
                              id="input-tech-logo"
                              value={techLogoUrl}
                              onChange={(e) => setTechLogoUrl(e.target.value)}
                              placeholder="Ex: https://cdn.simpleicons.org/rust/000000"
                              className="w-full px-4 py-3 rounded-xl border border-border dark:border-darkmode-border bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          id="btn-submit-tech"
                          disabled={loading}
                          className="btn btn-primary px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/10 flex items-center justify-center gap-2 min-w-[170px]"
                        >
                          {loading ? "Ajout..." : "Ajouter la Technologie"}
                        </button>
                      </form>
                    </div>
                  )}

                  {activeTab === "manage-projects" && (
                    <div className="bg-white dark:bg-darkmode-theme-light p-8 rounded-3xl border border-border dark:border-darkmode-border shadow-xl">
                      <h2 className="h4 font-extrabold text-gray-800 dark:text-white mb-8 tracking-tight">Gestion des Projets</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-border dark:border-darkmode-border">
                              <th className="py-4 font-bold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">Titre</th>
                              <th className="py-4 font-bold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">Catégories</th>
                              <th className="py-4 font-bold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">Date</th>
                              <th className="py-4 font-bold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projects.map((project) => (
                              <tr
                                key={project.relativePath}
                                className="border-b border-border dark:border-darkmode-border hover:bg-gray-50/50 dark:hover:bg-darkmode-body/20 transition-all duration-300"
                              >
                                <td className="py-4 font-extrabold text-gray-800 dark:text-white text-sm tracking-tight">{project.frontmatter.title}</td>
                                <td className="py-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                  {project.frontmatter.categories?.join(", ") || "Aucune"}
                                </td>
                                <td className="py-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                  {project.frontmatter.date ? project.frontmatter.date.split("T")[0] : "N/A"}
                                </td>
                                <td className="py-4 text-center">
                                  <div className="flex justify-center items-center gap-3">
                                    <a
                                      href={`/posts/${project.slug}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 text-sm border-0"
                                      title="Voir en ligne"
                                    >
                                      <FaEye />
                                    </a>
                                    <button
                                      onClick={() => handleDeleteProject(project.relativePath)}
                                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-300 text-sm btn-delete-project-row border-0 bg-transparent"
                                      title="Supprimer le fichier Markdown"
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Base>
  );
}
