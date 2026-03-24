import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
req: Request,
{ params }: { params: { id: string } }
) {
try {
const body = await req.json();

const {
hook,
promise,
problem,
origin,
teaching1,
teaching2,
transition,
cta,
} = body;

await prisma.webinar.update({
where: { id: params.id },
data: {
scriptHook: hook,
scriptPromise: promise,
scriptProblem: problem,
scriptOrigin: origin,
scriptTeaching1: teaching1,
scriptTeaching2: teaching2,
scriptTransition: transition,
scriptCTA: cta,
},
});

return NextResponse.json({ success: true });
} catch (error) {
console.error("SAVE SCRIPT ERROR:", error);

return NextResponse.json(
{ success: false, error: "Failed to save script" },
{ status: 500 }
);
}
}
