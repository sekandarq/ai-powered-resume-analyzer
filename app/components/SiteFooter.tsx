import { Linkedin } from "lucide-react";

const LINKEDIN_URL = "https://www.linkedin.com/in/mohamad-aliff-iskandar/";

const SiteFooter = () => (
  <footer className="site-footer">
    <p>Built &amp; Deployed By Aliff Iskandar</p>

    <a
      href={LINKEDIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="site-footer-link"
      aria-label="Connect with Aliff Iskandar on LinkedIn"
    >
      <span>Let&apos;s connect</span>
      <Linkedin className="h-4 w-4" />
    </a>
  </footer>
);

export default SiteFooter;
