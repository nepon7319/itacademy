import styles from './landing.module.css';
import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function LandingPage() {
  const session = await getSession();

  return (
    <main className={styles.main}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/" className={styles.logo}>
            AI MONEY ACADEMY
          </Link>
          <nav className={styles.nav} aria-label="Main navigation">
            <Link href="/courses" className={styles.navLink}>Courses</Link>
            <Link href="/tools" className={styles.navLink}>AI Tools</Link>
            <Link href="/earn" className={styles.navLink}>Ways to Earn</Link>
            <Link href="#how-it-works" className={styles.navLink}>How It Works</Link>
          </nav>
          <div className={styles.headerActions}>
            {session ? (
              <Link href="/dashboard" className="btn btn-primary btn-sm">Dashboard →</Link>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-ghost btn-sm">Log in</Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm">Start Learning →</Link>
              </>
            )}
          </div>
          <button className={styles.mobileMenuBtn} aria-label="Menu" id="mobile-menu-btn">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className="badge badge-outline">Free Educational Platform</span>
            </div>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroLine1}>LEARN AI.</span>
              <span className={styles.heroLine2}>BUILD INCOME.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Master practical AI skills, build real projects and discover new ways to use artificial intelligence for work, freelancing and digital business.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/auth/register" className="btn btn-primary btn-lg">
                Start Learning →
              </Link>
              <Link href="/courses" className="btn btn-secondary btn-lg">
                Explore Courses
              </Link>
            </div>
            <p className={styles.heroNote}>100% FREE  •  PRACTICAL  •  BEGINNER FRIENDLY</p>
          </div>

          <div className={styles.heroVisual}>
            <AIVisual />
          </div>
        </div>

        {/* Subtle grid overlay */}
        <div className={styles.heroGrid}></div>
      </section>

      {/* STATS */}
      <section className={styles.stats}>
        <div className={`container ${styles.statsInner}`}>
          <p className={`text-label ${styles.statsLabel}`}>Learn. Practice. Build.</p>
          <div className={styles.statsGrid}>
            {[
              { value: '50+', label: 'Lessons' },
              { value: '10+', label: 'AI Categories' },
              { value: '100%', label: 'Free' },
              { value: '∞', label: 'Possibilities' },
            ].map((s) => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={`${styles.section} section`} id="how-it-works">
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className="text-label">The Method</p>
            <h2 className={`text-headline ${styles.sectionTitle}`}>Learn AI in 3 Simple Steps</h2>
          </div>
          <div className={styles.stepsGrid}>
            {[
              { num: '01', title: 'LEARN', desc: 'Short, focused lessons that teach you exactly what you need — no fluff, no theory overload. Each lesson takes 5–10 minutes.' },
              { num: '02', title: 'PRACTICE', desc: 'Interactive quizzes and hands-on exercises test your understanding in real-time and help the knowledge stick.' },
              { num: '03', title: 'BUILD', desc: 'Apply what you\'ve learned in practical projects you can actually use — or show to clients and employers.' },
            ].map((step) => (
              <div key={step.num} className={styles.stepCard}>
                <span className={styles.stepNum}>{step.num}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className="text-body">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEARNING PATHS */}
      <section className={`${styles.section} section`} style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className="text-label">Your Journey</p>
            <h2 className={`text-headline ${styles.sectionTitle}`}>Six Levels of Mastery</h2>
          </div>
          <div className={styles.pathGrid}>
            {[
              { num: '01', slug: 'ai-fundamentals', title: 'AI FUNDAMENTALS', diff: 'BEGINNER', desc: 'Understand what AI is, how it works, and why it matters for your career.' },
              { num: '02', slug: 'prompt-engineering', title: 'PROMPT ENGINEERING', diff: 'BEGINNER', desc: 'Master the art of communicating with AI to get exactly the results you want.' },
              { num: '03', slug: 'ai-freelancing', title: 'AI FREELANCING', diff: 'INTERMEDIATE', desc: 'Turn your AI skills into a real income stream with freelance clients.' },
              { num: '04', slug: 'ai-content', title: 'AI CONTENT', diff: 'BEGINNER', desc: 'Create professional content at scale — text, images, and video.' },
              { num: '05', slug: 'ai-automation', title: 'AI AUTOMATION', diff: 'INTERMEDIATE', desc: 'Automate repetitive tasks and entire business workflows with AI.' },
              { num: '06', slug: 'ai-digital-business', title: 'AI DIGITAL BUSINESS', diff: 'ADVANCED', desc: 'Launch scalable digital products and AI-powered services.' },
            ].map((p, i) => (
              <Link href={`/courses`} key={p.num} className={styles.pathCard} style={{ animationDelay: `${i * 80}ms` }}>
                <div className={styles.pathCardTop}>
                  <span className={styles.pathNum}>{p.num}</span>
                  <span className={`badge ${p.diff === 'ADVANCED' ? 'badge-white' : 'badge-outline'}`}>{p.diff}</span>
                </div>
                <h3 className={styles.pathTitle}>{p.title}</h3>
                <p className="text-small">{p.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={`${styles.sectionHeader} ${styles.sectionHeaderRow}`}>
            <div>
              <p className="text-label">Featured</p>
              <h2 className={`text-headline ${styles.sectionTitle}`}>Start Here</h2>
            </div>
            <Link href="/courses" className="btn btn-secondary btn-sm">All Courses →</Link>
          </div>
          <div className={styles.coursesGrid}>
            {[
              { title: 'AI FUNDAMENTALS', lessons: 5, diff: 'BEGINNER', icon: '◈', desc: 'Learn the core concepts of AI and how it\'s changing everything.' },
              { title: 'PROMPT ENGINEERING', lessons: 7, diff: 'BEGINNER', icon: '◉', desc: 'The most valuable skill in the AI era — learn to direct AI with precision.' },
              { title: 'AI FREELANCING', lessons: 8, diff: 'INTERMEDIATE', icon: '◎', desc: 'Build a client base and income stream using AI tools.' },
            ].map((c) => (
              <Link href="/courses" key={c.title} className={styles.courseCard}>
                <div className={styles.courseCardIcon}>{c.icon}</div>
                <div className={styles.courseCardMeta}>
                  <span className="badge badge-outline">{c.diff}</span>
                  <span className="text-small">{c.lessons} lessons</span>
                </div>
                <h3 className={styles.courseCardTitle}>{c.title}</h3>
                <p className="text-small">{c.desc}</p>
                <span className={styles.courseCardArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GAMIFICATION */}
      <section className={`section ${styles.section}`} style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className={styles.gamificationInner}>
            <div className={styles.gamificationText}>
              <p className="text-label">Gamified Learning</p>
              <h2 className={`text-headline ${styles.sectionTitle}`}>Stay Motivated. Track Progress.</h2>
              <p className="text-body" style={{ marginTop: '16px', maxWidth: '480px' }}>
                Learning AI shouldn&apos;t feel like studying. Our system turns every lesson into a rewarding experience — with XP, streaks, levels, and real achievements.
              </p>
              <div className={styles.gamificationFeatures}>
                {[
                  { icon: '◈', label: 'XP & Levels', desc: 'Earn XP for every lesson and level up' },
                  { icon: '◉', label: 'Daily Streaks', desc: 'Build a learning habit, day by day' },
                  { icon: '◎', label: 'Achievements', desc: 'Unlock badges as you master skills' },
                  { icon: '◐', label: 'Learning Map', desc: 'Visual progress through every course' },
                ].map(f => (
                  <div key={f.label} className={styles.gamificationFeature}>
                    <span className={styles.featureIcon}>{f.icon}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--white)' }}>{f.label}</p>
                      <p className="text-small">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.gamificationCard}>
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* AI TOOLS TEASER */}
      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={`${styles.sectionHeader} ${styles.sectionHeaderRow}`}>
            <div>
              <p className="text-label">Curated Directory</p>
              <h2 className={`text-headline ${styles.sectionTitle}`}>AI Tools</h2>
            </div>
            <Link href="/tools" className="btn btn-secondary btn-sm">All Tools →</Link>
          </div>
          <div className={styles.toolsGrid}>
            {[
              { name: 'ChatGPT', cat: 'TEXT', desc: 'The world\'s most popular AI assistant for writing, research, and coding.' },
              { name: 'Midjourney', cat: 'IMAGE', desc: 'Create stunning visuals, artwork, and product images from text.' },
              { name: 'ElevenLabs', cat: 'AUDIO', desc: 'Realistic AI voice synthesis for content creation and business.' },
              { name: 'Make', cat: 'AUTOMATION', desc: 'Visual no-code automation to connect apps and automate workflows.' },
              { name: 'Runway', cat: 'VIDEO', desc: 'Professional AI video generation and editing platform.' },
              { name: 'Perplexity', cat: 'RESEARCH', desc: 'AI-powered search with cited sources for accurate research.' },
            ].map(t => (
              <Link href="/tools" key={t.name} className={styles.toolCard}>
                <div className={styles.toolCardHeader}>
                  <span className={styles.toolName}>{t.name}</span>
                  <span className="badge badge-outline">{t.cat}</span>
                </div>
                <p className="text-small">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI MENTOR */}
      <section className={`section ${styles.section}`} style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className={styles.mentorInner}>
            <div className={styles.mentorText}>
              <p className="text-label">Built-in Support</p>
              <h2 className={`text-headline ${styles.sectionTitle}`}>Your Personal AI Mentor</h2>
              <p className="text-body" style={{ marginTop: '16px' }}>
                Stuck on a concept? Not sure if your prompt is good? Your AI Mentor is available at any point during your learning journey — offering hints, explanations, and constructive feedback.
              </p>
              <Link href="/auth/register" className="btn btn-primary" style={{ marginTop: '32px', display: 'inline-flex' }}>
                Start Learning Free →
              </Link>
            </div>
            <div className={styles.mentorPreview}>
              <MentorPreview />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className="text-label">Questions</p>
            <h2 className={`text-headline ${styles.sectionTitle}`}>FAQ</h2>
          </div>
          <div className={styles.faqGrid}>
            {[
              { q: 'Is this really free?', a: 'Yes, completely free. All courses, lessons, quizzes, and features are available at no cost. We believe practical AI education should be accessible to everyone.' },
              { q: 'Do I need any technical background?', a: 'No. AI MONEY ACADEMY starts from absolute zero. If you can use a smartphone, you can start this course. The content gradually increases in complexity.' },
              { q: 'How long does each lesson take?', a: 'Most lessons are designed to take 5–10 minutes. You can complete one lesson on your lunch break. The entire AI Fundamentals course can be finished in under 2 hours.' },
              { q: 'Can I really use AI to earn money?', a: 'Yes. Thousands of people are currently earning income using AI tools as freelancers, content creators, and digital product builders. This platform teaches practical skills, not theory.' },
              { q: 'What makes this different from YouTube tutorials?', a: 'Structured progression, interactive exercises, XP and streak systems for motivation, practical projects, and an AI mentor. Passive watching doesn\'t build skills — active doing does.' },
              { q: 'What language is the content in?', a: 'Currently English. German, Russian, and Spanish versions are planned for future releases. The platform architecture already supports multiple languages.' },
            ].map((faq) => (
              <div key={faq.q} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{faq.q}</h3>
                <p className="text-body">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className="container">
          <div className={styles.finalCtaInner}>
            <p className="text-label">Get Started</p>
            <h2 className={styles.finalCtaTitle}>YOUR AI JOURNEY STARTS HERE.</h2>
            <p className={styles.finalCtaSubtitle}>Learn. Practice. Build.</p>
            <Link href="/auth/register" className="btn btn-primary btn-lg">
              Start Learning for Free →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.logo}>AI MONEY ACADEMY</Link>
            <p className="text-small">Learn AI. Build Income.</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <p className={styles.footerColTitle}>Platform</p>
              <Link href="/courses" className={styles.footerLink}>Courses</Link>
              <Link href="/tools" className={styles.footerLink}>AI Tools</Link>
              <Link href="/earn" className={styles.footerLink}>Ways to Earn</Link>
            </div>
            <div className={styles.footerCol}>
              <p className={styles.footerColTitle}>Company</p>
              <Link href="#" className={styles.footerLink}>About</Link>
              <Link href="#how-it-works" className={styles.footerLink}>How It Works</Link>
              <Link href="#faq" className={styles.footerLink}>FAQ</Link>
            </div>
            <div className={styles.footerCol}>
              <p className={styles.footerColTitle}>Legal</p>
              <Link href="#" className={styles.footerLink}>Privacy</Link>
              <Link href="#" className={styles.footerLink}>Terms</Link>
            </div>
          </div>
        </div>
        <div className={`container ${styles.footerBottom}`}>
          <p className="text-small">© 2024 AI Money Academy. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

// ============================================
// DECORATIVE COMPONENTS
// ============================================

function AIVisual() {
  return (
    <div className={styles.aiVisual} aria-hidden="true">
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.aiSvg}>
        {/* Outer ring */}
        <circle cx="250" cy="250" r="200" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <circle cx="250" cy="250" r="160" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        <circle cx="250" cy="250" r="120" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <circle cx="250" cy="250" r="80" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <circle cx="250" cy="250" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>

        {/* Central node */}
        <circle cx="250" cy="250" r="8" fill="rgba(255,255,255,0.9)"/>
        <circle cx="250" cy="250" r="16" fill="rgba(255,255,255,0.06)"/>
        <circle cx="250" cy="250" r="24" fill="rgba(255,255,255,0.03)"/>

        {/* Outer nodes */}
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = 250 + 200 * Math.cos(rad);
          const y = 250 + 200 * Math.sin(rad);
          const mx = 250 + 120 * Math.cos(rad);
          const my = 250 + 120 * Math.sin(rad);
          return (
            <g key={angle}>
              <line x1="250" y1="250" x2={x} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
              <circle cx={x} cy={y} r="4" fill="rgba(255,255,255,0.5)"/>
              <circle cx={mx} cy={my} r="3" fill="rgba(255,255,255,0.3)"/>
            </g>
          );
        })}

        {/* Mid-ring nodes */}
        {[30, 90, 150, 210, 270, 330].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = 250 + 160 * Math.cos(rad);
          const y = 250 + 160 * Math.sin(rad);
          return <circle key={angle} cx={x} cy={y} r="2.5" fill="rgba(255,255,255,0.25)" />;
        })}

        {/* Grid lines */}
        <line x1="50" y1="250" x2="450" y2="250" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        <line x1="250" y1="50" x2="250" y2="450" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      </svg>

      {/* Floating label */}
      <div className={styles.aiVisualLabel}>AI NETWORK</div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className={styles.dashPreview}>
      <div className={styles.dashHeader}>
        <span className={styles.dashGreeting}>GOOD MORNING.</span>
        <span className="text-label">Continue your AI journey.</span>
      </div>
      <div className={styles.dashProgress}>
        <div className={styles.dashProgressHeader}>
          <span className="text-small" style={{color: 'var(--white)'}}>YOUR PROGRESS</span>
          <span className={styles.dashProgressPct}>72%</span>
        </div>
        <div className="progress-bar" style={{height: '6px'}}>
          <div className="progress-bar-fill" style={{width: '72%'}}></div>
        </div>
        <span className="text-small">24 / 33 lessons</span>
      </div>
      <div className={styles.dashStats}>
        {[
          { label: 'STREAK', value: '7 DAYS' },
          { label: 'TOTAL XP', value: '2,450' },
          { label: 'PROJECTS', value: '3' },
        ].map(s => (
          <div key={s.label} className={styles.dashStat}>
            <span className="text-label">{s.label}</span>
            <span className={styles.dashStatVal}>{s.value}</span>
          </div>
        ))}
      </div>
      <div className={styles.dashLevel}>
        <span className="badge badge-white">LEVEL 4 — CREATOR</span>
      </div>
    </div>
  );
}

function MentorPreview() {
  return (
    <div className={styles.mentorChat}>
      <div className={styles.mentorChatHeader}>
        <div className={styles.mentorAvatar}>AI</div>
        <div>
          <p style={{fontWeight: 600, fontSize: '0.875rem'}}>AI Mentor</p>
          <p className="text-small" style={{fontSize: '0.75rem'}}>Online</p>
        </div>
        <div className={styles.mentorOnline}></div>
      </div>
      <div className={styles.mentorMessages}>
        <div className={styles.mentorMsg}>
          <p>I see you completed the prompt structure lesson. Ready for a challenge?</p>
        </div>
        <div className={`${styles.mentorMsg} ${styles.mentorMsgUser}`}>
          <p>Yes, but I&apos;m not sure how to add context to my prompts.</p>
        </div>
        <div className={styles.mentorMsg}>
          <p>Great question! Think about it this way: imagine you&apos;re briefing a new employee. What would they need to know to do the job perfectly?</p>
        </div>
        <div className={`${styles.mentorMsg} ${styles.mentorMsgUser}`}>
          <p>Their role, the audience, the goal...</p>
        </div>
        <div className={styles.mentorMsg}>
          <p>Exactly! That&apos;s your context. Try rewriting your prompt with those elements. What do you come up with?</p>
        </div>
      </div>
      <div className={styles.mentorInput}>
        <span>Ask your mentor...</span>
      </div>
    </div>
  );
}
