import Link from "next/link";

export const dynamic = "force-dynamic";

type Webinar = {
id: string;
title: string;
status?: string | null;
slug?: string | null;
createdAt?: string;
};

async function getWebinars(): Promise<Webinar[]> {
const baseUrl =
process.env.NEXT_PUBLIC_APP_URL || "https://www.webinarforge.ai";

const res = await fetch(`${baseUrl}/api/webinars`, {
cache: "no-store",
});

const data = await res.json();
return data.webinars || [];
}

export default async function WebinarsPage() {
const webinars = await getWebinars();

return (
<main className="p-10 text-white">
<div className="flex items-center justify-between mb-8">
<h1 className="text-3xl font-bold">Your Webinars</h1>

<Link href="/dashboard/webinars/new">
<button className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg font-semibold">
+ Create Webinar
</button>
</Link>
</div>

<div className="bg-white/5 border border-white/10 rounded-2xl p-6">
<div className="grid grid-cols-4 text-sm text-gray-400 mb-4">
<span>Webinar</span>
<span>Status</span>
<span>Registrations</span>
<span>CTA Clicks</span>
</div>

<div className="space-y-4">
{webinars.length === 0 ? (
<p className="text-gray-400">No webinars yet</p>
) : (
webinars.map((webinar) => (
<Link
key={webinar.id}
href={`/dashboard/webinars/${webinar.id}`}
className="block"
>
<div className="grid grid-cols-4 items-center border-t border-white/5 pt-4 cursor-pointer hover:bg-white/5 rounded-lg px-2 pb-2 transition">
<span className="font-medium">{webinar.title}</span>

<span
className={`text-xs px-2 py-1 rounded-full w-fit ${
webinar.status === "PUBLISHED" ||
webinar.status === "LIVE"
? "bg-green-500/20 text-green-400"
: "bg-yellow-500/20 text-yellow-400"
}`}
>
{webinar.status || "DRAFT"}
</span>

<span>—</span>
<span>—</span>
</div>
</Link>
))
)}
</div>
</div>
</main>
);
}
