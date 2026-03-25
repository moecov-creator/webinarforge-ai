import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function WebinarEditorPage({
params,
}: {
params: { id: string };
}) {
const webinar = await prisma.webinar.findUnique({
where: { id: params.id },
include: {
sections: {
orderBy: { order: "asc" },
},
},
});

if (!webinar) return notFound();

const fullScript =
webinar.sections?.length > 0
? webinar.sections
.map((section) => `### ${section.title || section.type}\n${section.content}`)
.join("\n\n")
: "";

return (
<main className="min-h-screen bg-black text-white">
<div className="mx-auto max-w-6xl p-10">
<div className="flex items-center justify-between mb-8">
<h1 className="text-3xl font-bold">Webinar Script Editor</h1>

<Link href="/dashboard/webinars">
<button className="rounded-xl border border-white/20 px-5 py-3 font-medium hover:border-white/50">
← Back
</button>
</Link>
</div>

{webinar.sections.length === 0 ? (
<div className="rounded-xl border border-white/10 bg-white/5 p-6 text-gray-400">
No script sections found for this webinar.
</div>
) : (
<div className="space-y-6">
{webinar.sections.map((section) => (
<div
key={section.id}
className="rounded-xl border border-white/10 bg-white/5 p-6"
>
<h2 className="text-lg font-semibold capitalize mb-3">
{section.title || section.type}
</h2>

<textarea
defaultValue={section.content}
className="w-full h-[160px] bg-black border border-white/10 p-4 rounded-xl text-white"
readOnly
/>
</div>
))}

<div className="rounded-xl border border-white/10 bg-white/5 p-6">
<h2 className="text-lg font-semibold mb-3">Full Script</h2>
<textarea
defaultValue={fullScript}
className="w-full h-[400px] bg-black border border-white/10 p-4 rounded-xl text-white"
readOnly
/>
</div>
</div>
)}
</div>
</main>
);
}
