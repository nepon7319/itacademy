import Link from 'next/link';
import styles from './earn.module.css';

const EARN_CARDS = [
  {
    title: 'AI COPYWRITING',
    difficulty: 'Beginner',
    skills: ['Prompt Engineering', 'Content Writing', 'Editing'],
    tools: ['ChatGPT', 'Claude', 'Copy.ai'],
    whatYouDo: 'Write blog posts, website copy, email campaigns, product descriptions, and social media content for businesses using AI to produce drafts quickly.',
    exampleService: 'Blog post package: 4 posts/month for a small business',
    learningPath: '/learn/ai-content',
  },
  {
    title: 'AI IMAGE CREATION',
    difficulty: 'Beginner',
    skills: ['Midjourney', 'Prompt Writing', 'Image Editing'],
    tools: ['Midjourney', 'DALL-E 3', 'Adobe Firefly'],
    whatYouDo: 'Create marketing visuals, social media graphics, product images, and illustrations for brands and entrepreneurs.',
    exampleService: 'Social media image pack: 20 custom graphics/month',
    learningPath: '/learn/ai-content',
  },
  {
    title: 'AI VIDEO CONTENT',
    difficulty: 'Intermediate',
    skills: ['Video Editing', 'AI Tools', 'Storytelling'],
    tools: ['Runway', 'HeyGen', 'Descript'],
    whatYouDo: 'Create short-form video content, product demos, explainer videos, and AI avatar presentations for brands.',
    exampleService: 'Monthly video package: 8 short videos for social media',
    learningPath: '/learn/ai-content',
  },
  {
    title: 'AI TRANSLATION',
    difficulty: 'Beginner',
    skills: ['Language Skills', 'AI Tools', 'Editing'],
    tools: ['ChatGPT', 'DeepL', 'Claude'],
    whatYouDo: 'Translate documents, websites, marketing materials, and content into multiple languages using AI with human review.',
    exampleService: 'Website translation: 10,000 words into 3 languages',
    learningPath: '/learn/ai-fundamentals',
  },
  {
    title: 'AI AUTOMATION SETUP',
    difficulty: 'Intermediate',
    skills: ['Make/Zapier', 'Process Design', 'API Basics'],
    tools: ['Make', 'Zapier', 'n8n'],
    whatYouDo: 'Build automated workflows for small businesses — connecting their tools, automating repetitive tasks, and saving hours per week.',
    exampleService: 'CRM automation setup + email follow-up workflow',
    learningPath: '/learn/ai-automation',
  },
  {
    title: 'AI CHATBOT BUILDING',
    difficulty: 'Intermediate',
    skills: ['Prompt Engineering', 'Tool Config', 'UX'],
    tools: ['Voiceflow', 'Botpress', 'ChatGPT API'],
    whatYouDo: 'Build custom AI chatbots for business websites — customer support, lead generation, FAQ automation.',
    exampleService: 'Custom customer support chatbot for an e-commerce store',
    learningPath: '/learn/ai-automation',
  },
  {
    title: 'DIGITAL AI PRODUCTS',
    difficulty: 'Intermediate',
    skills: ['Product Design', 'Marketing', 'Prompt Engineering'],
    tools: ['Gumroad', 'Notion', 'ChatGPT'],
    whatYouDo: 'Create and sell digital products: prompt libraries, AI template packs, guides, and tools — once built, sold indefinitely.',
    exampleService: 'Prompt library for marketers ($27) — passive income',
    learningPath: '/learn/ai-digital-business',
  },
  {
    title: 'AI CONSULTING',
    difficulty: 'Advanced',
    skills: ['Business Analysis', 'AI Strategy', 'Communication'],
    tools: ['ChatGPT', 'Make', 'Notion'],
    whatYouDo: 'Help businesses understand AI, identify automation opportunities, and implement AI-powered workflows in their operations.',
    exampleService: 'AI audit + implementation roadmap for a small business',
    learningPath: '/learn/ai-digital-business',
  },
  {
    title: 'MICRO-SAAS',
    difficulty: 'Advanced',
    skills: ['No-Code Tools', 'Product Design', 'Marketing'],
    tools: ['Bubble', 'Glide', 'Stripe', 'OpenAI API'],
    whatYouDo: 'Build small, specialized AI-powered web tools or apps that solve a specific problem and charge a monthly subscription.',
    exampleService: 'AI resume optimizer tool — $9/month subscription',
    learningPath: '/learn/ai-digital-business',
  },
];

export default function EarnPage() {
  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/" className={styles.logo}>AI MONEY ACADEMY</Link>
          <nav className={styles.nav}>
            <Link href="/courses" className={styles.navLink}>Courses</Link>
            <Link href="/tools" className={styles.navLink}>AI Tools</Link>
            <Link href="/earn" className={styles.navLink} style={{color:'var(--white)'}}>Ways to Earn</Link>
          </nav>
          <div style={{display:'flex',gap:'var(--space-2)'}}>
            <Link href="/auth/login" className="btn btn-ghost btn-sm">Log in</Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm">Start Free →</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <p className="text-label">Practical Opportunities</p>
            <h1 className={`text-headline ${styles.pageTitle}`}>WAYS TO EARN WITH AI</h1>
            <p className="text-body" style={{maxWidth:'600px',marginTop:'var(--space-4)'}}>
              Real-world applications of AI skills. These are practical use cases — not get-rich-quick promises. Building any of these takes time, skill development, and consistent effort.
            </p>
            <div className={styles.disclaimer}>
              <p>These are example use cases showing how people apply AI skills professionally. Income varies significantly based on skill level, market, effort, and many other factors. We make no income guarantees.</p>
            </div>
          </div>

          <div className={styles.earnGrid}>
            {EARN_CARDS.map((card, i) => (
              <div key={card.title} className={styles.earnCard} style={{animationDelay:`${i*50}ms`}}>
                <div className={styles.earnCardTop}>
                  <h2 className={styles.earnTitle}>{card.title}</h2>
                  <span className={`badge ${card.difficulty === 'Advanced' ? 'badge-white' : 'badge-outline'}`}>{card.difficulty}</span>
                </div>

                <p className="text-body" style={{fontSize:'0.875rem'}}>{card.whatYouDo}</p>

                <div className={styles.earnMeta}>
                  <div className={styles.earnMetaSection}>
                    <p className="text-label" style={{marginBottom:'6px'}}>Skills Required</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:'var(--space-1)'}}>
                      {card.skills.map(s => <span key={s} className="badge badge-outline" style={{fontSize:'0.65rem'}}>{s}</span>)}
                    </div>
                  </div>
                  <div className={styles.earnMetaSection}>
                    <p className="text-label" style={{marginBottom:'6px'}}>Tools</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:'var(--space-1)'}}>
                      {card.tools.map(t => <span key={t} className="badge badge-outline" style={{fontSize:'0.65rem'}}>{t}</span>)}
                    </div>
                  </div>
                </div>

                <div className={styles.exampleService}>
                  <p className="text-label" style={{marginBottom:'4px'}}>Example Service</p>
                  <p style={{fontSize:'0.8rem',color:'var(--text-secondary)',fontStyle:'italic'}}>"{card.exampleService}"</p>
                </div>

                <Link href={card.learningPath} className="btn btn-secondary btn-sm" style={{width:'fit-content',marginTop:'auto'}}>
                  Learn the Skills →
                </Link>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className={styles.earnCta}>
            <p className="text-label">Ready to Start?</p>
            <h2 className={`text-headline`} style={{color:'var(--white)',marginTop:'var(--space-2)'}}>BUILD THE SKILLS FIRST.</h2>
            <p className="text-body" style={{maxWidth:'480px',margin:'var(--space-4) auto 0',textAlign:'center'}}>
              All the opportunities above become accessible once you&apos;ve developed the underlying AI skills. Start with AI Fundamentals and work your way up.
            </p>
            <Link href="/auth/register" className="btn btn-primary btn-lg" style={{marginTop:'var(--space-8)'}}>
              Start Learning Free →
            </Link>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <Link href="/" className={styles.logo}>AI MONEY ACADEMY</Link>
          <div style={{display:'flex',gap:'var(--space-6)'}}>
            <Link href="/courses" className={styles.navLink}>Courses</Link>
            <Link href="/tools" className={styles.navLink}>AI Tools</Link>
            <Link href="/auth/register" className={styles.navLink}>Start Free</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
