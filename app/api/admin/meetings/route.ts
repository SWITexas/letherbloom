import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, meeting_number, meeting_password, start_time, details, allowed_plans } = body;

    if (!meeting_number) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const detailsObj = {
      description: details ? String(details) : "",
      recurrence: body.recurrence || "none",
    };

    const { data, error } = await supabase.from("meetings").insert({
      title: title || null,
      meeting_number,
      meeting_password: meeting_password || null,
      start_time: start_time ? new Date(start_time).toISOString() : null,
      details: detailsObj,
      allowed_plans: Array.isArray(allowed_plans) ? allowed_plans : [],
    }).select().single();

    if (error) {
      console.error("Insert meeting error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ meeting: data });
  } catch (err: any) {
    console.error("Admin create meeting error:", err);
    return NextResponse.json({ error: err.message || "Unknown" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing meeting ID" }, { status: 400 });
    }

    const { error } = await supabase.from("meetings").delete().eq("id", id);

    if (error) {
      console.error("Delete meeting error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Admin delete meeting error:", err);
    return NextResponse.json({ error: err.message || "Unknown" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing meeting ID" }, { status: 400 });
    }

    // Allow updating specific fields
    const allowedFields: any = {};
    if (body.title !== undefined) allowedFields.title = body.title;
    if (body.meeting_number !== undefined) allowedFields.meeting_number = body.meeting_number;
    if (body.meeting_password !== undefined) allowedFields.meeting_password = body.meeting_password;
    if (body.start_time !== undefined) allowedFields.start_time = body.start_time ? new Date(body.start_time).toISOString() : null;
    if (body.details !== undefined || body.recurrence !== undefined) {
      allowedFields.details = {
        description: body.details !== undefined ? String(body.details) : "",
        recurrence: body.recurrence || "none",
      };
    }
    if (body.is_ended !== undefined) allowedFields.is_ended = body.is_ended;
    if (body.allowed_plans !== undefined) allowedFields.allowed_plans = Array.isArray(body.allowed_plans) ? body.allowed_plans : [];

    const { data, error } = await supabase
      .from("meetings")
      .update(allowedFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update meeting error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ meeting: data });
  } catch (err: any) {
    console.error("Admin update meeting error:", err);
    return NextResponse.json({ error: err.message || "Unknown" }, { status: 500 });
  }
}
