import db from "@/lib/db";
import { notFound } from "next/navigation";

export default async function StoryPage({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const story = db.prepare(`SELECT s.*,u.name author_name FROM stories s JOIN users u ON u.id=s.author_id WHERE s.slug=? AND s.status='published'`).get(slug) as any;
  if (!story) notFound();

  return <main className="container page reading">
    <span className="tag">{story.genre}</span>
    <h1>{story.title}</h1>
    <p className="byline">By <b>{story.author_name}</b> · {new Date(story.published_at || story.created_at).toLocaleDateString()}</p>
    <p className="lead">{story.excerpt}</p>
    <article>{story.content.split(/\n{2,}/).map((p:string,i:number)=><p key={i}>{p}</p>)}</article>
  </main>;
}
