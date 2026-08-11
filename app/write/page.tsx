import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import WriteForm from "./write-form";

export default async function WritePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <main className="container page"><h1>Write Your Story</h1><p className="muted">Create your story, then pay the publishing fee to make it public.</p><WriteForm fee={Number(process.env.PUBLISHING_FEE_NGN || 1000)} /></main>;
}
