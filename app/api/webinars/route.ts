import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
try {
const body = await req.json();

const title =
typeof body.title === "string" && body.title.trim()
? body.title.trim()
: "Untitled Webinar";

let workspace = await prisma.workspace.findFirst({
orderBy: { createdAt: "asc" },
select: {
id: true,
slug: true,
name: true,
createdAt: true,
},
});

if (!workspace) {
workspace = await prisma.workspace.create({
data: {
name: "Default Workspace",
slug: "default-workspace",
},
select: {
id: true,
slug: true,
name: true,
createdAt: true,
},
});
}

const result = await prisma.$queryRaw<
Array<{
id: string;
title: string;
status: string | null;
workspaceId: string;
createdAt: Date;
}>
>`
INSERT INTO "Webinar" ("id", "title", "status", "workspaceId", "createdAt")
VALUES (gen_random_uuid()::text, ${title}, 'DRAFT', ${workspace.id}, NOW())
RETURNING "id", "title", "status", "workspaceId", "createdAt"
`;

return NextResponse.json({
success: true,
webinar: result[0],
});
} catch (error) {
console.error("POST /api/webinars error:", error);

return NextResponse.json(
{
success: false,
error: error instanceof Error ? error.message : "Failed to save webinar",
},
{ status: 500 }
);
}
}

export async function GET() {
try {
const webinars = await prisma.$queryRaw<
Array<{
id: string;
title: string;
status: string | null;
workspaceId: string;
createdAt: Date;
}>
>`
SELECT "id", "title", "status", "workspaceId", "createdAt"
FROM "Webinar"
ORDER BY "createdAt" DESC
`;

return NextResponse.json({
success: true,
webinars,
});
} catch (error) {
console.error("GET /api/webinars error:", error);

return NextResponse.json(
{
success: false,
error:
error instanceof Error ? error.message : "Failed to fetch webinars",
},
{ status: 500 }
);
}
}
