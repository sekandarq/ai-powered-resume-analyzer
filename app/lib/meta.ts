const SITE_NAME = "ResuMatch";
const DEFAULT_TITLE = "ResuMatch | AI Resume Analyzer";
const DEFAULT_DESCRIPTION =
  "Analyze ATS readiness, keyword fit, structure, and interview signals with an AI-powered resume review dashboard.";

export const buildMeta = (
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION
) => [
  { title },
  { name: "description", content: description },
  { property: "og:title", content: title },
  { property: "og:description", content: description },
  { property: "og:type", content: "website" },
  { property: "og:site_name", content: SITE_NAME },
  { name: "twitter:card", content: "summary" },
  { name: "twitter:title", content: title },
  { name: "twitter:description", content: description },
];
