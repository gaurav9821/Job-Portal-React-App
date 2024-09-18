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

export async function getSingleJob(token, { job_id }) {
  const supabase = await supaBaseClient(token);

  const { data, error: getError } = await supabase
    .from("jobs")
    .select("*,company:companies(name,logo_url),applications:applications(*)")
    .eq("id", job_id)
    .single();

  if (getError) {
    console.log("Error in Fetching job data", getError);
    return null;
  }
  return data;
}

export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supaBaseClient(token);

  const { data, error: getError } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (getError) {
    console.log("Error in Updating job data", getError);
    return null;
  }
  return data;
}

export async function addNewJob(token, _, jobData) {
  const supabase = await supaBaseClient(token);

  const { data, error: addError } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (addError) {
    console.log("Error in Inserting job data", addError);
    return null;
  }
  return data;
}

export async function getSavedJobs(token) {
  const supabase = await supaBaseClient(token);

  const { data, error: addError } = await supabase
    .from("saved_jobs")
    .select("*,job:jobs(*,company:companies(name,logo_url))");

  if (addError) {
    console.log("Error Fetching Saved Jobs", addError);
    return null;
  }
  return data;
}

export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supaBaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*,company:companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.log("Error Fetching Jobs", error);
    return null;
  }
  return data;
}

export async function deleteJob(token, { job_id }) {
  const supabase = await supaBaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.log("Error Deleting Job", error);
    return null;
  }
  return data;
}
