import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://slcpldoaaagkoozpbjsk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY3BsZG9hYWFna29venBianNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3OTM0MjEsImV4cCI6MjA5NDM2OTQyMX0.g0iLhliFQNlD3Ey_mrvwMolppj-nV24Pj9klrFtsLWo"
);

function getUserKey() {
  let key = localStorage.getItem("tipim-user-key");
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem("tipim-user-key", key);
  }
  return key;
}

export async function loadPersonalTips() {
  const userKey = getUserKey();
  const { data, error } = await supabase
    .from("tipim_personal_tips")
    .select("topic, text, source, category")
    .eq("user_key", userKey)
    .order("created_at", { ascending: true });
  if (error) {
    console.warn("Failed to load tips from Supabase:", error.message);
    return null;
  }
  return data;
}

export async function savePersonalTip(tip) {
  const userKey = getUserKey();
  const { error } = await supabase
    .from("tipim_personal_tips")
    .insert({ user_key: userKey, ...tip });
  if (error) {
    console.warn("Failed to save tip to Supabase:", error.message);
  }
}

export async function clearPersonalTips() {
  const userKey = getUserKey();
  const { error } = await supabase
    .from("tipim_personal_tips")
    .delete()
    .eq("user_key", userKey);
  if (error) {
    console.warn("Failed to clear tips from Supabase:", error.message);
  }
}
