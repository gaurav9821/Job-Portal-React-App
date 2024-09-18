import supaBaseClient, { supabaseUrl } from "@/components/utils/supabase";

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

export async function addNewCompany(token, _, companyData) {
  const supabase = await supaBaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData?.name}`;

  const { error: storageError } = await supabase.storage
    .from("company_logos")
    .upload(fileName, companyData.logo);

  if (storageError) throw new Error("Error uploading logo");

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company_logos/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Company");
  }

  return data;
}
