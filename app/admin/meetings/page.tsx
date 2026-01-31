"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function AdminMeetingsPage() {
  const [title, setTitle] = useState("");
  const [meetingNumber, setMeetingNumber] = useState("");
  const [meetingPassword, setMeetingPassword] = useState("");
  const [startTime, setStartTime] = useState("");
  const [details, setDetails] = useState("");
  const [allowedPlans, setAllowedPlans] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const availablePlans = [
    "Personal Training",
    "Individual Group",
    "Corporate Group",
    "Functional Core"
  ];

  const handlePlanToggle = (plan: string) => {
    setAllowedPlans(prev =>
      prev.includes(plan)
        ? prev.filter(p => p !== plan)
        : [...prev, plan]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const payload = {
        title,
        meeting_number: meetingNumber,
        meeting_password: meetingPassword,
        start_time: startTime || null,
        details: details || null,
        allowed_plans: allowedPlans,
      };

      const res = await fetch("/api/admin/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create meeting");

      setMessage("Meeting created successfully.");
      setTitle("");
      setMeetingNumber("");
      setMeetingPassword("");
      setStartTime("");
      setDetails("");
      setAllowedPlans([]);
    } catch (err: any) {
      setMessage(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 ">
      <Navigation />
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow mt-8">
        <h1 className="mb-4 text-2xl font-bold">Admin — Create Meeting</h1>
        <p className="mb-6 text-sm text-zinc-600">Create a Zoom meeting entry. Codes are validated separately by clients.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admin no longer provides access codes; clients present codes at validation time. */}

          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Session title" className="w-full rounded border px-3 py-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Meeting Number</label>
            <input value={meetingNumber} onChange={(e) => setMeetingNumber(e.target.value.replace(/\s/g, ''))} required placeholder="Zoom meeting number" className="w-full rounded border px-3 py-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Meeting Password</label>
            <input value={meetingPassword} onChange={(e) => setMeetingPassword(e.target.value)} placeholder="Password (optional)" className="w-full rounded border px-3 py-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Start Time</label>
            <input value={startTime} onChange={(e) => setStartTime(e.target.value)} type="datetime-local" className="w-full rounded border px-3 py-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Event Description</label>
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Event description" className="w-full rounded border px-3 py-2" rows={4} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Allowed Plans (Access Control)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
              {availablePlans.map((plan) => (
                <label key={plan} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={allowedPlans.includes(plan)}
                    onChange={() => handlePlanToggle(plan)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-zinc-300"
                  />
                  <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">{plan}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-zinc-500 italic">Select which training plans can view and join this meeting.</p>
          </div>

          <div className="flex items-center gap-3">
            <button disabled={isLoading} className="rounded bg-rose-600 px-4 py-2 text-white disabled:opacity-50">{isLoading ? "Creating..." : "Create Meeting"}</button>
            <button type="button" onClick={() => { setTitle(""); setMeetingNumber(""); setMeetingPassword(""); setStartTime(""); setDetails(""); setAllowedPlans([]); setMessage(null); }} className="rounded border px-4 py-2">Reset</button>
          </div>

          {message && (
            <div className="mt-4 rounded bg-zinc-100 p-3 text-sm">{message}</div>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
}
