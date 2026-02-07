
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ioxbjhzoxzkkpxbvlhfs.supabase.co";
const supabaseKey = "sb_publishable_g_sqeTFY9xaELtjoexcmaA_sQWeF5nG";

export const supabase = createClient(supabaseUrl, supabaseKey);
        