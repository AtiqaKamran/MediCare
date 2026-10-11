
import { supabase } from "./supabase";

async function testConnection() {
  const { data, error } = await supabase
    .from("patient_history")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Supabase error:", error.message);
  } else {
    console.log("Supabase connection successful!", data);
  }
}

testConnection();
