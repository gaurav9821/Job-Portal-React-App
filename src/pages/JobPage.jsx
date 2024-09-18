import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import ApplicationCard from "@/components/ApplicationCard";
import ApplyJobDrawer from "@/components/ApplyJob";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const JobPage = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    fn: fnJobs,
    data: jobData,
    loading: loadingJob,
  } = useFetch(getSingleJob, { job_id: id });

  const { fn: fnHiringStatus, loading: loadingHiringStatus } = useFetch(
    updateHiringStatus,
    { job_id: id }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJobs());
  };

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  console.log(jobData);

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {jobData?.title}
        </h1>
        <img
          src={jobData?.company?.logo_url}
          className="h-12"
          alt={jobData?.title}
        />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {jobData?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase />
          {jobData?.applications?.length} Applicants
        </div>
        <div className="flex gap-2">
          {jobData?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed />
              Closed
            </>
          )}
        </div>
      </div>

      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {jobData?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${
              jobData?.isOpen ? "bg-green-950" : "bg-red-950"
            }`}
          >
            <SelectValue
              placeholder={`Hiring Status ${
                jobData?.isOpen ? "Open" : "(Closed)"
              }`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the Job</h2>
      <p className="sm:text-lg">{jobData?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={jobData?.requirements}
        className="bg-transparent sm:text-lg"
      />

      {jobData?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={jobData}
          user={user}
          fetchJob={fnJobs}
          applied={jobData?.applications?.find(
            (ap) => ap.candidate_id === user.id
          )}
        />
      )}
      {jobData?.applications.length > 0 &&
        jobData?.recruiter_id === user?.id && (
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
            {jobData?.applications.map((application) => {
              return (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              );
            })}
          </div>
        )}
    </div>
  );
};

export default JobPage;
