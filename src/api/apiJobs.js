import supaBaseClient from "@/components/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supaBaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*,company:companies(name,logo_url),saved:saved_jobs(id)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.log("Error in fetching data", error);
    return null;
  }

  return data;
}

export async function saveJobs(token, { alreadySaved }, savedData) {
  const supabase = await supaBaseClient(token);

  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", savedData.job_id);

    if (deleteError) {
      console.log("Error in deleting saved job", deleteError);
      return null;
    }
    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([savedData])
      .select();

    if (insertError) {
      console.log("Error in inserting saved job", insertError);
      return null;
    }
    return data;
  }
}
