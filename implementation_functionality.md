# Resume Feedback Functionality Implementation Plan

This plan covers three high-priority improvements for the resume feedback section:

1. Resume evidence mapping
2. Before/after rewrite workflow
3. Re-analysis comparison

The goal is to turn the current feedback dashboard from a static analysis report into an interactive improvement loop where users can see where feedback came from, apply suggested edits, and compare results after uploading a revised resume.

## Current Baseline

The app already supports:

- Uploading a resume PDF and job description.
- Generating AI feedback with scores, ATS notes, keyword alignment, interview prep, and action items.
- Saving each analysis in Puter KV storage under `resume:{id}`.
- Showing a feedback dashboard at `/resume/:id`.
- Tracking completed action items in `localStorage`.
- Supporting optional `beforeText` and `suggestedRewrite` fields inside `ActionItem`.

The main limitation is that feedback is not yet strongly connected to exact resume evidence, suggested rewrites are displayed but not interactive, and users cannot compare an improved resume against a previous analysis.

## Phase 1: Data Model and AI Output Contract

Update the feedback schema first, because all three features depend on richer structured output.

### 1.1 Add Resume Evidence Mapping

Extend `ActionItem` with optional evidence fields:

```ts
evidence?: {
  section?: string;
  originalText?: string;
  page?: number;
  confidence: "high" | "medium" | "low";
  explanation?: string;
}
```

Purpose:

- `section`: where the issue appears, such as `Projects`, `Skills`, `Experience`, or `Summary`.
- `originalText`: exact or near-exact resume text that triggered the feedback.
- `page`: useful for multi-page resumes.
- `confidence`: prevents the app from pretending every mapping is certain.
- `explanation`: short reason why this text is relevant.

Also consider adding top-level evidence maps later:

```ts
resumeEvidence?: {
  sectionsDetected: string[];
  roleRequirements: {
    requirement: string;
    status: "strong" | "weak" | "missing";
    evidence?: string;
    recommendation?: string;
  }[];
}
```

This can power requirement coverage in the future, but the first implementation can focus only on `ActionItem.evidence`.

### 1.2 Strengthen Suggested Rewrite Fields

Keep the existing fields:

```ts
beforeText?: string;
suggestedRewrite?: string;
```

Add optional rewrite metadata:

```ts
rewriteVariants?: {
  tone: "concise" | "impact" | "ats";
  text: string;
}[];
```

This allows the UI to show multiple rewrite options without immediately adding another AI call.

### 1.3 Add Analysis Version Metadata

Extend saved `Resume` records with timestamps and lineage:

```ts
createdAt: number;
updatedAt: number;
revisionOf?: string;
version?: number;
previousAnalysisId?: string;
```

Purpose:

- Home page can sort saved analyses reliably.
- A revised analysis can be linked back to the original.
- Comparison pages can load both versions.

## Phase 2: Prompt and Normalization Updates

Update `AIResponseFormat`, `prepareInstructions`, and normalization logic.

### 2.1 Prompt Changes

Ask the model to:

- Identify exact resume snippets when possible.
- Include section names for action items.
- Use `confidence` when mapping feedback to resume text.
- Avoid inventing original text.
- Provide `suggestedRewrite` only when the original text is confidently identified.
- Provide rewrite variants for high-impact bullets when useful.

Important instruction:

> If you cannot identify exact resume text confidently, omit `originalText` and use confidence `low`.

This reduces hallucinated evidence.

### 2.2 Parser and Fallback Handling

Update normalization so older saved analyses still work.

Implementation notes:

- Existing analyses without evidence should render normally.
- Invalid evidence fields should be ignored or downgraded to `confidence: "low"`.
- `createdAt`, `updatedAt`, and version fields should have safe fallbacks.

## Phase 3: Resume Evidence Mapping UI

Add evidence display inside each action item.

### 3.1 Action Item Evidence Block

For action items with evidence, show:

- Section label, such as `Found in Projects`.
- Confidence badge.
- Original resume text in a quoted block.
- Optional page number.
- Explanation if available.

Suggested behavior:

- High confidence: show evidence expanded by default.
- Medium confidence: show compact evidence with a small caveat.
- Low confidence: show “Likely related area” instead of exact wording.

### 3.2 Resume Preview Integration

First version:

- Add a `View resume` button near evidence blocks.
- Keep existing preview modal.

Later version:

- Scroll or highlight mapped text inside a rendered resume preview.
- This is harder because current preview is an image, not selectable text.

### 3.3 Empty Evidence State

If no evidence exists:

- Do not show a scary warning.
- Show the recommendation as normal.
- Optionally show: `No exact resume snippet was identified for this item.`

## Phase 4: Before/After Rewrite Workflow

Turn passive suggested rewrites into an interactive editing workflow.

### 4.1 Rewrite Panel

For action items with `beforeText` or `suggestedRewrite`, show a panel with:

- Original text
- Suggested rewrite
- Optional rewrite variants
- Copy button
- Mark applied button

Recommended actions:

- `Copy rewrite`
- `Use this version`
- `Mark as applied`

Avoid editing the actual PDF in the first version. The workflow should help users transfer improvements to their resume editor.

### 4.2 Rewrite State

Store rewrite workflow state per analysis in `localStorage` initially:

```ts
resume-rewrites:{analysisId}
```

Suggested shape:

```ts
{
  [actionItemId]: {
    selectedRewrite?: string;
    copiedAt?: number;
    appliedAt?: number;
  }
}
```

This keeps the first version lightweight and avoids changing Puter storage behavior too much.

### 4.3 UI Feedback

When a user copies or applies a rewrite:

- Show toast confirmation.
- Update the action item state.
- Optionally auto-check the action item when marked as applied.

### 4.4 Optional AI Rewrite Variations

Later enhancement:

- Add buttons like `Make shorter`, `Make stronger`, `More ATS-friendly`.
- These would trigger additional AI calls.

Do not include this in the first implementation unless the user specifically wants dynamic rewrite generation.

## Phase 5: Re-analysis Comparison

Let users upload an improved resume and compare it against a previous analysis.

### 5.1 Entry Point

Add a primary action on the resume feedback page:

- `Re-analyze updated resume`

This should open a flow similar to upload, but prefill:

- Company name
- Job title
- Job description
- Previous analysis ID

The user only needs to upload the revised PDF.

### 5.2 Route Options

Recommended route:

```txt
/upload?revisionOf={analysisId}
```

Alternative:

```txt
/resume/:id/reanalyze
```

The query-param approach reuses the existing upload page with less routing complexity.

### 5.3 Save Revised Analysis

When re-analysis completes, save a new resume record:

```ts
revisionOf: originalAnalysisId;
previousAnalysisId: originalAnalysisId;
version: original.version + 1;
createdAt: Date.now();
updatedAt: Date.now();
```

Do not overwrite the original analysis. Keeping both versions makes comparison possible and preserves user history.

### 5.4 Comparison Data

Build comparison from two saved analyses:

- Overall score delta
- ATS score delta
- Keyword coverage delta
- Category score deltas
- Completed or resolved action items
- New action items
- Still-open action items
- Missing keywords removed or added

Initial comparison can be computed client-side from the two `Feedback` objects.

### 5.5 Comparison UI

Add a comparison section near the top of the revised resume feedback page when `previousAnalysisId` exists.

Show:

- `Overall: 72 -> 81 (+9)`
- `ATS: 68 -> 76 (+8)`
- `Keyword Match: 61% -> 78% (+17)`
- Category delta cards
- Resolved gaps
- New remaining priorities

Use plain language:

- `Improved`
- `Unchanged`
- `Needs more work`
- `New issue`

### 5.6 Action Item Matching

Action items from two AI runs may not have identical IDs.

First implementation:

- Compare by category and normalized title/recommendation similarity.
- Compare missing keywords directly.
- Treat exact keyword fixes as resolved when the keyword moves from `missing` to `matched`.

Later implementation:

- Ask the AI to produce stable action IDs based on issue type and resume evidence.
- Add a dedicated comparison AI pass.

## Phase 6: Suggested Implementation Order

Recommended order:

1. Extend TypeScript types for evidence, rewrites, and version metadata.
2. Update AI response format and prompt instructions.
3. Update feedback normalization to support new optional fields safely.
4. Update save flow to write `createdAt`, `updatedAt`, and version metadata.
5. Render evidence mapping inside action items.
6. Add rewrite panel with copy and mark-applied behavior.
7. Add re-analysis entry point from feedback page.
8. Reuse upload flow with `revisionOf` query support.
9. Save revised analysis as a new linked record.
10. Add comparison summary to revised feedback page.

## Phase 7: Testing Plan

Manual scenarios:

- Existing saved analysis without evidence still loads.
- Sample analysis still loads.
- New analysis includes evidence where the AI provides it.
- Action item with no evidence still renders cleanly.
- Suggested rewrite can be copied.
- Suggested rewrite can be marked as applied.
- Applied rewrite state persists after refresh.
- Re-analysis flow pre-fills job context.
- Revised analysis links back to original.
- Comparison appears only when a previous analysis exists.
- Score deltas display correctly for positive, negative, and unchanged values.

Technical checks:

- Run `npm run typecheck`.
- Run `npm run build`.
- Test `/sample-analysis`.
- Test `/upload`.
- Test `/resume/:id`.
- Test `/upload?revisionOf=:id`.

## Risks and Tradeoffs

### AI Evidence Hallucination

The model may invent exact resume snippets. Mitigation:

- Prompt it to omit uncertain text.
- Use confidence labels.
- Render low-confidence evidence carefully.

### PDF Text Mapping Complexity

Current preview is image-based, so exact visual highlighting is difficult. First implementation should show evidence text beside the action item. True PDF text highlighting can be a later upgrade.

### Action Item Comparison Accuracy

AI-generated action IDs may vary between runs. First comparison should focus on scores, keywords, and simple normalized matching. More advanced semantic comparison can come later.

### Scope Control

Do not attempt to edit the original resume PDF directly in the first version. That would introduce a much larger document editing problem.

## Recommended MVP

For the first build, implement:

- Optional evidence block per action item.
- Interactive before/after rewrite panel with copy and mark-applied.
- Re-analysis upload flow linked to the original analysis.
- Basic score and keyword comparison on revised analyses.

Leave these for later:

- PDF text highlighting.
- In-app resume editing.
- Dynamic AI rewrite regeneration.
- AI-powered semantic comparison between two analyses.
