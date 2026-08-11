import Link from "next/link";
import db from "@/lib/db";

export default async function StoriesPage({ searchParams }: { searchParams: Promise<{genre?: string}> }) {
  const params = await searchParams;
  const genre = params.genre;
  const stories = genre
    ? db.prepare(`SELECT s.*,u.name author_name FROM stories s JOIN users u ON u.id=s.author_id WHERE s.status='published' AND s.genre=? ORDER BY s.published_at DESC`).all(genre) as any[]
    : db.prepare(`SELECT s.*,u.name author_name FROM stories s JOIN users u ON u.id=s.author_id WHERE s.status='published' ORDER BY s.published_at DESC`).all() as any[];

  return <main className="container page">
    <h1>{genre ? `${genre} Stories` : "All Stories"}</h1>
    <p className="muted">Read stories published by the StoryLights House community.</p>
    <div className="filters">{["All","Romance","War","Thriller","Fictional"].map(g => <Link className={(!genre&&g==="All")||genre===g?"active":""} href={g==="All"?"/stories":`/stories?genre=${g}`} key={g}>{g}</Link>)}</div>
    <div className="story-grid">{stories.map(s => <Link className="story-card" href={`/stories/${s.slug}`} key={s.id}><div className="cover" style={{backgroundImage:`url(${s.cover_url || "/hero.png"})`}}/><div className="card-body"><span className="tag">{s.genre}</span><h3>{s.title}</h3><p>{s.excerpt}</p><small>by {s.author_name}</small></div></Link>)}</div>
    {stories.length===0 && <div className="empty">No published stories in this category yet.</div>}
  </main>;
}
