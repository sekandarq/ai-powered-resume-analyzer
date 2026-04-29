import { buildMeta } from "~/lib/meta";

export const meta = () => [
  ...buildMeta(
    "ResuMatch | Sample Analysis",
    "Explore a no-login sample resume analysis with ATS feedback, keyword alignment, and prioritized improvement actions."
  ),
];

export { default } from "./resume";
