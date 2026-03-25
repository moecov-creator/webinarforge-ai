import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NicheType, WebinarMode, WebinarStatus } from "@prisma/client";

function slugify(value: string) {
return value
.toLowerCase()
.trim()
.replace(/[^a-z0-9\s-]/g, "")
.replace(/\s+/g, "-")
.replace(/-+/g, "-");
}

function mapNiche(input?: string): NicheType {
const value = (input || "").toLowerCase();

if (value.includes("real estate") || value.includes("realtor")) {
return NicheType.REAL_ESTATE;
}
if (value.includes("coach") || value.includes("consultant")) {
return NicheType.COACH_CONSULTANT;
}
if (value.includes("travel")) {
return NicheType.TRAVEL;
}
if (value.includes("saas") || value.includes("software")) {
return NicheType.SAAS;
}
if (
value.includes("local") ||
value.includes("hvac") ||
value.includes("plumber") ||
value.includes("roofing")
) {
return NicheType.LOCAL_SERVICES;
}

return NicheType.OTHER;
}

function parseScriptToSections(script: string) {
const rawParts = script
.split("###")
.map((part) => part.trim())
.filter(Boolean);

const sections: Array<{
type: string;
title: string;
content: string;
order: number;
}> = [];

rawParts.forEach((part, index) => {
const lines = part.split("\n").filter(Boolean);
const heading = lines[0] || `Section ${index + 1}`;
const content = lines.slice(1).join("\n").trim() || part;
const lower = heading.toLowerCase();

let type = "teaching";
if (lower.includes("hook")) type = "hook";
else if (lower.includes("promise")) type = "promise";
else if (lower.includes("problem")) type = "belief_shift";
else if (lower.includes("origin") || lower.includes("story")) type = "credibility";
else if (lower.includes("cta") || lower.includes("call to action")) type = "cta";
else if (lower.includes("offer")) type = "offer_transition";
else if (lower.includes("teaching") || lower.includes("belief")) type = "teaching";

sections.push({
type,
title: heading,
content,
order: index + 1,
});
});

if (sections.length === 0 && script.trim()) {
sections.push({
type: "hook",
title: "Opening Hook",
content: script.trim(),
order: 1,
});
}

return sections;
}

export async function POST(req: Request) {
try {
const body = await req.json();

const title =
typeof body.title === "string" && body.title.trim()
? body.title.trim()
: "Untitled Webinar";

const niche =
typeof body.niche === "string" ? body.niche.trim() : "";

const corePromise =
typeof body.corePromise === "string" ? body.corePromise.trim() : "";

const cta =
typeof body.cta === "string" ? body.cta.trim() : "";

const script =
typeof body.script === "string" ? body.script.trim() : "";

let workspace = await prisma.workspace.findFirst({
orderBy: { createdAt: "asc" },
select: { id: true, slug: true, name: true },
});

if (!workspace) {
workspace = await prisma.workspace.create({
data: {
name: "Default Workspace",
slug: "default-workspace",
},
select: { id: true, slug: true, name: true },
});
}

const baseSlug = slugify(title) || "untitled-webinar";
let slug = baseSlug;
let counter = 1;

while (
await prisma.webinar.findFirst({
where: { slug },
select: { id: true },
})
) {
counter += 1;
slug = `${baseSlug}-${counter}`;
}

const sections = parseScriptToSections(script);

const webinar = await prisma.webinar.create({
data: {
workspaceId: workspace.id,
title,
niche: mapNiche(niche),
status: WebinarStatus.DRAFT,
mode: WebinarMode.EVERGREEN,
slug,
generatorInputs: {
title,
niche,
corePromise,
cta,
script,
},
sections: sections.length
? {
create: sections,
}
: undefined,
},
include: {
sections: {
orderBy: { order: "asc" },
},
},
});

return NextResponse.json({
success: true,
webinar,
});
} catch (error) {
console.error("POST /api/webinars error:", error);

return NextResponse.json(
{
success: false,
error: error instanceof Error ? error.message : "Failed to create webinar",
},
{ status: 500 }
);
}
}

export async function GET() {
try {
const webinars = await prisma.webinar.findMany({
orderBy: { createdAt: "desc" },
include: {
sections: {
orderBy: { order: "asc" },
},
},
});

return NextResponse.json({
success: true,
webinars,
});
} catch (error) {
console.error("GET /api/webinars error:", error);

return NextResponse.json(
{
success: false,
error: error instanceof Error ? error.message : "Failed to fetch webinars",
},
{ status: 500 }
);
}
}
