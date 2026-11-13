
import { useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function SupabaseTest() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from("patient_history")
        .select("*")
        .limit(1);

      if (error) {
        console.error("Supabase response:", error.message);
      } else {
        console.log("Supabase query successful!", data);
      }
    }

    testConnection();
  }, []);

  return <h2>Supabase connection test</h2>;
}
