import Link from "next/link";
import db from "@/lib/db";

export default function Home() {
  const stories = db.prepare(`
    SELECT s.*, u.name author_name FROM stories s JOIN users u ON u.id=s.author_id
    WHERE s.status='published' ORDER BY s.published_at DESC LIMIT 4
  `).all() as any[];

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">STORYLIGHTS HOUSE</div>
          <h1>Every Story Finds a <em>Home</em>.<br/>Every Reader Finds a <em>Light</em>.</h1>
          <p>Discover captivating stories, follow new writers, and share your own imagination with readers everywhere.</p>
          <div className="actions">
            <Link className="button primary" href="/stories">Start Reading</Link>
            <Link className="button" href="/write">Write Your Story</Link>
          </div>
        </div>
        <div className="house-art" aria-label="A glowing story house">🏚️✨</div>
      </section>

      <section className="container">
        <h2>Explore Stories That Move You</h2>
        <div className="genres">
          {["Romance","War","Thriller","Fictional"].map(g => (
            <Link href={`/stories?genre=${encodeURIComponent(g)}`} className="genre" key={g}>
              <strong>{g}</strong><span>{g==="Romance"?"Love that lights the heart.":g==="War"?"Battles that shape destinies.":g==="Thriller"?"Suspense that keeps you on edge.":"Worlds beyond imagination."}</span>
            </Link>
          ))}
        </div>

        <div className="section-head"><h2>Featured Stories</h2><Link href="/stories">View all →</Link></div>
        {stories.length === 0 ? (
          <div className="empty"><h3>The house is waiting for its first stories.</h3><p>Be the first writer to publish on StoryLights House.</p></div>
        ) : (
          <div className="story-grid">{stories.map(s => (
            <Link className="story-card" href={`/stories/${s.slug}`} key={s.id}>
              <div className="cover" style={{backgroundImage:`url(${s.cover_url || "/hero.png"})`}}/>
              <div className="card-body"><span className="tag">{s.genre}</span><h3>{s.title}</h3><p>{s.excerpt}</p><small>by {s.author_name}</small></div>
            </Link>
          ))}</div>
        )}
      </section>
    </main>
  );
}
