import {useLocation, useNavigate, useParams} from "react-router";
import {useEffect, useMemo, useRef, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import ResumePageNavbar from "~/components/ResumePageNavbar";
import Summary from "~/components/feedback/Summary";
import ATS from "~/components/feedback/ATS";
import Details from "~/components/feedback/Details";
import KeywordAlignment from "~/components/feedback/KeywordAlignment";
import InterviewPrep from "~/components/feedback/InterviewPrep";
import Card from "~/components/ui/Card";
import ActionPlan from "~/components/feedback/ActionPlan";
import Button from "~/components/ui/Button";
import SiteFooter from "~/components/SiteFooter";
import { SAMPLE_RESUME } from "~/data/sampleAnalysis";
import { buildMeta } from "~/lib/meta";
import {
    ExternalLink,
    Eye,
    ListChecks,
    Target,
    X,
} from "lucide-react";
import { cn } from "~/lib/utils";


export const meta = () =>
    buildMeta(
        "ResuMatch | Resume Review",
        "Review ATS score, keyword alignment, prioritized fixes, and interview preparation for a saved resume analysis.",
        { path: "/resume", noIndex: true }
    );

const makeActionId = (category: string, index: number, text: string) =>
    `${category}-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 42) || 'item'}`;

const getPriorityFromScore = (score: number): ActionItem["priority"] => {
    if (score < 50) return "critical";
    if (score < 70) return "important";
    return "minor";
};

const getEffortFromCategory = (category: ActionItem["category"]): ActionItem["effort"] => {
    if (category === "content" || category === "structure") return "moderate";
    if (category === "keywords") return "quick";
    return "quick";
};

const getScoreStatClass = (score: number) => {
    if (score > 70) return "score-stat-good";
    if (score > 49) return "score-stat-warning";
    return "score-stat-danger";
};

const buildActionItems = (feedback: Feedback): ActionItem[] => {
    if (feedback.actionItems?.length) {
        return feedback.actionItems.map((item, index) => ({
            ...item,
            id: item.id || makeActionId(item.category, index, item.title),
        }));
    }

    const categoryGroups: Array<{
        category: ActionItem["category"];
        score: number;
        tips: Feedback["content"]["tips"];
    }> = [
        { category: "tone", score: feedback.toneAndStyle.score, tips: feedback.toneAndStyle.tips },
        { category: "content", score: feedback.content.score, tips: feedback.content.tips },
        { category: "structure", score: feedback.structure.score, tips: feedback.structure.tips },
        { category: "skills", score: feedback.skills.score, tips: feedback.skills.tips },
    ];

    const categoryItems = categoryGroups.flatMap((group) =>
        group.tips
            .filter((tip) => tip.type === "improve")
            .slice(0, 2)
            .map((tip, index) => ({
                id: makeActionId(group.category, index, tip.tip),
                category: group.category,
                priority: getPriorityFromScore(group.score),
                effort: getEffortFromCategory(group.category),
                title: tip.tip,
                issue: tip.explanation || "This area can be improved for stronger recruiter readability.",
                recommendation: `Improve the ${group.category} section by making this point more specific, measurable, and aligned to the target role.`,
                reason: "This change can improve recruiter clarity and make the resume easier to evaluate.",
            } satisfies ActionItem))
    );

    const atsItems = (feedback.ATS.tips || [])
        .filter((tip) => tip.type === "improve")
        .slice(0, 3)
        .map((tip, index) => ({
            id: makeActionId("ats", index, tip.tip),
            category: "ats",
            priority: getPriorityFromScore(feedback.ATS.score),
            effort: "quick",
            title: tip.tip,
            issue: "This may reduce how confidently ATS systems can parse or rank the resume.",
            recommendation: "Revise the resume formatting or wording so the point is clear, keyword-aware, and easy for automated systems to read.",
            reason: "ATS improvements help the resume survive the first screening step.",
        } satisfies ActionItem));

    const keywordItems = (feedback.keywordAlignment?.missing || [])
        .slice(0, 6)
        .map((keyword, index) => ({
            id: makeActionId("keywords", index, keyword),
            category: "keywords",
            priority: (feedback.keywordAlignment.coverage < 50 ? "critical" : "important") as ActionItem["priority"],
            effort: "quick",
            title: `Add "${keyword}" naturally`,
            issue: `The job description appears to value "${keyword}", but it was not found in the resume.`,
            recommendation: "Add this keyword only where it is truthful: a skills list, project description, summary line, or achievement bullet.",
            reason: "Role-specific keywords improve ATS matching and make relevant experience easier for recruiters to spot.",
            keywordsToAdd: [keyword],
        } satisfies ActionItem));

    const strengths = categoryGroups.flatMap((group) =>
        group.tips
            .filter((tip) => tip.type === "good")
            .slice(0, 1)
            .map((tip, index) => ({
                id: makeActionId(`${group.category}-strength`, index, tip.tip),
                category: group.category,
                priority: "strength",
                effort: "quick",
                title: tip.tip,
                issue: tip.explanation || "This is already working well.",
                recommendation: "Keep this strength intact while making higher-priority edits elsewhere.",
                reason: "Protecting strong sections prevents useful evidence from being lost during revisions.",
            } satisfies ActionItem))
    );

    return [...keywordItems, ...atsItems, ...categoryItems, ...strengths];
};

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [jobInfo, setJobInfo] = useState<{title: string; description: string; company: string}>({
        title: '',
        description: '',
        company: ''
    });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('plan');
    const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
    const [focusMode, setFocusMode] = useState(false);
    const [completedActionIds, setCompletedActionIds] = useState<string[]>([]);
    const [actionsHydrated, setActionsHydrated] = useState(false);
    const [resumeMissing, setResumeMissing] = useState(false);
    const [assetLoadError, setAssetLoadError] = useState<string | null>(null);
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const observerRef = useRef<IntersectionObserver | null>(null);
    const resumeObjectUrlRef = useRef<string | null>(null);
    const imageObjectUrlRef = useRef<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isSampleAnalysis = location.pathname === "/sample-analysis" || id === SAMPLE_RESUME.id;
    const analysisId = isSampleAnalysis ? SAMPLE_RESUME.id : id;

    useEffect(() => {
        if (isSampleAnalysis) return;
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [auth.isAuthenticated, id, isLoading, isSampleAnalysis, navigate]);


    useEffect(() => {
        const loadResume = async () => {
            if (isSampleAnalysis) {
                setResumeMissing(false);
                setAssetLoadError(null);
                setImageUrl('');
                setResumeUrl('');
                setJobInfo({
                    title: SAMPLE_RESUME.jobTitle,
                    description: SAMPLE_RESUME.jobDescription || '',
                    company: SAMPLE_RESUME.companyName,
                });
                setFeedback(SAMPLE_RESUME.feedback);
                return;
            }

            if (isLoading || !auth.isAuthenticated || !id) return;

            setResumeMissing(false);
            setAssetLoadError(null);
            setFeedback(null);
            setImageUrl('');
            setResumeUrl('');
            const resume = await kv.get(`resume:${id}`);

            if(!resume) {
                setFeedback(null);
                setResumeMissing(true);
                return;
            }

            const data = JSON.parse(resume) as Resume;
            setJobInfo({
                title: data.jobTitle || '',
                description: data.jobDescription || '',
                company: data.companyName || ''
            });

            setFeedback(data.feedback);

            try {
                const resumeBlob = await fs.read(data.resumePath);
                if (resumeBlob) {
                    const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                    const resumeUrl = URL.createObjectURL(pdfBlob);
                    if (resumeObjectUrlRef.current) URL.revokeObjectURL(resumeObjectUrlRef.current);
                    resumeObjectUrlRef.current = resumeUrl;
                    setResumeUrl(resumeUrl);
                } else {
                    setAssetLoadError("Resume PDF could not be loaded, but the saved feedback is still available.");
                }
            } catch (error) {
                console.error("Failed to load resume PDF", error);
                setAssetLoadError("Resume PDF could not be loaded, but the saved feedback is still available.");
            }

            try {
                const imageBlob = await fs.read(data.imagePath);
                if (imageBlob) {
                    const imageUrl = URL.createObjectURL(imageBlob);
                    if (imageObjectUrlRef.current) URL.revokeObjectURL(imageObjectUrlRef.current);
                    imageObjectUrlRef.current = imageUrl;
                    setImageUrl(imageUrl);
                } else {
                    setAssetLoadError((current) => current || "Resume preview could not be loaded, but the saved feedback is still available.");
                }
            } catch (error) {
                console.error("Failed to load resume preview", error);
                setAssetLoadError((current) => current || "Resume preview could not be loaded, but the saved feedback is still available.");
            }
        }

        loadResume();
    }, [auth.isAuthenticated, id, fs, isLoading, isSampleAnalysis, kv]);

    useEffect(() => {
        return () => {
            if (resumeObjectUrlRef.current) URL.revokeObjectURL(resumeObjectUrlRef.current);
            if (imageObjectUrlRef.current) URL.revokeObjectURL(imageObjectUrlRef.current);
        };
    }, []);

    const actionItems = useMemo(() => {
        if (!feedback) return [];
        return buildActionItems(feedback);
    }, [feedback]);

    const sections = useMemo(() => {
        if (!feedback) return [] as Array<{ id: string; label: string }>;

        const lowAts = feedback.ATS.score < 70;
        const lowKeywords = (feedback.keywordAlignment?.coverage ?? 100) < 75;

        const items = [
            { id: 'plan', label: 'Plan' },
            { id: 'summary', label: 'Summary' },
            ...(!focusMode || lowAts ? [{ id: 'ats', label: 'ATS' }] : []),
            ...((feedback.keywordAlignment && (!focusMode || lowKeywords)) ? [{ id: 'keywords', label: 'Keywords' }] : []),
            { id: 'details', label: 'Details' },
            ...(!focusMode && feedback.interviewPrep ? [{ id: 'interview', label: 'Interview' }] : []),
        ];

        return items;
    }, [feedback, focusMode]);

    useEffect(() => {
        if (!analysisId) return;

        setActionsHydrated(false);
        const saved = window.localStorage.getItem(`resume-actions:${analysisId}`);
        if (!saved) {
            setCompletedActionIds([]);
            setActionsHydrated(true);
            return;
        }

        try {
            const parsed = JSON.parse(saved);
            setCompletedActionIds(Array.isArray(parsed) ? parsed : []);
        } catch {
            setCompletedActionIds([]);
        }
        setActionsHydrated(true);
    }, [analysisId]);

    useEffect(() => {
        if (!analysisId || !actionsHydrated) return;
        window.localStorage.setItem(`resume-actions:${analysisId}`, JSON.stringify(completedActionIds));
    }, [actionsHydrated, analysisId, completedActionIds]);

    const criticalCount = useMemo(() => {
        if (!feedback) return 0;
        let count = 0;
        if (feedback.ATS.score < 70) count += 1;
        if ((feedback.keywordAlignment?.coverage ?? 100) < 75) count += 1;
        if (feedback.structure.score < 70) count += 1;
        if (feedback.content.score < 70) count += 1;
        return count;
    }, [feedback]);

    useEffect(() => {
        if (!sections.length) return;

        setVisibleSections((prev) => ({
            ...prev,
            [sections[0].id]: true,
        }));
        setActiveSection((prev) => sections.some((section) => section.id === prev) ? prev : sections[0].id);

        observerRef.current?.disconnect();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const sectionId = entry.target.getAttribute('data-section-id');
                    if (!sectionId) return;

                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => ({ ...prev, [sectionId]: true }));
                        setActiveSection(sectionId);
                    }
                });
            },
            {
                threshold: 0.08,
                rootMargin: '0px 0px -12% 0px',
            }
        );

        observerRef.current = observer;

        sections.forEach((section) => {
            const node = sectionRefs.current[section.id];
            if (node) observer.observe(node);
        });

        return () => {
            observer.disconnect();
            if (observerRef.current === observer) {
                observerRef.current = null;
            }
        };
    }, [sections]);

    const registerSectionRef = (sectionId: string) => (node: HTMLDivElement | null) => {
        sectionRefs.current[sectionId] = node;

        if (node && observerRef.current) {
            observerRef.current.observe(node);
        }

        if (node) {
            window.requestAnimationFrame(() => {
                const bounds = node.getBoundingClientRect();
                const isInViewport = bounds.top < window.innerHeight * 0.92 && bounds.bottom > 0;

                if (isInViewport) {
                    setVisibleSections((prev) => ({ ...prev, [sectionId]: true }));
                }
            });
        }
    };

    const getStickyScrollOffset = () => {
        const navbar = document.querySelector(".navbar");
        const navbarHeight = navbar instanceof HTMLElement ? navbar.offsetHeight : 0;

        return navbarHeight + 28;
    };

    const scrollToSection = (sectionId: string) => {
        const target = sectionRefs.current[sectionId];
        if (!target) return;

        setVisibleSections((prev) => ({ ...prev, [sectionId]: true }));
        setActiveSection(sectionId);

        const targetTop = window.scrollY + target.getBoundingClientRect().top - getStickyScrollOffset();
        window.scrollTo({
            top: Math.max(0, targetTop),
            behavior: "smooth",
        });
    };

    const toggleActionItem = (actionId: string) => {
        setCompletedActionIds((prev) => (
            prev.includes(actionId)
                ? prev.filter((id) => id !== actionId)
                : [...prev, actionId]
        ));
    };

    const visibleCount = sections.filter((section) => visibleSections[section.id]).length;

    return (
        <main className="app-shell">
            <ResumePageNavbar />
            <section className="main-section feedback-main-section pt-10 sm:pt-12">
                {resumeMissing ? (
                    <Card className="w-full">
                        <div className="flex flex-col items-center gap-4 py-10 text-center">
                            <div>
                                <p className="text-lg font-semibold text-slate-950">This saved analysis is no longer available</p>
                                <p className="mt-1 text-sm text-slate-600">It may no longer exist in your Puter workspace.</p>
                            </div>
                            <Button type="button" onClick={() => navigate("/")} className="min-w-44">
                                Back to home
                            </Button>
                        </div>
                    </Card>
                ) : feedback ? (
                    <div className="feedback-workspace animate-in fade-in duration-1000">
                        <header className="feedback-dashboard glass-panel premium-glass">
                            <div className="feedback-dashboard-head">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Resume Feedback</p>
                                    <h1 className="mt-2">Fix <span className="text-gradient">What Matters</span></h1>
                                    {jobInfo.title && (
                                        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                                            Reviewing your resume against <span className="font-semibold text-slate-900">{jobInfo.title}</span>{jobInfo.company ? ` role at ${jobInfo.company}` : ""}.
                                        </p>
                                    )}
                                </div>

                                <div className="feedback-dashboard-actions">
                                    {imageUrl && resumeUrl && (
                                        <div className="resume-preview-trigger group">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => setPreviewOpen(true)}
                                                className="gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View resume
                                            </Button>

                                            <div className="resume-preview-popover">
                                                <div className="resume-preview-shell">
                                                    <img src={imageUrl} className="resume-preview-image" alt="Resume preview" />
                                                </div>
                                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="resume-preview-link">
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                    Open PDF
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {assetLoadError && (
                                <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4 text-sm leading-6 text-amber-900">
                                    {assetLoadError}
                                </div>
                            )}

                            <div className="feedback-dashboard-grid">
                                <div className={cn("feature-stat min-h-0", getScoreStatClass(feedback.overallScore))}>
                                    <p className="label">Overall</p>
                                    <p className="value">{feedback.overallScore} / 100</p>
                                </div>
                                <div className={cn("feature-stat min-h-0", getScoreStatClass(feedback.ATS.score))}>
                                    <p className="label">ATS Score</p>
                                    <p className="value">{feedback.ATS.score} / 100</p>
                                </div>
                                <div className="feature-stat min-h-0">
                                    <p className="label">Keyword Match</p>
                                    <p className="value">{feedback.keywordAlignment?.coverage ?? "N/A"}%</p>
                                </div>
                                <div className="feature-stat min-h-0">
                                    <p className="label">Priority Areas</p>
                                    <p className="value">{criticalCount}</p>
                                </div>
                            </div>

                            <div className="feedback-dashboard-start">
                                <div className="flex items-center gap-2 text-teal-800">
                                    <Target className="h-4 w-4" />
                                    <p className="text-sm font-semibold">Start with the first three open fixes in the plan below.</p>
                                </div>
                                <button
                                    type="button"
                                    className={`cue-pill ${focusMode ? 'active' : ''}`}
                                    onClick={() => setFocusMode((prev) => !prev)}
                                >
                                    {focusMode ? 'Show Full View' : 'Priority View'}
                                </button>
                            </div>
                        </header>

                        <div className="feedback-cue-nav">
                            <div className="nav-progress-chip">
                                <ListChecks className="h-3.5 w-3.5" />
                                {visibleCount}/{sections.length}
                            </div>
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => scrollToSection(section.id)}
                                    className={`cue-pill ${activeSection === section.id ? 'active' : ''}`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>

                        <div
                            ref={registerSectionRef('plan')}
                            data-section-id="plan"
                            className={`reveal-on-scroll ${visibleSections.plan ? 'is-visible' : ''}`}
                        >
                            <ActionPlan
                                items={actionItems}
                                completedIds={completedActionIds}
                                onToggle={toggleActionItem}
                            />
                        </div>

                        <div
                            ref={registerSectionRef('summary')}
                            data-section-id="summary"
                            className={`reveal-on-scroll ${visibleSections.summary ? 'is-visible' : ''}`}
                        >
                            <Summary feedback={feedback}/>
                        </div>

                        <div
                            ref={registerSectionRef('ats')}
                            data-section-id="ats"
                            className={`reveal-on-scroll ${visibleSections.ats ? 'is-visible' : ''}`}
                        >
                            {(!focusMode || feedback.ATS.score < 70) ? (
                                <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []}/>
                            ) : null}
                        </div>

                        {feedback.keywordAlignment && (!focusMode || feedback.keywordAlignment.coverage < 75) && (
                            <div
                                ref={registerSectionRef('keywords')}
                                data-section-id="keywords"
                                className={`reveal-on-scroll ${visibleSections.keywords ? 'is-visible' : ''}`}
                            >
                                <KeywordAlignment
                                    jobTitle={jobInfo.title}
                                    jobDescription={jobInfo.description}
                                    data={feedback.keywordAlignment}
                                />
                            </div>
                        )}

                        <div
                            ref={registerSectionRef('details')}
                            data-section-id="details"
                            className={`reveal-on-scroll ${visibleSections.details ? 'is-visible' : ''}`}
                        >
                            <Details feedback={feedback}/>
                        </div>

                        {!focusMode && feedback.interviewPrep && (
                            <div
                                ref={registerSectionRef('interview')}
                                data-section-id="interview"
                                className={`reveal-on-scroll ${visibleSections.interview ? 'is-visible' : ''}`}
                            >
                                <InterviewPrep questions={feedback.interviewPrep.questions || []}/>
                            </div>
                        )}
                    </div>
                ) : (
                    <Card className="w-full">
                        <div className="flex flex-col items-center gap-4 py-10 text-center">
                            <img src="/images/resume-scan-2.gif" className="max-w-sm rounded-[24px]"/>
                            <div>
                                <p className="text-lg font-semibold text-slate-950">Preparing your analysis workspace</p>
                                <p className="mt-1 text-sm text-slate-600">Loading preview assets and feedback details.</p>
                            </div>
                        </div>
                    </Card>
                )}

            </section>

            <SiteFooter />

            {previewOpen && imageUrl && resumeUrl && (
                <div className="resume-preview-modal" role="dialog" aria-modal="true" aria-label="Resume preview">
                    <button
                        type="button"
                        className="resume-preview-backdrop"
                        aria-label="Close resume preview"
                        onClick={() => setPreviewOpen(false)}
                    />
                    <div className="resume-preview-dialog">
                        <button
                            type="button"
                            className="resume-preview-close-button"
                            aria-label="Close resume preview"
                            onClick={() => setPreviewOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="resume-preview-modal-body">
                            <img src={imageUrl} className="resume-preview-modal-image" alt="Resume preview" />
                        </div>
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="resume-preview-modal-link">
                            <ExternalLink className="h-4 w-4" />
                            Open PDF in new tab
                        </a>
                    </div>
                </div>
            )}
        </main>
    )
}
export default Resume
