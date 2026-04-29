const SITE_NAME = "ResuMatch";
const SITE_URL = "https://resumatch-ai-powered-analyzer.vercel.app";
const SITE_IMAGE = `${SITE_URL}/og-image.png`;
const AUTHOR = "Aliff Iskandar";
const DEFAULT_TITLE = "ResuMatch | AI Resume Analyzer";
const DEFAULT_DESCRIPTION =
  "AI-powered resume analysis web app that helps job seekers and fresh graduates compare a resume against a target role with ATS, keyword, structure, content, tone, skills, and interview preparation feedback.";
const DEFAULT_KEYWORDS = [
  "AI resume analyzer",
  "resume analysis",
  "ATS resume checker",
  "ATS readiness",
  "keyword alignment",
  "resume feedback",
  "resume optimization",
  "job seekers",
  "fresh graduates",
  "career tools",
  "React portfolio project",
  "ResuMatch",
];

type BuildMetaOptions = {
  path?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export const buildMeta = (
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  {
    path = "/",
    image = SITE_IMAGE,
    imageAlt = "ResuMatch AI Resume Analyzer dashboard preview",
    keywords = DEFAULT_KEYWORDS,
    noIndex = false,
  }: BuildMetaOptions = {}
) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
  const robots = noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords.join(", ") },
    { name: "author", content: AUTHOR },
    { name: "creator", content: AUTHOR },
    { name: "publisher", content: AUTHOR },
    { name: "application-name", content: SITE_NAME },
    { name: "apple-mobile-web-app-title", content: SITE_NAME },
    { name: "theme-color", content: "#0f766e" },
    { name: "color-scheme", content: "light" },
    { name: "robots", content: robots },
    { name: "googlebot", content: robots },
    { name: "format-detection", content: "telephone=no" },

    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_US" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:secure_url", content: image },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: imageAlt },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: imageAlt },
  ];
};
