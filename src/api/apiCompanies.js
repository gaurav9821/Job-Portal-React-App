import supaBaseClient from "@/components/utils/supabase";

export async function getCompanies(token) {
  const supabase = await supaBaseClient(token);

  const { data, error: getError } = await supabase
    .from("companies")
    .select("*");

  if (getError) {
    console.log("Error in Fetching companies data", getError);
    return null;
  }
  return data;
}
