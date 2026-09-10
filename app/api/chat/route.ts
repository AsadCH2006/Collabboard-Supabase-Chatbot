import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  // 1. Verify User Session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await req.json();
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // 2. Fetch current credits
  const { data: creditRecord, error: fetchError } = await supabase
    .from("Credits")
    .select("credits_count")
    .eq("user_id", user.id)
    .single();

  if (fetchError || !creditRecord) {
    return NextResponse.json({ error: "Credit record not found." }, { status: 404 });
  }

  if (creditRecord.credits_count <= 0) {
    return NextResponse.json(
      { error: "Insufficient credits. Please top up to continue messaging." },
      { status: 403 }
    );
  }

  // 3. Deduct 1 Credit
  const newCreditBalance = creditRecord.credits_count - 1;
  const { error: updateError } = await supabase
    .from("Credits")
    .update({ credits_count: newCreditBalance })
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
  }

  // 4. Generate Bot Response
  const reply = `Received your message: "${message}". One credit deducted!`;

  return NextResponse.json({
    reply,
    remainingCredits: newCreditBalance,
  });
}