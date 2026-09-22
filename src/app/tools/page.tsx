import { getDb } from '@/lib/db';
import Link from 'next/link';
import styles from './tools.module.css';

const CATEGORIES = ['All', 'TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'CODE', 'AUTOMATION', 'RESEARCH'];

export default function ToolsPage() {
  const db = getDb();
  const tools = db.prepare('SELECT * FROM ai_tools ORDER BY order_index').all() as {
    id: number; name: string; category: string; description: string;
    pricing: string; best_for: string; url: string;
  }[];

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/" className={styles.logo}>AI MONEY ACADEMY</Link>
          <nav className={styles.nav}>
            <Link href="/courses" className={styles.navLink}>Courses</Link>
            <Link href="/tools" className={styles.navLink} style={{color:'var(--white)'}}>AI Tools</Link>
            <Link href="/earn" className={styles.navLink}>Ways to Earn</Link>
          </nav>
          <div style={{display:'flex',gap:'var(--space-2)'}}>
            <Link href="/auth/login" className="btn btn-ghost btn-sm">Log in</Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm">Start Free →</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={`container ${styles.content}`}>
          <div className={styles.pageHeader}>
            <p className="text-label">Curated Directory</p>
            <h1 className={`text-headline ${styles.pageTitle}`}>AI TOOLS</h1>
            <p className="text-body" style={{maxWidth:'560px',marginTop:'var(--space-4)'}}>
              The most useful AI tools — organized by category. Each tool has been selected for practical value in real work and business.
            </p>
          </div>

          {/* Category filter */}
          <div className={styles.categoryFilter}>
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                href={cat === 'All' ? '/tools' : `/tools?cat=${cat}`}
                className={`${styles.catBtn} badge badge-outline`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Tools grid */}
          <div className={styles.toolsGrid}>
            {tools.map((tool, i) => (
              <div key={tool.id} className={styles.toolCard} style={{animationDelay:`${i * 40}ms`}}>
                <div className={styles.toolCardTop}>
                  <h2 className={styles.toolName}>{tool.name}</h2>
                  <span className="badge badge-outline">{tool.category}</span>
                </div>
                <p className="text-body" style={{fontSize:'0.875rem'}}>{tool.description}</p>
                <div className={styles.toolMeta}>
                  <div className={styles.toolMetaItem}>
                    <span className="text-label">Pricing</span>
                    <span className={styles.toolMetaVal}>{tool.pricing}</span>
                  </div>
                  <div className={styles.toolMetaItem}>
                    <span className="text-label">Best for</span>
                    <span className={styles.toolMetaVal}>{tool.best_for}</span>
                  </div>
                </div>
                {tool.url && (
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{width:'fit-content',marginTop:'auto'}}>
                    Open Tool →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <Link href="/" className={styles.logo}>AI MONEY ACADEMY</Link>
          <p className="text-small">Learn AI. Build Income.</p>
          <div style={{display:'flex',gap:'var(--space-6)'}}>
            <Link href="/courses" className={styles.navLink}>Courses</Link>
            <Link href="/earn" className={styles.navLink}>Ways to Earn</Link>
            <Link href="/auth/register" className={styles.navLink}>Start Free</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
