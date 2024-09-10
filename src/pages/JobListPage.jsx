import { getJobs } from "@/api/apiJobs";
import useFetch from "../hooks/useFetch";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/JobCard";

const JobListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [companyId, setCompanyId] = useState("");

  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: jobData,
    loading: loadingJob,
  } = useFetch(getJobs, { location, companyId, searchQuery });

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, searchQuery, companyId, location]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {loadingJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJob === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobData?.length ? (
            jobData.map((job, index) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInt={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListPage;
