'use server';

export interface PromptScore {
  total: number;
  clarity: number;
  context: number;
  instructions: number;
  constraints: number;
  output: number;
  whatWentWell: string[];
  improvements: string[];
  suggestion: string;
  simulatedResponse?: string;
  modelUsed?: string;
}

export async function checkPrompt(prompt: string, challengeTitle?: string): Promise<PromptScore> {
  const text = prompt.toLowerCase().trim();
  const words = text.split(/\s+/).filter(Boolean).length;

  // Scoring criteria
  let clarity = 0;
  let context = 0;
  let instructions = 0;
  let constraints = 0;
  let output = 0;

  const wellDone: string[] = [];
  const improve: string[] = [];

  // --- CLARITY ---
  if (words >= 10) { clarity += 35; wellDone.push('Your prompt has sufficient length to establish clear intent.'); }
  else { clarity += 10; improve.push('Too short — add more specific detail about what you need.'); }
  if (words >= 25) { clarity += 25; wellDone.push('Good level of detail and granularity.'); }
  if (!text.includes('something') && !text.includes('anything') && !text.includes('stuff')) { clarity += 25; }
  else { improve.push('Avoid vague words like "something" or "anything" — name the exact deliverable.'); }
  if (text.includes('?') || text.endsWith('.') || text.includes(':') || text.includes('\n')) clarity += 15;
  clarity = Math.min(clarity, 100);

  // --- CONTEXT ---
  const contextWords = ['i am', "i'm", 'my', 'we are', 'our', 'business', 'company', 'i run', 'i work', 'my audience', 'for a', 'targeting', 'background', 'client', 'customer', 'niche', 'industry'];
  const hasContext = contextWords.some(w => text.includes(w));
  if (hasContext) { context = 75; wellDone.push('You provided clear background or business context.'); }
  else { context = 20; improve.push('Add context: specify who you are, your industry, or who the recipient is.'); }

  const audienceWords = ['audience', 'customer', 'client', 'user', 'reader', 'target', 'beginner', 'expert', 'professional', 'b2b', 'b2c', 'c-level', 'founder', 'manager'];
  if (audienceWords.some(w => text.includes(w))) { context = Math.min(context + 25, 100); wellDone.push('Target audience is precisely defined.'); }

  // --- INSTRUCTIONS ---
  const actionVerbs = ['write', 'create', 'generate', 'explain', 'analyze', 'summarize', 'list', 'compare', 'translate', 'rewrite', 'improve', 'suggest', 'describe', 'design', 'outline', 'draft', 'extract'];
  const hasAction = actionVerbs.some(v => text.includes(v));
  if (hasAction) { instructions = 60; wellDone.push('Strong action verb sets clear direction.'); }
  else { instructions = 15; improve.push('Start with an explicit command: Write, Create, Analyze, Generate, etc.'); }
  if (words >= 20) instructions = Math.min(instructions + 20, 100);
  if (words >= 40) { instructions = Math.min(instructions + 20, 100); wellDone.push('Comprehensive step-by-step task instructions.'); }

  // --- CONSTRAINTS ---
  const numWords = ['words', 'sentences', 'paragraphs', 'bullet points', 'items', 'examples', 'steps', 'points', 'characters'];
  const formats = ['list', 'table', 'bullet', 'numbered', 'paragraph', 'heading', 'short', 'brief', 'detailed', 'concise', 'json', 'markdown', 'csv', 'subject line', 'cta'];
  const tones = ['professional', 'casual', 'formal', 'friendly', 'technical', 'simple', 'persuasive', 'conversational', 'tone', 'style', 'voice', 'punchy', 'urgent', 'authoritative'];
  const avoidWords = ["don't", "avoid", 'without', 'no ', 'not ', "don't use", 'exclude', 'never', 'do not'];

  if (numWords.some(w => text.includes(w))) { constraints += 30; wellDone.push('You specified length/quantity constraints.'); }
  else improve.push('Specify a concrete length constraint (e.g. "under 150 words", "exactly 3 bullet points").');
  if (formats.some(w => text.includes(w))) { constraints += 30; wellDone.push('Output format structure is explicitly defined.'); }
  if (tones.some(w => text.includes(w))) { constraints += 25; wellDone.push('Tone of voice and style are specified.'); }
  if (avoidWords.some(w => text.includes(w))) { constraints += 15; wellDone.push('Negative constraints defined (what to avoid).'); }
  constraints = Math.min(constraints, 100);

  // --- DESIRED OUTPUT & ROLE ---
  const outputWords = ['for', 'to use', 'will be used', 'purpose', 'goal', 'so that', 'in order to', 'result', 'output', 'i need', 'i want', 'email', 'post', 'article', 'copy', 'caption', 'description', 'reply', 'proposal', 'pitch'];
  if (outputWords.some(w => text.includes(w))) { output = 65; wellDone.push('Clear business goal and usage intent.'); }
  else { output = 25; improve.push('State what practical goal this output serves.'); }
  const roleWords = ['act as', 'you are', 'behave as', 'role', 'expert', 'specialist', 'senior', 'consultant', 'strategist', 'copywriter'];
  if (roleWords.some(w => text.includes(w))) { output = Math.min(output + 35, 100); wellDone.push('Persona/Role assigned to the AI model.'); }

  const total = Math.round((clarity * 0.25 + context * 0.2 + instructions * 0.25 + constraints * 0.2 + output * 0.1));

  // Smart suggestion
  let suggestion = '';
  if (total < 40) {
    suggestion = `Structure your prompt using the RCTF framework: "Role: You are a senior [role]. Context: I am [situation] targeting [audience]. Task: Write a [format] that [action]. Constraints: Keep under [X] words, tone should be [tone], avoid [clichés]."`;
  } else if (total < 70) {
    const missing = [];
    if (context < 50) missing.push('richer context & audience');
    if (constraints < 50) missing.push('exact length or formatting rules');
    if (output < 50) missing.push('a clear expert persona ("Act as...")');
    suggestion = `Good foundation! Adding ${missing.join(' and ')} will turn this into an executive-grade prompt.`;
  } else if (total < 88) {
    suggestion = `Great prompt! To reach 95%+, add 1-2 few-shot examples or specify edge-case handling (what to do if data is missing).`;
  } else {
    suggestion = `Master-level prompt engineering! Clear persona, exact constraints, strong context, and actionable guidance. You are ready to deploy this in production.`;
  }

  // Generate simulated AI model execution output
  const simulatedResponse = generateSimulatedAIOutput(prompt, total, challengeTitle);

  return {
    total: Math.min(total, 100),
    clarity: Math.round(clarity),
    context: Math.round(context),
    instructions: Math.round(instructions),
    constraints: Math.round(constraints),
    output: Math.round(output),
    whatWentWell: [...new Set(wellDone)].slice(0, 4),
    improvements: [...new Set(improve)].slice(0, 3),
    suggestion,
    simulatedResponse,
    modelUsed: total >= 70 ? 'GPT-4o / Claude 3.5 Sonnet' : 'GPT-3.5 (Generic Response)',
  };
}

function generateSimulatedAIOutput(prompt: string, total: number, challengeTitle?: string): string {
  const pLower = prompt.toLowerCase();

  // If score is weak, show realistic mediocre AI output illustrating why quality prompting matters
  if (total < 50) {
    return `[AI Model Execution: Standard LLM]
⚠️ Notice: Your prompt lacked specific constraints, context, and role definitions. Here is a generic response:

"Hello! Here is some information regarding your request. In general, it is important to communicate clearly and address the key points. You should always consider your audience and ensure your message is professional and concise. Let me know if you would like me to rewrite or expand on any specific area."

💡 Notice the difference: Because no role, format, or target audience was given, the AI generated a bland, unhelpful response. Add details to get real business results!`;
  }

  // If email / pitch / outreach
  if (pLower.includes('email') || pLower.includes('pitch') || pLower.includes('proposal') || pLower.includes('outreach')) {
    return `[AI Model Execution: Claude 3.5 Sonnet]
Subject: Quick question regarding your team's current workflow

Hi {{First_Name}},

I noticed {{Company_Name}} recently expanded your operations into {{Market_Segment}} — congrats on the milestone!

Most teams at this stage hit a common bottleneck: manual lead qualification drains 12+ hours per rep each week. We built an automated AI workflow that pre-qualifies incoming inquiries directly into your CRM within 90 seconds.

One of our clients in a similar space saw a 3.4x lift in meeting booking rates within 3 weeks, without adding headcount.

Would you be open to a 10-minute walk-through this Thursday or Friday to see if this makes sense for your team?

Best regards,
[Your Name]
AI Operations Specialist

P.S. I prepared a 2-minute video breakdown of how the workflow syncs with your stack — let me know if you'd like me to send it over.`;
  }

  // If Midjourney / Image prompt
  if (pLower.includes('midjourney') || pLower.includes('image') || pLower.includes('photo') || pLower.includes('--ar') || pLower.includes('render')) {
    return `[AI Model Execution: Midjourney v6 Engine]
🎨 Prompt Synthesis & Parameter Validation:
Parsed Parameters:
• Aspect Ratio: Recognized
• Render Engine: Photorealistic Octane Render 8K
• Lighting: Volumetric atmospheric rim lighting
• Lens: 85mm f/1.4 prime lens, shallow depth of field

Resulting Visual Generation Metadata:
Seed: 84920412 | Quality: 2 | Stylize: 250 | V6.0
Generated 4 high-fidelity image variants matching your exact compositional rules and color temperature.
✓ Clean edges, realistic skin/surface textures, dynamic range balanced.`;
  }

  // If Automation / JSON / Webhook
  if (pLower.includes('json') || pLower.includes('automation') || pLower.includes('webhook') || pLower.includes('make') || pLower.includes('zapier')) {
    return `[AI Model Execution: GPT-4o Structured Output]
\`\`\`json
{
  "status": "success",
  "lead_analysis": {
    "intent": "enterprise_inquiry",
    "urgency_score": 8.5,
    "company_size_estimate": "50-200",
    "budget_detected": true,
    "recommended_action": "route_to_senior_ae",
    "summary": "Customer needs immediate integration for high-volume customer queries."
  },
  "automated_email_draft": {
    "subject": "Expedited onboarding for high-volume support integration",
    "tone": "consultative_urgent"
  }
}
\`\`\`
✓ Schema validated: 100% compliant with Make.com webhook JSON specification.`;
  }

  // Default high quality professional response tailored to the prompt
  return `[AI Model Execution: GPT-4o]
Based on your detailed instructions, here is the generated output:

1. Executive Summary:
The proposed AI strategy directly addresses client throughput by streamlining repeatable analytical tasks and eliminating data synthesis bottlenecks.

2. Actionable Implementation Steps:
• Step 1: Deploy tailored prompt templates with explicit constraint enforcement.
• Step 2: Integrate verification checkpoints to prevent hallucination in critical outputs.
• Step 3: Establish automated feedback loops to continuously benchmark response accuracy.

3. Key Metric & ROI:
Projected 40% reduction in turnaround time with zero loss in output fidelity.

✓ All constraints applied: Tone is authoritative and direct, structured for rapid scanning.`;
}
