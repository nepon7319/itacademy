export interface LessonSeed {
  slug: string;
  title: string;
  duration_min: number;
  xp_reward: number;
  content: string;
  questions: {
    type: 'prompt-challenge' | 'multiple-choice' | 'true-false' | 'order';
    prompt: string;
    explanation: string;
    answers?: { text: string; is_correct: number; order_index: number }[];
  }[];
}

export interface CourseSeed {
  slug: string;
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  order_index: number;
  icon: string;
  project: {
    title: string;
    description: string;
    xp_reward: number;
  };
  lessons: LessonSeed[];
}

export const COURSES_DATA: CourseSeed[] = [
  // ==========================================
  // COURSE 1: AI FUNDAMENTALS
  // ==========================================
  {
    slug: 'ai-fundamentals',
    title: 'AI FUNDAMENTALS',
    description: 'Learn the core concepts of artificial intelligence and how it transforms the way we work and live.',
    difficulty: 'BEGINNER',
    order_index: 1,
    icon: '◈',
    project: {
      title: 'Your First AI Audit',
      description: 'Audit your current daily or weekly workflow. Identify 3 tasks that consume more than 5 hours per week and document how specific AI tools can reduce completion time by at least 60%.',
      xp_reward: 50,
    },
    lessons: [
      {
        slug: 'what-is-ai',
        title: 'What is AI?',
        duration_min: 5,
        xp_reward: 10,
        content: `# What is Artificial Intelligence?

Artificial Intelligence (AI) is the simulation of human cognitive intelligence by computers. But let's look at this through a practical, income-generating lens.

## AI in Your Daily Life
You already use AI every single day:
- **Recommendation algorithms** — Netflix & Spotify analyze behavioral patterns to suggest your next favorite media.
- **Predictive text & smart reply** — Gmail predicts the words you intend to type before your fingers touch the keys.
- **Computer vision** — Face ID unlocks your phone using 30,000 infrared dots mapped to neural networks.
- **Route optimization** — Google Maps aggregates real-time speed data from millions of smartphones to route around congestion.

## The Three Categories of AI

### 1. Narrow AI (What powers today's economy)
AI engineered to perform **one specialized function** with superhuman precision. ChatGPT crafts text. Midjourney renders images. Whisper transcribes audio. These tools do not possess consciousness; they are elite execution machines.

### 2. General AI (AGI - The research frontier)
Hypothetical systems capable of human-level reasoning, cross-domain learning, and original scientific deduction. AGI is the north star of OpenAI, Anthropic, and Google DeepMind.

### 3. Generative AI (Your economic leverage)
The branch of AI that creates **new content** (text, software, illustrations, audio, video) from natural language instructions. This is the exact skill set that enables individuals to operate with the output of entire agencies.

## The Economic Reality
> "AI will not replace humans. But humans who master AI will replace humans who do not."

A copywriter using AI can produce 10x more client deliverables. A developer using AI can ship full-stack web applications twice as fast. A digital marketer can test 50 ad variations in the time it used to take to brainstorm two.

## Summary Checklist
- AI is an amplifier of human intent, not an oracle.
- Generative AI translates simple language into production-grade work.
- Mastering how to command AI is the highest-leverage career skill of the next decade.`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write an introductory prompt instructing an AI assistant to explain the concept of Generative AI to a 10-year-old child using a fun cooking or gaming metaphor.',
            explanation: 'Example: "Act as a friendly elementary school teacher. Explain what Generative AI is to a 10-year-old using the metaphor of a magical Minecraft crafting table. Keep it under 120 words, simple language, no technical jargon, ending with an inspiring question."',
          },
          {
            type: 'multiple-choice',
            prompt: 'Which of the following best describes Narrow AI?',
            explanation: 'Narrow AI is built to excel at one specific task (like chess, text generation, or fraud detection), unlike theoretical General AI.',
            answers: [
              { text: 'An AI that can do everything a human brain can do', is_correct: 0, order_index: 1 },
              { text: 'AI designed to perform one specific task extremely well', is_correct: 1, order_index: 2 },
              { text: 'A low-power AI that only runs on mobile devices', is_correct: 0, order_index: 3 },
              { text: 'AI that requires no computer hardware', is_correct: 0, order_index: 4 },
            ],
          },
          {
            type: 'true-false',
            prompt: 'Generative AI is capable of producing novel text, code, images, and audio from text descriptions.',
            explanation: 'Yes! Generative AI models synthesize entirely new digital media based on learned patterns from vast datasets.',
            answers: [
              { text: 'TRUE', is_correct: 1, order_index: 1 },
              { text: 'FALSE', is_correct: 0, order_index: 2 },
            ],
          },
        ],
      },
      {
        slug: 'how-ai-works',
        title: 'How AI Works',
        duration_min: 7,
        xp_reward: 15,
        content: `# How Does AI Actually Work?

You do not need a PhD in linear algebra to use AI productively. You only need to understand its mental model.

## The Foundation: Pattern Recognition at Scale
Traditional programming follows deterministic rules:
\`\`\`
IF user clicks button THEN open modal
\`\`\`
Machine Learning turns this inside out. Instead of writing rules, we feed the model billions of examples and let it deduce the underlying probability patterns:
\`\`\`
Input 100,000 pictures of cats -> Model identifies the geometric patterns of feline ears, whiskers, and eyes.
\`\`\`

## How Large Language Models (LLMs) Work
Models like **GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5** are fundamentally **next-token prediction engines**.

1. **Tokens**: Words and syllables broken into numeric representations (~4 characters per token).
2. **Context Window**: The short-term memory buffer where your conversation, instructions, and files reside.
3. **Probability Matrix**: When you ask "The sky is...", the model calculates the statistical probability of the next word:
   - "blue" (88%)
   - "cloudy" (8%)
   - "dark" (3%)
   - "green" (0.001%)

## Understanding Hallucinations
Because LLMs predict probable text rather than consulting a deterministic encyclopedia, they can generate statements that sound authoritative but are factually incorrect.
This is known as **hallucination**.

### How Professionals Eliminate Hallucinations
- **Provide source material**: "Answer this question *only* using the text provided in the triple quotes below."
- **Enforce uncertainty**: "If the answer is not explicitly stated in the document, respond with 'Information not found' — do not extrapolate."
- **Request citations**: "Cite the specific paragraph and sentence where you found each fact."`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a hallucination-resistant prompt that instructs an AI to extract key financial metrics from an earnings report only using the provided text, without guessing.',
            explanation: 'Example: "Role: Financial Analyst. Task: Extract total revenue, net margin, and YoY growth from the text below. Constraints: Use ONLY the provided numbers. If any metric is missing, write [NOT PROVIDED] — do NOT estimate or compute external figures. Format as a 3-row Markdown table."',
          },
          {
            type: 'multiple-choice',
            prompt: 'What causes an AI model to "hallucinate"?',
            explanation: 'LLMs generate text based on statistical probability of tokens rather than factual databases, which can lead to plausible-sounding inventions.',
            answers: [
              { text: 'Hardware overheating in server data centers', is_correct: 0, order_index: 1 },
              { text: 'Predicting probable words without factual reasoning or ground truth verification', is_correct: 1, order_index: 2 },
              { text: 'Intentional malicious programming by engineers', is_correct: 0, order_index: 3 },
              { text: 'Viruses downloaded from the public web', is_correct: 0, order_index: 4 },
            ],
          },
        ],
      },
      {
        slug: 'chatgpt-and-assistants',
        title: 'ChatGPT & AI Assistants',
        duration_min: 6,
        xp_reward: 15,
        content: `# The Big Three AI Assistants

Navigating the modern AI landscape requires knowing which model to deploy for which specific commercial task.

## 1. ChatGPT (OpenAI)
- **Flagship Model**: GPT-4o / o1
- **Key Strengths**: Multimodal reasoning, voice mode, advanced data analysis, image generation via DALL-E, custom GPT store.
- **Best Commercial Use**: Rapid prototyping, customer support bots, data analysis with Python execution, general writing.

## 2. Claude (Anthropic)
- **Flagship Model**: Claude 3.5 Sonnet
- **Key Strengths**: Unrivaled coding accuracy, sophisticated literary tone, nuanced instruction-following, massive 200k token context window, Artifacts UI.
- **Best Commercial Use**: Writing long-form marketing copy, building frontend components, analyzing 100-page contracts, technical documentation.

## 3. Gemini (Google)
- **Flagship Model**: Gemini 1.5 Pro
- **Key Strengths**: Incredible 2-million token context window (can read entire video files, codebases, or books in one prompt), native Google Workspace integration.
- **Best Commercial Use**: Video transcription, large code repository refactoring, real-time Google Search synthesis.

## Quick Comparison Matrix

| Tool | Ideal Task | Free Tier Quality |
| :--- | :--- | :--- |
| **Claude 3.5** | Coding, Copywriting, Complex Logic | ★★★★★ |
| **ChatGPT-4o** | Voice, Multimodal, General Everyday Tasks | ★★★★★ |
| **Gemini 1.5** | Massive Document/Video Analysis, Research | ★★★★☆ |`,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'Which AI model is renowned for industry-leading frontend code generation and nuanced human-like copy writing?',
            explanation: 'Claude 3.5 Sonnet by Anthropic is widely recognized by developers and copywriters as the standard for coding and natural prose.',
            answers: [
              { text: 'Claude 3.5 Sonnet', is_correct: 1, order_index: 1 },
              { text: 'DALL-E 2', is_correct: 0, order_index: 2 },
              { text: 'Siri', is_correct: 0, order_index: 3 },
              { text: 'Alexa Mini', is_correct: 0, order_index: 4 },
            ],
          },
        ],
      },
      {
        slug: 'ai-in-everyday-work',
        title: 'AI in Everyday Work',
        duration_min: 8,
        xp_reward: 20,
        content: `# AI in Everyday Commercial Work

To monetize AI, you must understand where time is wasted in modern knowledge work.

## The Four Pillars of AI Acceleration

### 1. Information Synthesis
Instead of reading 40 pages of customer reviews, paste them into Claude:
> *"Extract the top 5 customer complaints, the 3 most requested features, and calculate the overall sentiment score with representative quotes."*
**Time saved: 3 hours -> 45 seconds.**

### 2. First-Draft Generation
Never face a blank page again. The first draft is 80% of the cognitive friction:
- Pitch decks and proposals
- Cold email sequences
- Blog posts and SEO landing pages
- Video scripts and social carousels

### 3. Code & Technical Troubleshooting
AI turns every professional into a competent technical builder:
- Writing custom Excel formulas and Google Apps Scripts
- Creating landing page HTML/CSS
- Debugging SQL database queries

### 4. Roleplaying & Negotiation Prep
Use AI as a sparring partner before critical conversations:
> *"Act as a skeptical corporate Procurement Director reviewing my $5,000/mo retainer proposal. Interrogate my pricing, push for discounts, and question my delivery timeline. I will respond to each objection."*`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a roleplay prompt where the AI acts as a demanding client negotiating a freelance contract, challenging your rate and timeline.',
            explanation: 'Example: "Role: You are a demanding VP of Marketing at a Series A SaaS firm. I am pitching an AI copywriting retainer for $3,500/month. Start the conversation by challenging why my rate is higher than overseas freelancers on Upwork. Be sharp, direct, and push back on vague answers. Wait for my response before proceeding."',
          },
        ],
      },
    ],
  },

  // ==========================================
  // COURSE 2: PROMPT ENGINEERING
  // ==========================================
  {
    slug: 'prompt-engineering',
    title: 'PROMPT ENGINEERING',
    description: 'Master the art of communicating with AI. Learn to craft prompts that get you exactly what you need.',
    difficulty: 'BEGINNER',
    order_index: 2,
    icon: '◉',
    project: {
      title: 'Production Prompt Library',
      description: 'Build an executive prompt library containing 5 reusable prompts for client prospecting, content generation, and technical workflow automation using the RCTF framework.',
      xp_reward: 75,
    },
    lessons: [
      {
        slug: 'what-is-a-prompt',
        title: 'What is a Prompt?',
        duration_min: 5,
        xp_reward: 10,
        content: `# What is a Prompt?

A prompt is the precise set of natural language instructions, context, data, and constraints provided to an AI model to produce a specific target outcome.

## The Quality In / Quality Out Law
AI models are mirror reflections of your instruction clarity:
- **Vague Prompt**: *"Write a post about productivity."*
- **Vague Result**: A generic, cliché listicle that nobody wants to read.

- **Engineered Prompt**: *"Act as a peak performance executive coach with 15 years experience training Fortune 500 CEOs. Write an 8-part Twitter/X thread revealing the 'Energy Audit' framework. Target audience: burned-out tech founders working 70+ hour weeks. Tone: gritty, actionable, zero fluff. Include 1 real-world case study and end with a concrete 10-minute action item."*
- **Engineered Result**: A viral, authoritative asset that drives followers and inbound client leads.

## The 4 Prompting Archetypes
1. **Zero-Shot**: Asking for an output without providing any prior examples.
2. **Few-Shot**: Giving the model 2-3 examples of ideal inputs and outputs before asking for the new one.
3. **Chain-of-Thought (CoT)**: Forcing the model to show its step-by-step reasoning before stating the final answer.
4. **System Prompts**: High-level behavioral rules set at the root of the conversation.`,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'What is the key difference between Zero-Shot and Few-Shot prompting?',
            explanation: 'Few-shot prompting provides 2 or more sample input/output pairs to teach the model the exact style, pattern, and format expected.',
            answers: [
              { text: 'Few-shot provides examples of ideal outputs to guide the model', is_correct: 1, order_index: 1 },
              { text: 'Zero-shot costs more money per token', is_correct: 0, order_index: 2 },
              { text: 'Few-shot is only used for image generation models', is_correct: 0, order_index: 3 },
              { text: 'There is no difference', is_correct: 0, order_index: 4 },
            ],
          },
        ],
      },
      {
        slug: 'basic-prompt-structure',
        title: 'The RCTF Framework',
        duration_min: 8,
        xp_reward: 20,
        content: `# The RCTF Prompt Architecture

Every high-performing commercial prompt contains four core structural pillars:

\`\`\`
R — ROLE      (Who the AI is pretending to be)
C — CONTEXT   (The background situation, target audience, and problem)
T — TASK      (The specific, actionable deliverable required)
F — FORMAT    (The visual structure, length, tone, and constraints)
\`\`\`

## 1. Role (The Persona)
Tell the AI what mental model, experience level, and domain expertise to adopt:
- *"You are a veteran Direct-Response Copywriter who has generated $50M+ in e-commerce sales."*
- *"You are a senior full-stack cybersecurity auditor."*

## 2. Context (The Situation)
Give the background parameters so the AI understands why this task matters:
- *"I am launching a B2B SaaS product that automates dental clinic appointments. My primary customers are independent dentists aged 45-60 who are wary of complex software."*

## 3. Task (The Action)
Be unequivocal about what to build:
- *"Write a 3-part cold email outreach sequence designed to book a 15-minute product demo."*

## 4. Format (The Constraints)
Set rigid boundaries on what the output looks like:
- Max 120 words per email
- Subject lines under 6 words
- No buzzwords ('synergy', 'game-changing', 'revolutionize')
- Include [First_Name] and [Clinic_Name] merge tags
- Format as clean Markdown with clear section headers`,
        questions: [
          {
            type: 'order',
            prompt: 'Arrange the RCTF framework in the correct sequence:',
            explanation: 'Role -> Context -> Task -> Format establishes persona first, background second, assignment third, and constraints fourth.',
            answers: [
              { text: 'Role (Persona)', is_correct: 1, order_index: 1 },
              { text: 'Context (Background & Audience)', is_correct: 1, order_index: 2 },
              { text: 'Task (Explicit Action)', is_correct: 1, order_index: 3 },
              { text: 'Format (Constraints & Layout)', is_correct: 1, order_index: 4 },
            ],
          },
          {
            type: 'prompt-challenge',
            prompt: 'Use the complete RCTF framework to write a prompt for a high-converting landing page headline and subheadline for an AI scheduling tool.',
            explanation: 'Example: "Role: Elite SaaS copywriter. Context: Early-stage scheduling app for freelance designers losing 5 hours/week on client back-and-forth emails. Task: Write 3 headline and subheadline pairs that focus on reclaimable income. Format: Bullet list with Headline (bold, under 10 words) followed by Subheadline (under 25 words). Tone: punchy, urgent."',
          },
        ],
      },
      {
        slug: 'roles-and-context',
        title: 'Roles & Context Mastery',
        duration_min: 7,
        xp_reward: 15,
        content: `# Deep Dive: Role & Context Engineering

Assigning a role is not just cosmetic — it shifts the probability distribution inside the LLM toward professional, domain-specific vocabulary and reasoning.

## How Role Definition Changes Model Weights
Compare these two prompts:
- *Prompt A*: "Review this sales page."
- *Prompt B*: "Act as a ruthless conversion rate optimization (CRO) specialist with 12 years auditing $100M+ e-commerce funnels. Analyze this page for friction points, cognitive overload, and trust deficits."

Prompt B will immediately employ heuristics like the F-pattern reading model, above-the-fold eye-tracking, and social proof density.

## Context Stacking Techniques
When briefing AI for client work, structure your context in layers:
1. **Industry & Market Position**: "We are the premium, high-ticket option in a crowded market."
2. **Customer Psychology**: "The buyer is afraid of making a public mistake that costs them their job."
3. **Current Constraints**: "We cannot offer price discounts or custom software integrations."`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a prompt that assigns a specialized role (e.g. Chief Product Officer or Senior Legal Counsel) with rich context to evaluate a new business service.',
            explanation: 'Example: "You are the Chief Product Officer at an enterprise B2B software company. Context: Our startup is adding a $99/mo AI analytics add-on for existing clients. Analyze this feature list from a user retention perspective. Highlight the single biggest risk of churn, and propose one high-impact improvement."',
          },
        ],
      },
      {
        slug: 'constraints-instructions',
        title: 'Constraints & Instructions',
        duration_min: 6,
        xp_reward: 15,
        content: `# Negative Constraints & Rigid Rules

The difference between amateur and professional AI prompting is **constraint enforcement**.

## Positive vs. Negative Constraints
- **Positive constraint**: "Write in a professional tone with bullet points."
- **Negative constraint**: "Do NOT use passive voice. Never include exclamation marks. Avoid clichés like 'in today's fast-paced world'."

Negative constraints prevent the AI from defaulting to its most common training cliches.

## The Anti-AI Cliché Blacklist
Always instruct your writing prompts to exclude these robotic markers:
- "Delve into"
- "Tapestry", "Beacon", "Testament"
- "In conclusion", "Furthermore", "Moreover"
- "It is important to remember that..."
- Overly dramatic rhetorical questions

## Enforcing Structural Consistency
When connecting AI to automated workflows (like Zapier or Make), you must enforce strict structured output:
> *"Respond ONLY with a valid JSON object matching the schema below. Do not include markdown code blocks, backticks, introductory commentary, or trailing notes."*`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a prompt with at least 3 negative constraints (what NOT to do) to draft a professional response to an angry client email.',
            explanation: 'Example: "Role: Customer Success Director. Task: Draft a calm, reassuring response to a client whose delivery was delayed by 2 days. Constraints: 1) Do NOT make excuses or blame third parties. 2) Do NOT use passive voice or apologies longer than one sentence. 3) Keep under 100 words. Offer a concrete $50 credit."',
          },
        ],
      },
      {
        slug: 'using-examples-in-prompts',
        title: 'Few-Shot Prompting with Examples',
        duration_min: 8,
        xp_reward: 20,
        content: `# Few-Shot Prompting: The Ultimate Accuracy Hack

If you want an AI to match an exact writing style, voice, or format, **do not describe the style — show examples**.

## The Formula for Few-Shot Prompts
\`\`\`markdown
You are a social media copywriter. Generate high-engagement LinkedIn posts based on the topic provided.

Study the following examples of top-performing posts:

--- EXAMPLE 1 ---
Topic: Remote Work
Post:
Most managers think remote work kills productivity.
They're looking at the wrong metric.
Here's what our team learned after 3 years fully distributed:
[Body...]

--- EXAMPLE 2 ---
Topic: Pricing
Post:
If you never lose a deal on price, your rates are too low.
Here is the math behind doubling our retainer:
[Body...]

--- NEW TASK ---
Topic: Hiring AI Specialists
Write the post following the exact cadence, line breaks, and hook structure of the examples above.
\`\`\`

## Why Few-Shot Works
By anchoring the context window with positive samples, the model calculates probabilities directly against the vocabulary, syntax, and sentence rhythm of your examples.`,
        questions: [
          {
            type: 'true-false',
            prompt: 'Few-shot prompting relies on showing the AI concrete examples of desired input/output pairs rather than just abstract descriptions.',
            explanation: 'Correct! Few-shot prompting anchors the LLM on real examples, dramatically improving consistency.',
            answers: [
              { text: 'TRUE', is_correct: 1, order_index: 1 },
              { text: 'FALSE', is_correct: 0, order_index: 2 },
            ],
          },
        ],
      },
      {
        slug: 'iterating-improving-prompts',
        title: 'Iterating & Improving Prompts',
        duration_min: 7,
        xp_reward: 15,
        content: `# Prompt Refinement & Debugging

Top prompt engineers rarely get the ideal output on prompt version 1.0. They treat prompts like software code that undergoes testing, debugging, and version control.

## The 4-Step Prompt Debugging Cycle

### Step 1: Diagnose the Failure Mode
- Did the AI write too much fluff? -> Add length & density constraints.
- Did it misunderstand the audience? -> Deepen the Context section.
- Did it fail to follow the format? -> Provide a rigid JSON or Markdown template.

### Step 2: Add Chain-of-Thought
Before outputting the final result, force the model to think:
> *"First, analyze the input text and list the 3 main themes. Then, write out your reasoning. Finally, output the finished deliverable."*

### Step 3: Self-Correction Loop
Ask the model to critique its own work before presenting it:
> *"After drafting the article, review it against this 5-point quality checklist. Score each point 1-10. If any score is below 9, rewrite the section."*`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a self-critique prompt where the AI must first write a sales pitch, then review it against conversion criteria, and rewrite any weak parts.',
            explanation: 'Example: "Task: Write a 100-word pitch for an AI copywriting service. Next: Critique the pitch on: 1) Hook strength, 2) Specificity of outcome, 3) Clear call to action. Finally: Output the revised version that fixes any weaknesses discovered during the critique."',
          },
        ],
      },
      {
        slug: 'prompt-templates',
        title: 'Battle-Tested Prompt Templates',
        duration_min: 9,
        xp_reward: 25,
        content: `# Commercial Prompt Templates

Use these production-tested templates for client work and personal productivity.

## Template 1: The High-Converting B2B Cold Email
\`\`\`text
Role: Top 1% B2B Sales Development Representative.
Context: Reaching out to [Target_Title] at [Company_Type]. We offer [Unique_Solution] that solves [Specific_Pain_Point].
Task: Write a 75-word cold outreach email.
Constraints:
- 1-sentence observation about their company
- 1-sentence value proposition with a verified metric
- Low-friction call to action ("Worth exploring?" or "Open to taking a look?")
- No formal greetings like "I hope this email finds you well"
\`\`\`

## Template 2: Executive Document Summarizer
\`\`\`text
Role: Chief of Staff to a Fortune 500 CEO.
Task: Summarize the attached transcript/document for an executive with 3 minutes to read.
Format:
1. One-Sentence Bottom Line Up Front (BLUF)
2. Top 3 Strategic Takeaways (bulleted)
3. Immediate Action Items & Deadlines
4. Risks & Dependencies
\`\`\`

## Template 3: SEO Content Outline Generator
\`\`\`text
Role: Head of Search Engine Optimization.
Task: Create an exhaustive H2 and H3 content outline for the target keyword "[Keyword]".
Constraints: Analyze search intent (informational vs transactional), incorporate relevant semantic LSI keywords, and format with estimated word count per section.
\`\`\``,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Customize one of the battle-tested templates above for a real business scenario (e.g. selling an AI social media management package to real estate agents).',
            explanation: 'Example: "Role: Senior Growth Marketer for Luxury Real Estate. Context: Pitching high-end realtors in Miami who waste 10 hours/week filming and editing property walkthrough reels. Task: Write a 90-word outreach email introducing our done-for-you AI video staging and clipping service. Include: 1 specific statistic, low-friction CTA."',
          },
        ],
      },
    ],
  },

  // ==========================================
  // COURSE 3: AI FREELANCING
  // ==========================================
  {
    slug: 'ai-freelancing',
    title: 'AI FREELANCING',
    description: 'Turn your AI skills into income. Find clients, price your services, and build a sustainable freelance business.',
    difficulty: 'INTERMEDIATE',
    order_index: 3,
    icon: '◎',
    project: {
      title: 'Complete Freelance Pitch & Service Blueprint',
      description: 'Create a comprehensive freelance package: select your high-demand AI service, establish a tiered pricing model ($500 / $1,500 / $3,500), construct 2 portfolio work samples, and write a personalized Upwork proposal template.',
      xp_reward: 100,
    },
    lessons: [
      {
        slug: 'what-is-ai-freelancing',
        title: 'What is AI Freelancing?',
        duration_min: 7,
        xp_reward: 15,
        content: `# The AI Freelancing Revolution

Freelancing in 2024 and beyond is not about selling your manual labor by the hour. It is about selling **outcomes powered by AI leverage**.

## The Old Math vs. The New Math

| Metric | Traditional Freelancer | AI-Powered Freelancer |
| :--- | :--- | :--- |
| Deliverable | 2,000-word SEO Article | 2,000-word SEO Article + Visuals + Meta |
| Production Time | 6 - 8 hours | 45 - 60 minutes |
| Client Price | $200 | $200 |
| Effective Hourly Rate | **$25 - $33 / hr** | **$200 - $266 / hr** |
| Monthly Capacity | 15 - 20 deliverables | 80 - 100 deliverables |

## The Golden Rule of AI Freelancing
> **Clients do not care if you use AI. They care about quality, accuracy, speed, and business results.**

Never market yourself as "I press buttons on ChatGPT". Market yourself as an **AI Operations Specialist** or **Digital Growth Strategist** who delivers finished, revenue-generating assets faster than traditional agencies at half their overhead.`,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'What is the primary commercial advantage of an AI-powered freelancer over a traditional freelancer?',
            explanation: 'AI enables significantly faster production of high-quality deliverables, multiplying effective hourly earnings.',
            answers: [
              { text: 'They can charge less money and work for free', is_correct: 0, order_index: 1 },
              { text: 'They achieve 5x-10x higher output velocity, vastly multiplying effective hourly revenue', is_correct: 1, order_index: 2 },
              { text: 'They never have to talk to clients', is_correct: 0, order_index: 3 },
              { text: 'They do not need a computer', is_correct: 0, order_index: 4 },
            ],
          },
        ],
      },
      {
        slug: 'finding-your-service',
        title: 'Finding Your High-ROI Service',
        duration_min: 8,
        xp_reward: 20,
        content: `# Choosing Your High-ROI AI Service

Do not offer "everything for everyone". Pick one specialized, high-margin service where AI gives you an unfair speed advantage.

## Top 6 High-Demand AI Freelance Services

### 1. AI Copywriting & Direct Response
- Deliverables: Email newsletter funnels, landing page copy, ad variants.
- Typical Retainer: $1,500 – $4,000 / month per client.
- Key Tools: Claude 3.5 Sonnet, ChatGPT-4o, Jasper.

### 2. Custom AI Prompt Libraries for Companies
- Deliverables: Auditing a company's internal workflows and building 20-50 custom, locked prompt templates for their sales and customer service teams.
- Typical Project Fee: $2,500 – $6,000 one-time.

### 3. AI Social Media Management & Carousels
- Deliverables: 20 monthly LinkedIn/Twitter posts, graphic carousels, short-form video hooks.
- Typical Retainer: $1,000 – $2,500 / month.

### 4. AI Automated Workflow Setup (No-Code)
- Deliverables: Connecting CRM forms to Slack alerts, AI lead categorization, and automated email follow-ups via Make.com.
- Typical Project Fee: $1,500 – $5,000.

### 5. AI Video Generation & Repurposing
- Deliverables: Clipping long YouTube videos/podcasts into viral TikToks/Reels with automated captions and B-roll.
- Typical Retainer: $1,200 – $3,000 / month.

### 6. AI Translation & Localization
- Deliverables: Translating software documentation, websites, and marketing materials with human post-editing polish.
- Typical Project Fee: $0.06 – $0.15 per word.`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a 1-sentence value proposition for an AI copywriting service targeted at B2B software founders, highlighting speed and pipeline growth.',
            explanation: 'Example: "I help B2B SaaS founders turn their technical documentation into high-converting sales funnels in 48 hours using proprietary AI workflows, generating 3x more qualified demo bookings without agency fees."',
          },
        ],
      },
      {
        slug: 'choosing-a-niche',
        title: 'Choosing a Profitable Niche',
        duration_min: 6,
        xp_reward: 15,
        content: `# The Power of Niche Specialization

"I am a general AI copywriter" gets ignored.
"I write AI-accelerated email sequences for venture-backed FinTech startups" commands $150/hour.

## The Niche Selection Matrix
Evaluate prospective niches across three criteria:
1. **Ability to Pay**: Do businesses in this industry have healthy cash flow and marketing budgets? (e.g. MedTech, B2B SaaS, Real Estate, Law firms vs. hobby bloggers).
2. **Repetitive Pain**: Do they produce high volumes of communication, customer support, or content?
3. **Low Technological Adoption**: Are their competitors still doing everything manually?

## The 'Micro-Niche' Formula
\`\`\`
[Specific AI Service] + [Specific Industry Vertical] + [Guaranteed Business Outcome]
\`\`\`
- *Example*: "AI lead-qualification workflows for residential solar companies to reduce response time from 4 hours to 30 seconds."`,
        questions: [
          {
            type: 'true-false',
            prompt: 'Targeting a specific niche allows you to charge higher rates because you solve a specialized business problem rather than competing as a generic commodity.',
            explanation: 'True. Niche specialization creates perceived expertise and eliminates direct price comparison with generic freelancers.',
            answers: [
              { text: 'TRUE', is_correct: 1, order_index: 1 },
              { text: 'FALSE', is_correct: 0, order_index: 2 },
            ],
          },
        ],
      },
      {
        slug: 'creating-a-portfolio',
        title: 'Building a Portfolio Without Clients',
        duration_min: 7,
        xp_reward: 15,
        content: `# Building a World-Class Portfolio from Scratch

Clients do not ask who paid you for the work; they ask: **"Can you do this for me?"**

## The Speculative Project Method (Spec Work)
You don't need existing clients to demonstrate elite capability. Pick 3 real companies you admire and create proactive redesigns or assets:

1. **The Teardown & Reconstruction**:
   - Take an existing slow, clunky email sequence from a recognizable brand.
   - Use AI to rewrite it with sharp hooks, clear CTAs, and concise value points.
   - Present a side-by-side "Before vs. After" case study explaining the conversion psychology.

2. **The 3-Asset Portfolio Minimum**:
   - **Asset 1**: Long-form authoritative content or strategy blueprint.
   - **Asset 2**: Short-form high-engagement social / email campaign.
   - **Asset 3**: Technical workflow diagram showing automated AI lead routing.

Host your portfolio on a clean, minimalist Notion page, Carrd site, or PDF presentation. Keep it frictionless: zero login required.`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a compelling 2-paragraph "Before and After" case study summary for your portfolio showing how you improved a client brand\'s email campaign using AI.',
            explanation: 'Example: "Case Study: Brand X Email Revamp. Problem: The client\'s weekly newsletter had a 12% open rate and 0.8% click-through rate due to walls of text and generic subject lines. Solution: We deployed an AI prompt system to analyze subscriber click heatmaps, generating punchy 150-word stories with curiosity-driven hooks. Result: Open rates climbed to 34% within 4 issues."',
          },
        ],
      },
      {
        slug: 'finding-clients',
        title: 'Client Acquisition Channels',
        duration_min: 8,
        xp_reward: 20,
        content: `# How to Land High-Paying Clients

There are 3 proven channels for generating client flow as an AI specialist:

## Channel 1: Upwork & Freelance Marketplaces (Fastest Start)
- Search for clients who already have budget allocated: filter by **"Payment Verified"** and **"$1,000+ spent"**.
- Search for keywords: "Prompt Engineer", "AI Content", "Zapier Automation", "Claude Specialist".
- Submit proposals within 30 minutes of job posting to maximize visibility.

## Channel 2: LinkedIn Direct Outreach (Highest Ticket)
- Target: Founders, Chief Marketing Officers, Heads of Growth at 10-100 employee firms.
- Send a personalized video or custom 2-minute Loom audit showing their exact bottlenecks.
- Never pitch on message 1. Pitch a **free, high-value insight**:
  > *"I analyzed your blog's top 3 ranking articles and noticed your competitor is outranking you on 4 key commercial terms. I used AI to outline the missing content gaps. Would you like me to send the PDF over? No pitch, just wanted to share."*

## Channel 3: Cold Email with Value Drops
- Scrape 50 niche-specific prospects using Apollo.io or LinkedIn Sales Navigator.
- Send ultra-personalized, short emails with zero attachments.`,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'What is the most effective approach when reaching out to high-ticket prospects on LinkedIn?',
            explanation: 'Providing upfront, personalized value without immediate pitching builds trust and drastically increases response rates.',
            answers: [
              { text: 'Copy-pasting a 500-word sales pitch to 1,000 people', is_correct: 0, order_index: 1 },
              { text: 'Offering a specific, personalized value asset or audit with no immediate pitch', is_correct: 1, order_index: 2 },
              { text: 'Demanding a 1-hour call immediately', is_correct: 0, order_index: 3 },
              { text: 'Asking them for a job referral', is_correct: 0, order_index: 4 },
            ],
          },
        ],
      },
      {
        slug: 'writing-proposals',
        title: 'Writing Winning Proposals',
        duration_min: 7,
        xp_reward: 15,
        content: `# The 80% Win-Rate Proposal Formula

Most freelancers lose client gigs in the first 2 sentences by writing:
> *"Hi, my name is Alex and I have 5 years experience in..."*
Clients do not care about your biography. They care about their problem.

## The 4-Part Winning Structure

### 1. The Immediate Proof Hook (First 2 Lines)
Acknowledge their exact pain point in their own words:
> *"I noticed you're looking to automate customer inquiry sorting from Typeform to HubSpot so your sales reps stop losing qualified leads during weekends."*

### 2. The Solution Blueprint (What You Will Do)
Outline 3 concrete steps:
> *"1. Set up a Webhook in Make.com connecting your form to OpenAI API.*
> *2. Deploy a custom classification prompt that scores lead intent from 1-10 within 3 seconds.*
> *3. Route Tier-1 leads directly to your SDR Slack channel with a pre-drafted personalized response."*

### 3. Proof Asset
> *"I built an identical workflow for a B2B consultancy last month that reduced response time by 82%. Here is a 60-second video demo: [Link]."*

### 4. Low-Friction Call to Action
> *"Are you free for a 10-minute sync this Wednesday at 2pm EST to review the logic?"*`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write an opening 3-sentence proposal hook for an Upwork job post looking for someone to create 10 AI-generated blog posts with SEO optimization.',
            explanation: 'Example: "I read your post regarding scaling your blog to 10 technical SEO articles per month without sounding like generic AI spam. The biggest issue with automated content is lack of original data and repetitive sentence cadence — which we solve by feeding custom research briefs and human editing checklists into Claude 3.5 Sonnet. Here are two live articles we published that currently rank in Google top 3: [Links]."',
          },
        ],
      },
      {
        slug: 'pricing-your-service',
        title: 'Pricing & Retainer Models',
        duration_min: 8,
        xp_reward: 20,
        content: `# Packaging & Pricing for Maximum Profit

Stop charging by the hour. When you use AI, working faster *penalizes* you under hourly billing.
Always use **Value-Based Project Pricing** or **Monthly Recurring Retainers**.

## The 3 Pricing Tiers

### 1. One-Time Setup Sprint: $1,500 – $3,500
- Fixed deliverable completed in 5-7 business days.
- Example: Complete AI Content Engine setup + 10 custom prompt templates + team training workshop.

### 2. Monthly Growth Retainer: $1,500 – $4,500 / month
- Predictable recurring revenue for ongoing execution.
- Example: 12 optimized articles + 30 social distribution snippets per month.
- 4 retainer clients at $2,500/mo = **$10,000 / month ($120,000 / year)**.

### 3. Performance / Rev-Share Add-On
- Base retainer + $50 per qualified lead generated or 10% of revenue attributed to your automated campaigns.

## Overcoming Price Objections
When a prospect says: *"That seems expensive for something AI does,"* your response is:
> *"You aren't paying for the seconds AI takes to generate text. You're paying for the months we spent engineering prompt accuracy, the quality assurance that protects your brand reputation, and the 20 hours of executive time your team saves every single week."*`,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'Why is hourly billing harmful to an AI-powered freelancer?',
            explanation: 'Because AI makes you produce work much faster, an hourly rate punishes your speed instead of rewarding your value.',
            answers: [
              { text: 'Clients refuse to pay by the hour', is_correct: 0, order_index: 1 },
              { text: 'As AI increases your speed, working faster decreases your total earnings under hourly billing', is_correct: 1, order_index: 2 },
              { text: 'Taxes are higher on hourly earnings', is_correct: 0, order_index: 3 },
              { text: 'Hourly billing requires a physical office', is_correct: 0, order_index: 4 },
            ],
          },
        ],
      },
      {
        slug: 'working-with-clients',
        title: 'Client Management & Delivery',
        duration_min: 6,
        xp_reward: 15,
        content: `# Retaining Clients for 6+ Months

Acquiring a new client costs 5x more energy than retaining an existing one. Client retention is the secret to stress-free freelancing.

## The 3 Rules of Long-Term Retention

### 1. Over-Communicate on Progress
Never let a client wonder what you're working on.
Send an asynchronous Monday morning kickoff note:
> *"Here are the 3 deliverables scheduled for delivery by Thursday 4pm."*
Send a Friday wrap-up summary with metrics.

### 2. Build Feedback Checkpoints
Never dump 20 articles on a client at once. Deliver **Sample 1**, get written sign-off on tone and structure, and only then produce the remaining 19.

### 3. Proactively Suggest Future AI Upgrades
During month 2, audit their other bottlenecks:
> *"We've dialed in your blog content. I noticed your team still manually replies to Instagram DMs. Would you like me to build an automated AI qualification bot for that next month?"*`,
        questions: [
          {
            type: 'true-false',
            prompt: 'Delivering sample work early for client sign-off prevents massive revisions and guarantees client alignment.',
            explanation: 'True. Milestone-based feedback loops eliminate surprises and build professional rapport.',
            answers: [
              { text: 'TRUE', is_correct: 1, order_index: 1 },
              { text: 'FALSE', is_correct: 0, order_index: 2 },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // COURSE 4: AI CONTENT CREATION
  // ==========================================
  {
    slug: 'ai-content',
    title: 'AI CONTENT CREATION',
    description: 'Create professional-quality text, images, and video content at scale using the latest AI tools.',
    difficulty: 'BEGINNER',
    order_index: 4,
    icon: '◐',
    project: {
      title: 'Multimodal AI Brand Campaign',
      description: 'Execute a complete multimedia branding campaign for a modern business: 1 long-form thought leadership article, 4 photorealistic Midjourney visual assets with exact generation seeds and aspect ratios, and a 60-second video script with voiceover prompt directions.',
      xp_reward: 100,
    },
    lessons: [
      {
        slug: 'ai-copywriting',
        title: 'AI Copywriting & Direct Response',
        duration_min: 7,
        xp_reward: 15,
        content: `# AI Copywriting: Beyond Generic Text

AI copywriting is not about asking ChatGPT to "write a blog post". It is about deploying established direct-response frameworks like **AIDA** (Attention, Interest, Desire, Action) and **PAS** (Problem, Agitate, Solve).

## The PAS Framework with AI
\`\`\`markdown
Prompt:
Act as an elite copywriter. Use the Problem-Agitate-Solve (PAS) framework to write an email promoting an automated bookkeeping tool for freelance designers.

P (Problem): Designers spending their Sunday evenings tracking down lost receipts and reconciling invoices.
A (Agitate): The dread of tax season, missed expense write-offs costing $3,000/year, and feeling like an amateur instead of a creative director.
S (Solve): Our AI tool reconciles expenses via WhatsApp in 5 seconds with a photo.
\`\`\`

## Human-in-the-Loop Editing Checklist
1. **Cut the preamble**: Delete the first 2 paragraphs AI writes — it almost always warms up with fluff.
2. **Inject personal anecdotes**: Add specific real details ("Last Tuesday at 2 AM...").
3. **Vary sentence rhythm**: Short sentences punch. Longer, flowing sentences explain complex context. Mix them.`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a prompt using the PAS (Problem-Agitate-Solve) formula for an AI marketing campaign targeting busy restaurant owners.',
            explanation: 'Example: "Role: Direct-response copywriter. Task: Write a 120-word email for restaurant owners using the PAS framework. Problem: Unfilled tables on Tuesday and Wednesday nights. Agitate: Fixed rent and staff overhead bleeding cash while empty tables sit idle. Solution: Automated SMS loyalty flash-offers powered by AI. Tone: empathetic, practical, zero corporate speak."',
          },
        ],
      },
      {
        slug: 'social-media-content',
        title: 'Viral Social Media Content Engines',
        duration_min: 8,
        xp_reward: 20,
        content: `# Engineering Viral Social Content with AI

On platforms like LinkedIn, X (Twitter), and Threads, 80% of engagement is determined by the **Hook** (the first 1-2 lines).

## The Anatomy of a Million-Impression Hook
AI can brainstorm 30 hook variations in 10 seconds based on proven psychological triggers:

1. **Counter-Intuitive Truth**: *"Most people think X causes Y. They have it completely backwards."*
2. **The Asymmetric Result**: *"How a 2-person agency generated $400k using only 3 free AI tools (full breakdown):"*
3. **The Confession**: *"I wasted 6 months doing [Task] manually. Here is the 10-minute workflow that replaced it:"*

## The Multi-Platform Repurposing Pipeline
Take one high-performing YouTube video transcript or podcast episode:
- Convert into: 1 in-depth LinkedIn newsletter
- Convert into: 3 punchy Twitter/X threads
- Convert into: 5 carousel slide scripts
- Convert into: 7 short-form video hooks`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a prompt that generates 5 high-converting hook variations for a LinkedIn post about quitting a 9-to-5 job to pursue AI freelancing.',
            explanation: 'Example: "Role: Viral LinkedIn Ghostwriter. Task: Generate 5 distinct hook options for a post about transitioning from corporate employment to full-time AI consulting. Utilize these 5 archetypes: 1) Counter-intuitive, 2) Hard numbers/metrics, 3) Relatable vulnerability, 4) The mistake, 5) The contrast. Each hook must be 2 lines or fewer."',
          },
        ],
      },
      {
        slug: 'ai-image-creation',
        title: 'AI Image Mastery: Midjourney v6 & DALL-E',
        duration_min: 9,
        xp_reward: 25,
        content: `# Photorealistic Image Generation

Generative image synthesis has evolved from cartoonish artifacts to photorealistic, commercial-grade visual assets.

## The Midjourney v6 Prompt Formula
\`\`\`
[Subject & Action] + [Environment & Setting] + [Lighting & Atmosphere] + [Camera Lens & Film Stock] + [Aspect Ratio & Parameters]
\`\`\`

### Example Professional Prompt:
> *"Editorial portrait of a female creative director in an architectural concrete studio, bathed in golden hour natural window light, subtle dust particles in air, shot on 85mm f/1.4 lens, 35mm Kodak Portra film texture, minimalist luxury aesthetic --ar 16:9 --v 6.0 --style raw"*

## Essential Midjourney Parameters
- \`--ar [w:h]\`: Sets aspect ratio (\`16:9\` for banners/desktop, \`9:16\` for mobile/Reels, \`1:1\` for square).
- \`--v 6.0\`: Uses the latest v6 model architecture.
- \`--style raw\`: Reduces Midjourney's default stylized look, creating authentic, photorealistic textures.
- \`--no [element]\`: Negative prompting (e.g. \`--no text, watermarks, blur, oversaturated\`).`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a Midjourney v6 prompt for a luxury architectural villa at twilight, specifying camera lens, lighting, aspect ratio, and v6 parameters.',
            explanation: 'Example: "Modern minimalist glass and volcanic rock villa on a cliffside overlooking the Pacific ocean, twilight dusk sky with subtle violet hues, warm interior recessed lighting glowing, architectural photography, shot on Hasselblad H6D-100c, 24mm wide angle lens, crisp reflections in infinity pool --ar 16:9 --v 6.0 --style raw"',
          },
          {
            type: 'multiple-choice',
            prompt: 'What does the parameter "--style raw" accomplish in Midjourney v6?',
            explanation: '--style raw reduces Midjourney default cinematic embellishments, giving the user more photographic accuracy and responsiveness to exact prompt words.',
            answers: [
              { text: 'It creates uncooked food pictures', is_correct: 0, order_index: 1 },
              { text: 'It produces more photorealistic, unembellished images that adhere strictly to user prompt nuances', is_correct: 1, order_index: 2 },
              { text: 'It turns the image into black and white', is_correct: 0, order_index: 3 },
              { text: 'It speeds up rendering by skipping colors', is_correct: 0, order_index: 4 },
            ],
          },
        ],
      },
      {
        slug: 'ai-video-creation',
        title: 'AI Video Generation Tools',
        duration_min: 8,
        xp_reward: 20,
        content: `# The State of AI Video Production

Video is the highest-converting digital media format. AI video tools have slashed production costs by 90%.

## The Leading Video Tool Ecosystem
1. **Runway Gen-3 Alpha**: Unmatched motion consistency, cinematic camera movements, text-to-video and image-to-video.
2. **Luma Dream Machine**: Hyper-realistic physical motion, camera zooms, dynamic lighting.
3. **HeyGen & Synthesia**: Photorealistic AI digital avatars that read your scripts in 120+ languages with synchronized lip movement.
4. **CapCut & OpusClip**: Automated short-form video editors that analyze long webinars and extract the top 10 viral clips with animated captions.

## The Image-to-Video Workflow
Never start with text-to-video if you need visual precision.
1. Generate the perfect starting frame in **Midjourney v6**.
2. Upload the image to **Runway Gen-3** as the initial keyframe.
3. Add motion prompts: *"Slow camera push-in, subtle wind blowing through hair, ambient lighting shift."*
4. Result: 100% control over character design and cinematography.`,
        questions: [
          {
            type: 'true-false',
            prompt: 'Starting with a high-resolution Midjourney image as a keyframe (Image-to-Video) produces more consistent video character and scene continuity than pure text-to-video.',
            explanation: 'True! Image-to-video anchors visual fidelity and styling before motion is computed.',
            answers: [
              { text: 'TRUE', is_correct: 1, order_index: 1 },
              { text: 'FALSE', is_correct: 0, order_index: 2 },
            ],
          },
        ],
      },
      {
        slug: 'ai-voice-audio',
        title: 'AI Voice Cloning & Audio (ElevenLabs)',
        duration_min: 7,
        xp_reward: 15,
        content: `# Professional AI Audio & Voice Synthesis

High-quality audio separates amateur content from professional media.

## ElevenLabs: The Industry Standard
ElevenLabs allows creators and agencies to:
- Generate emotional, human-sounding voiceovers with nuanced pacing, whispers, and emphasis.
- Clone your own voice using only 60 seconds of clean audio sample.
- Dub content into 29 languages while preserving the original speaker's exact voice timbre and inflection.

## Structuring Voiceover Prompts
When preparing scripts for text-to-speech engines:
- Use punctuation to dictate pacing: ellipses (\`...\`) create dramatic pauses; dashes (\`—\`) create conversational pivots.
- Phonetic spelling: If the AI mispronounces a brand name, spell it phonetically in brackets.`,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'Which AI platform is currently considered the gold standard for voice cloning and multilingual video dubbing?',
            explanation: 'ElevenLabs is universally recognized as the market leader in generative voice cloning and voice synthesis.',
            answers: [
              { text: 'ElevenLabs', is_correct: 1, order_index: 1 },
              { text: 'Audacity Free', is_correct: 0, order_index: 2 },
              { text: 'VLC Player', is_correct: 0, order_index: 3 },
              { text: 'Shazam', is_correct: 0, order_index: 4 },
            ],
          },
        ],
      },
      {
        slug: 'content-planning',
        title: 'AI Editorial Calendars',
        duration_min: 7,
        xp_reward: 15,
        content: `# Building an Automated 30-Day Content Matrix

Consistency is where most creators and marketing teams fail. AI solves the ideation bottleneck.

## The Content Pillar System
Divide any brand or niche into 4 core content pillars:
1. **Educational / How-To**: Tactical breakdowns that demonstrate authority.
2. **Inspirational / Mindset**: Personal stories and overcoming business hurdles.
3. **Contrarian / Opinion**: Polarizing viewpoints that spark debate in comment sections.
4. **Promotional / Case Studies**: Concrete demonstrations of client ROI.

## Prompting an Entire Month of Content
Prompt Claude or ChatGPT with your pillars, target customer demographics, and core product offering to generate a structured 30-day table including: Date, Pillar, Hook, Core Lesson, and Call-to-Action.`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a prompt instructing an AI to create a 7-day multi-pillar content calendar for a boutique coffee roaster seeking local subscription customers.',
            explanation: 'Example: "Role: Social Media Strategist. Task: Build a 7-day content schedule for a specialty coffee roaster launching a $35/mo subscription box. Cover all 4 pillars (Education, Inspiration, Contrarian, Promotional). Output as a 5-column Markdown table: Day, Pillar, Video Hook, Key Message, and Call-to-Action."',
          },
        ],
      },
      {
        slug: 'content-automation',
        title: 'Automated Content Distribution',
        duration_min: 8,
        xp_reward: 20,
        content: `# Automating the Publishing Pipeline

Writing the content is only half the battle. Distributing it across multiple platforms can be 100% automated using tools like **Make.com, Buffer, and Airtable**.

## The Zero-Touch Publishing Architecture
1. **Trigger**: You record a 10-minute Loom video or voice note on your phone.
2. **Step 1 (Whisper AI)**: Automatically transcribes the audio into text within 30 seconds.
3. **Step 2 (Claude 3.5 Sonnet)**: Extracts the core lessons and generates:
   - 1 long-form LinkedIn post
   - 3 Twitter/X tweets
   - 1 weekly email blast
4. **Step 3 (Airtable)**: Rows are populated with draft status set to "Ready for Review".
5. **Step 4 (Webhook)**: Upon clicking a single checkbox, posts are scheduled to Buffer/Hootsuite automatically.

This is the exact system agencies charge $3,000/month to maintain for busy executives.`,
        questions: [
          {
            type: 'true-false',
            prompt: 'Automating content distribution allows creators to record a single source asset (audio or video) and automatically generate and schedule cross-platform written posts.',
            explanation: 'True. Content repurposing pipelines dramatically expand reach while minimizing manual drafting hours.',
            answers: [
              { text: 'TRUE', is_correct: 1, order_index: 1 },
              { text: 'FALSE', is_correct: 0, order_index: 2 },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // COURSE 5: AI AUTOMATION
  // ==========================================
  {
    slug: 'ai-automation',
    title: 'AI AUTOMATION',
    description: 'Automate repetitive tasks and business processes using AI workflows and no-code tools.',
    difficulty: 'INTERMEDIATE',
    order_index: 5,
    icon: '◑',
    project: {
      title: 'Commercial AI Automation Workflow',
      description: 'Design and document a complete end-to-end business automation pipeline connecting a webhook trigger (e.g. Stripe sale or lead form) to an AI analysis node and an automated multichannel notification system.',
      xp_reward: 125,
    },
    lessons: [
      {
        slug: 'what-is-automation',
        title: 'What is AI Automation?',
        duration_min: 7,
        xp_reward: 15,
        content: `# What is AI Automation?

Traditional automation handles static, rule-based operations:
> *"When a row is added to Google Sheets, send an email."*
If the data format changes or requires judgment, traditional automation breaks.

**AI Automation introduces reasoning into workflows:**
> *"When a customer submits a support ticket, have an LLM analyze the sentiment, translate from Spanish to English, extract account numbers, determine if they are threatening to cancel, and summarize the issue for senior management before drafting an empathetic reply."*

## The Trillion-Dollar Opportunity
Every small and mid-sized business is drowning in administrative manual data entry:
- Invoicing and expense categorization
- Lead scoring and CRM updates
- Customer inquiry triage
- Proposal generation

Building these automated systems requires **zero traditional programming code** thanks to visual workflow builders like Make.com and Zapier.`,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'What distinguishes modern AI automation from traditional rule-based automation?',
            explanation: 'AI automation can interpret unstructured language, evaluate sentiment, and make context-aware decisions that rigid IF/THEN rules cannot.',
            answers: [
              { text: 'AI automation uses more electrical power', is_correct: 0, order_index: 1 },
              { text: 'AI automation introduces cognitive reasoning, language comprehension, and unstructured data handling into workflows', is_correct: 1, order_index: 2 },
              { text: 'AI automation only works on Mac computers', is_correct: 0, order_index: 3 },
              { text: 'There is no functional difference', is_correct: 0, order_index: 4 },
            ],
          },
        ],
      },
      {
        slug: 'ai-workflows',
        title: 'Designing Multi-Step AI Workflows',
        duration_min: 8,
        xp_reward: 20,
        content: `# The Anatomy of an AI Automation Workflow

Every enterprise-grade automation consists of 3 distinct components:

\`\`\`
[1. TRIGGER] -> [2. AI REASONING / EXTRACTION] -> [3. ACTION & NOTIFICATION]
\`\`\`

## 1. The Trigger (The Event)
Something happens in the external world:
- A new lead fills out a Typeform.
- An email arrives in a Gmail inbox with an attachment.
- A Stripe webhook confirms a $500 checkout.

## 2. The AI Transformation Block
The raw data is forwarded to an LLM endpoint (OpenAI or Claude) with a dedicated system prompt:
- Parse unstructured PDF invoice text into JSON: \`{ "vendor": "Acme", "amount": 450.00, "due_date": "2024-11-01" }\`
- Categorize lead priority: \`HIGH\`, \`MEDIUM\`, \`LOW\`.

## 3. The Action (Execution)
The structured output triggers downstream actions:
- Update CRM records in HubSpot.
- Ping the executive on Slack or Telegram with an instant alert.
- Send an automated, personalized onboarding email.`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write an AI system prompt designed to parse messy customer feedback text into a structured JSON response with fields: sentiment, urgency_score (1-10), and category.',
            explanation: 'Example: "You are an automated support ticket categorization engine. Input: Raw customer message. Task: Analyze the text and output ONLY valid JSON matching this schema: { \\"sentiment\\": \\"positive\\" | \\"neutral\\" | \\"negative\\", \\"urgency_score\\": number (1-10), \\"category\\": \\"billing\\" | \\"technical\\" | \\"feature_request\\", \\"summary\\": string }. Do not include markdown code blocks or commentary."',
          },
        ],
      },
      {
        slug: 'no-code-automation',
        title: 'Make.com & Zapier Mastery',
        duration_min: 9,
        xp_reward: 25,
        content: `# Deep Dive: Make.com vs. Zapier

When building client automations, choosing the right platform determines your software cost and execution power.

## Platform Comparison

### Make.com (Formerly Integromat) — *The Professional's Choice*
- **Pricing**: Up to 10x cheaper per operation than Zapier ($9/mo for 10,000 operations vs $20/mo for 750 on Zapier).
- **Features**: Visual branch logic, native JSON parsing, built-in error handling, webhook routers.
- **Best For**: Complex multi-step enterprise workflows and commercial client builds.

### Zapier — *The Beginner's Tool*
- **Strengths**: Easiest interface, integrates with 6,000+ apps, zero learning curve.
- **Drawbacks**: Expensive at high volume, rigid linear execution models.

## Best Practice: Using Native OpenAI Modules
Both platforms have native OpenAI/Anthropic modules. Always use **Structured Outputs (JSON Schema)** in your prompt settings so downstream nodes never crash from unexpected formatting.`,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'Why do professional AI automation consultants often prefer Make.com over Zapier for client systems?',
            explanation: 'Make.com offers visual router branching, superior pricing per execution, and robust native data manipulation capabilities.',
            answers: [
              { text: 'Zapier was shut down in 2023', is_correct: 0, order_index: 1 },
              { text: 'Make.com offers visual multi-branch routing, better pricing at volume, and sophisticated error handling', is_correct: 1, order_index: 2 },
              { text: 'Make.com only runs in offline mode', is_correct: 0, order_index: 3 },
              { text: 'Zapier does not support AI tools', is_correct: 0, order_index: 4 },
            ],
          },
        ],
      },
      {
        slug: 'ai-assistants-for-business',
        title: 'Custom AI Knowledge Bots',
        duration_min: 8,
        xp_reward: 20,
        content: `# Building Custom AI Chatbots for Businesses

Companies are desperate for internal and customer-facing AI bots that answer questions **only using their private company documents**.

## RAG: Retrieval-Augmented Generation Explained
How do you teach an AI about a private company's internal return policy or HR handbook?
1. **Document Ingestion**: Upload the company's PDFs, employee handbooks, and FAQs.
2. **Chunking & Vector Embeddings**: The text is broken into small passages and converted into mathematical vector representations.
3. **Semantic Search (Retrieval)**: When a user asks: *"What is our refund window for opened software?"*, the vector database finds the top 3 relevant paragraphs from the handbook.
4. **Augmented Generation**: The LLM answers using *only* those retrieved paragraphs.

## No-Code Tools to Build RAG Bots
- **Voiceflow**: The gold standard for designing visual conversational AI assistants.
- **Botpress**: Enterprise-grade bot builder with built-in integrations.
- **Chatbase / FastBots**: 5-minute setup to train a bot on a website URL and embed a widget on Shopify or WordPress.
- Agencies charge $2,500 setup + $300/month hosting per bot.`,
        questions: [
          {
            type: 'true-false',
            prompt: 'RAG (Retrieval-Augmented Generation) prevents hallucinations by feeding relevant excerpts from private documents into the prompt before generating the answer.',
            explanation: 'True! RAG grounds the language model in verified company documents rather than relying on general model memory.',
            answers: [
              { text: 'TRUE', is_correct: 1, order_index: 1 },
              { text: 'FALSE', is_correct: 0, order_index: 2 },
            ],
          },
        ],
      },
      {
        slug: 'email-automation',
        title: 'AI Email Triage & Auto-Drafting',
        duration_min: 7,
        xp_reward: 15,
        content: `# Building an AI Executive Assistant in Gmail

Executive inboxes are the single biggest time sink in modern corporate life.

## The Autonomous Email Triaging Engine
Build this workflow in Make.com for a client:
1. **Watch Inbox**: Polls new unread emails every 5 minutes.
2. **Filter**: Ignores marketing newsletters, receipts, and calendar invites.
3. **AI Evaluation Node**:
   - Classifies priority: \`URGENT\`, \`ACTION REQUIRED\`, \`FYI ONLY\`.
   - Drafts a suggested response in the executive's personal writing style based on past sent emails.
4. **Create Draft**: Creates a draft in Gmail with the tag \`[AI-Drafted]\`.
5. **Result**: The executive opens Gmail in the morning and simply reviews/clicks "Send" on 20 pre-written, context-perfect replies in 4 minutes instead of 2 hours.`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a system prompt for an email auto-drafting bot that writes concise, professional replies to client scheduling requests on behalf of a CEO.',
            explanation: 'Example: "Role: Executive Assistant to CEO Alex Vance. Task: Draft a response to an incoming email proposing a meeting. Context: Alex is available Thursdays between 2pm-5pm EST or Fridays 10am-12pm EST. Constraints: Be polite, warm, and concise (under 50 words). Include Alex\'s Calendly link: calendly.com/alex-vance. Do not commit to unverified times."',
          },
        ],
      },
      {
        slug: 'business-process-automation',
        title: 'Automating Client Onboarding',
        duration_min: 7,
        xp_reward: 15,
        content: `# Streamlining Client Onboarding & Reporting

First impressions dictate client lifetime value. When a client pays an invoice, their onboarding should happen in 60 seconds, not 3 days.

## The Automated Onboarding Pipeline
1. **Stripe Event**: \`checkout.session.completed\`.
2. **Auto-Provisioning**:
   - Creates a dedicated private Slack channel with the client's name.
   - Clones a Notion client portal dashboard template populated with their project milestones.
   - Generates a Google Drive folder structure.
3. **AI Welcome Package**:
   - Claude personalizes a custom 3-page "What to Expect" onboarding brief based on the intake form data.
   - Sends a personalized welcome email with all credentials and scheduled kickoff call links.
4. **Total human effort required**: **0 minutes**.`,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'What is the primary commercial benefit of automating client onboarding?',
            explanation: 'Automated onboarding delivers instantaneous setup, eliminating human delays and elevating perceived agency quality.',
            answers: [
              { text: 'It allows you to ignore the client forever', is_correct: 0, order_index: 1 },
              { text: 'It delivers an instantaneous, error-free premium client experience while saving 3-5 hours of manual admin setup per project', is_correct: 1, order_index: 2 },
              { text: 'It makes Stripe waive processing fees', is_correct: 0, order_index: 3 },
              { text: 'It eliminates the need for software licenses', is_correct: 0, order_index: 4 },
            ],
          },
        ],
      },
      {
        slug: 'client-automation',
        title: 'Selling Automation to Local Businesses',
        duration_min: 8,
        xp_reward: 20,
        content: `# Selling $3,000+ Automation Systems

Local service businesses (dentists, plumbers, realtors, law firms, accounting practices) lose thousands of dollars every week to missed phone calls and unresponded web leads.

## The "Speed-to-Lead" Automation Offer
A lead that submits a web inquiry is **21x more likely to convert** if contacted within 5 minutes versus 30 minutes.

### The System You Sell:
1. When a homeowner fills out an emergency plumbing form on a website at 9 PM:
2. An AI SMS bot texts them within 15 seconds: *"Hi Sarah, saw you need emergency pipe repair. Are you experiencing active flooding right now?"*
3. The AI converses naturally, collects photos of the leak, and checks the technician's calendar.
4. If confirmed, it books the appointment directly into Jobber/ServiceTitan and alerts the on-call plumber.

### The Pitch:
> *"Mr. Contractor, how many customer inquiries came in after 6 PM last month that your receptionist didn't answer until 9 AM the next day? At $1,500 average job value, missing 3 leads a month costs you $4,500. Our system captures them instantly for a one-time setup of $2,500 and $200/mo maintenance."*`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a cold email pitch to a local dental clinic owner offering an automated AI appointment rescheduling system for cancellations.',
            explanation: 'Example: "Dr. Smith, Quick question: when a patient cancels an appointment with 4 hours notice, how long does it take your front desk to fill that empty chair? We built an automated AI SMS workflow that messages your waitlist within 60 seconds of a cancellation, filling 78% of last-minute openings automatically. This typically reclaims $2,800/mo in lost chair revenue. Open to a 5-minute Loom demo?"',
          },
        ],
      },
    ],
  },

  // ==========================================
  // COURSE 6: AI DIGITAL BUSINESS
  // ==========================================
  {
    slug: 'ai-digital-business',
    title: 'AI DIGITAL BUSINESS',
    description: 'Build scalable digital products and AI-powered services. Go from idea to launch.',
    difficulty: 'ADVANCED',
    order_index: 6,
    icon: '◒',
    project: {
      title: 'AI Digital Product or Micro-SaaS Blueprint',
      description: 'Your capstone master project: Draft a complete commercial business blueprint for an AI digital product or productized service. Include target customer persona, pricing architecture, tech stack, landing page copy, and a 14-day go-to-market distribution plan.',
      xp_reward: 200,
    },
    lessons: [
      {
        slug: 'digital-products',
        title: 'High-Margin AI Digital Products',
        duration_min: 7,
        xp_reward: 15,
        content: `# Building Digital Products with 95% Profit Margins

Freelancing trades your time for money. Digital products build **infinitely scalable assets** that sell while you sleep.

## What Digital Products Actually Sell?
Nobody buys generic "prompt packs" for $5. People buy **curated, plug-and-play business systems**:
1. **Notion Operating Systems with Embedded AI Prompts**: e.g. "The Real Estate Wholesaler OS" ($97 - $197).
2. **Industry-Specific Prompt Vaults**: 150 tested, variable-driven prompts for criminal defense lawyers or financial advisors ($47 - $149).
3. **Make.com / Zapier Automation Blueprints**: Downloadable JSON workflow templates that clients import in one click ($99 - $299).
4. **AI Graphic Asset Packs**: 500 hyper-curated 4K Midjourney background textures and 3D icons for UI designers ($29 - $79).

## The Economics
Selling a $97 digital workflow pack:
- 10 sales / month = **$970**
- 50 sales / month = **$4,850**
- 200 sales / month = **$19,400**
- Cost of goods sold: **$0.00**.`,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'What makes a high-ticket AI digital product successful compared to low-effort generic prompt lists?',
            explanation: 'High-value digital products solve concrete, revenue-generating business problems with turnkey operational workflows rather than generic text.',
            answers: [
              { text: 'Having a neon green logo', is_correct: 0, order_index: 1 },
              { text: 'Targeting a specific commercial niche with turnkey, tested workflow assets that save dozens of hours', is_correct: 1, order_index: 2 },
              { text: 'Charging $1 on Etsy', is_correct: 0, order_index: 3 },
              { text: 'Listing 10,000 copy-pasted prompts without context', is_correct: 0, order_index: 4 },
            ],
          },
        ],
      },
      {
        slug: 'ai-services',
        title: 'Productized AI Services',
        duration_min: 8,
        xp_reward: 20,
        content: `# Productized Services: The Bridge to Agency Scale

A custom agency model has too many meetings, custom scopes, and unpredictable timelines.
A **Productized Service** sells a clearly defined deliverable with a fixed price, fixed timeline, and standardized AI production process.

## Example: The Productized "AI Newsletter" Engine
- **The Offer**: "We research, write, and format 4 weekly deep-dive newsletters for tech executives."
- **Price**: $2,500 / month flat fee.
- **Scope**: Exactly 4 issues, max 1,200 words each, 1 round of revisions per issue.
- **Your Production System**:
  - Friday: AI tool analyzes 50 RSS feeds and drafts bulleted outlines.
  - Monday: You review and polish with custom voice models (45 minutes per issue).
  - Client receives consistent, executive-level work every Tuesday morning.

Because the scope never changes, you can manage 8 clients simultaneously with 15 hours of weekly work = **$20,000 / month** gross revenue.`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a landing page hero headline, subheadline, and 3-item feature list for a productized AI thumbnail and title optimization service for YouTubers.',
            explanation: 'Example: "Headline: Double Your YouTube Click-Through Rates in 48 Hours with AI-Optimized Packaging. Subheadline: We analyze 10,000 viral videos in your niche to generate 5 high-converting thumbnail concepts and 10 tested titles for every upload. Features: 1) 48-Hour Turnaround, 2) Zero Monthly Retainer Required, 3) 100% Satisfaction Guarantee."',
          },
        ],
      },
      {
        slug: 'ai-templates-packs',
        title: 'Building & Selling Workflow Packs',
        duration_min: 7,
        xp_reward: 15,
        content: `# Packaging & Selling Automation Blueprints

One of the newest and most lucrative digital assets is the **Exportable Automation Blueprint**.

## How It Works
1. Build a complex, high-value workflow inside **Make.com** (e.g., automated YouTube transcription to blog post + social clips).
2. Click **Export Blueprint** inside Make.com to generate a single clean JSON file.
3. Package the JSON file with:
   - A 5-minute video tutorial walking through setup.
   - The exact OpenAI prompt templates needed for the AI nodes.
   - An Airtable template pre-configured with the required columns.
4. Sell the package on **Gumroad, Lemon Squeezy, or your own website** for $99 - $249.

Buyers can import your entire system into their own Make account in 30 seconds, saving them 20+ hours of custom development.`,
        questions: [
          {
            type: 'true-false',
            prompt: 'Make.com allows creators to export complex automation workflows as JSON blueprints that customers can import directly into their own accounts in seconds.',
            explanation: 'True! Exportable blueprints make selling turnkey automation workflows as frictionless as selling digital eBooks.',
            answers: [
              { text: 'TRUE', is_correct: 1, order_index: 1 },
              { text: 'FALSE', is_correct: 0, order_index: 2 },
            ],
          },
        ],
      },
      {
        slug: 'ai-tools-creation',
        title: 'No-Code AI App Builders',
        duration_min: 8,
        xp_reward: 20,
        content: `# Building AI Web Apps with No-Code

You no longer need a team of software engineers to build and launch functional software applications.

## The Modern No-Code AI Stack
1. **Bubble.io**: The most powerful visual full-stack web application builder. Supports custom databases, user authentication, Stripe subscriptions, and API calls.
2. **FlutterFlow**: Builds native iOS and Android mobile apps visually with direct Firebase and OpenAI API integrations.
3. **Softr / Glide**: Builds client portals and member directories on top of Airtable or Google Sheets in under 2 hours.
4. **V0.dev & Cursor**: AI-assisted code generation that builds React/Next.js web applications directly from natural language descriptions.

## The Micro-App Pattern
Pick a single, hyper-focused utility:
- e.g. "AI Real Estate Description Generator for Commercial Brokers"
- The user fills out 3 fields: Property Type, Square Footage, Key Amenities.
- The app calls the OpenAI API and outputs 3 formatted MLS listings.
- Charge $29/month per broker. 100 subscribers = **$2,900 / month recurring revenue**.`,
        questions: [
          {
            type: 'multiple-choice',
            prompt: 'Which visual builder is widely recognized as the most versatile platform for building complex full-stack web apps with databases and Stripe subscriptions?',
            explanation: 'Bubble.io is the undisputed industry standard for comprehensive full-stack no-code web applications.',
            answers: [
              { text: 'Bubble.io', is_correct: 1, order_index: 1 },
              { text: 'Google Docs', is_correct: 0, order_index: 2 },
              { text: 'Microsoft Paint', is_correct: 0, order_index: 3 },
              { text: 'Notepad', is_correct: 0, order_index: 4 },
            ],
          },
        ],
      },
      {
        slug: 'micro-saas',
        title: 'Launching an AI Micro-SaaS',
        duration_min: 9,
        xp_reward: 25,
        content: `# The Blueprint for a $5k/mo AI Micro-SaaS

A **Micro-SaaS** is a software business run by a solo founder with minimal overhead, targeting a small but passionate niche.

## The 5 Rules of AI Micro-SaaS
1. **Never build a generic wrapper**: If your app is just ChatGPT with a different font, OpenAI will release a feature that kills your business tomorrow.
2. **Own the Workflow & Distribution**: Build specialized integrations into where your users already work (e.g. a Chrome extension for Shopify sellers or a Figma plugin for UI designers).
3. **Focus on Vertical Data**: Combine public LLMs with proprietary datasets (e.g. historical zoning laws, medical billing codes, or tax court rulings).
4. **Charge Immediately**: Never offer a free tier without a credit card. If customers won't pay $19/month, the problem isn't painful enough.
5. **Keep Churn Below 5%**: Ensure the tool provides daily or weekly utility that becomes indispensable to their business.`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Develop an AI Micro-SaaS concept: define the specific target user, the painful daily bottleneck, the unique data advantage, and the monthly subscription price.',
            explanation: 'Example: "Micro-SaaS Concept: ContractAudit.ai. Target: Independent freelance video producers signing vendor agreements. Bottleneck: Paying $400 to entertainment lawyers to review copyright indemnification and IP transfer clauses. Data Advantage: Trained on 500 standard commercial production union contracts. Pricing: $29/month for unlimited contract risk audits."',
          },
        ],
      },
      {
        slug: 'finding-customers',
        title: 'Customer Acquisition & Distribution',
        duration_min: 7,
        xp_reward: 15,
        content: `# Organic Distribution for Digital Products

The best product with zero distribution is a ghost town. Build distribution *before* you write your first line of code.

## 4 Free Channels to Drive First 100 Customers

### 1. Build in Public (X & LinkedIn)
Document every step of the journey:
- *"Here is how we built our prototype in 48 hours with Bubble and Claude."*
- Share real screenshots, mistakes, metrics, and subscriber milestones. Builders attract buyers.

### 2. Product Hunt & Directory Infiltration
Launch on **Product Hunt, Toolify.ai, Futurepedia, and There's An AI For That**. These aggregators drive thousands of early adopters and high-authority SEO backlinks.

### 3. Community Value Drops
Find Subreddits (e.g. \`r/SaaS\`, \`r/Entrepreneur\`, \`r/freelance\`) and Facebook/Discord communities. Share free resources, templates, and calculators with zero sales links. When members find it valuable, they naturally click your profile.

### 4. Micro-Influencer Affiliate Partnerships
Give a free license and a 30% recurring commission to creators on YouTube or TikTok who already have your target audience.`,
        questions: [
          {
            type: 'true-false',
            prompt: 'Building in public and leveraging AI tool directories (like Futurepedia and Toolify) can generate thousands of initial visitors without paid advertising.',
            explanation: 'True! Organic launch channels and AI aggregators provide immense initial distribution for targeted products.',
            answers: [
              { text: 'TRUE', is_correct: 1, order_index: 1 },
              { text: 'FALSE', is_correct: 0, order_index: 2 },
            ],
          },
        ],
      },
      {
        slug: 'launching-a-product',
        title: 'The 7-Day Product Launch Blueprint',
        duration_min: 9,
        xp_reward: 30,
        content: `# The 7-Day Sprint: From Zero to First Dollar

Stop planning for 6 months. Launch your MVP in 7 days.

## The Daily Launch Calendar

- **Day 1: Problem Validation**
  Interview 5 target prospects on LinkedIn or Reddit. Confirm they actively pay money to solve this problem.
- **Day 2: The Core Asset Creation**
  Build the MVP deliverable (the template, prompt vault, or no-code tool). Focus only on the core feature.
- **Day 3: The Sales Page**
  Build a high-converting minimalist landing page using Carrd, Framer, or Gumroad. Include video demo, pricing, and FAQ.
- **Day 4: Setup Payments & Delivery**
  Connect Stripe or Lemon Squeezy. Test the checkout flow with a $1 test purchase.
- **Day 5: The Early-Bird Soft Launch**
  Direct message the 5 prospects from Day 1 with a 50% beta discount in exchange for written video testimonials.
- **Day 6: Public Launch Campaign**
  Publish your in-depth case study thread on X and LinkedIn with links to your launch offer.
- **Day 7: Analyze & Iterate**
  Review user feedback, fix friction points in the onboarding flow, and celebrate your first automated internet income!`,
        questions: [
          {
            type: 'prompt-challenge',
            prompt: 'Write a public launch tweet thread announcement for your new AI product using curiosity, social proof, and a launch discount.',
            explanation: 'Example: "Over the last 6 months, our team wasted 140+ hours manually rewriting client contracts. Today, we are open-sourcing the solution: [Product_Name] — the 60-second AI contract auditor for freelancers. Built with Claude 3.5 & Make. To celebrate launch week, use code LAUNCH50 for 50% off for the first 50 users: [Link] (RTs appreciated!)"',
          },
        ],
      },
    ],
  },
];
