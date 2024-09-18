import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyToJob } from "@/api/apiApplications";
import useFetch from "@/hooks/useFetch";
import { BarLoader } from "react-spinners";

//Zod is a validation library which checks the value we provided in the form is correct or not
const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type == "application/pdf" ||
          file[0].type == "application/msword"),
      {
        message: "Only PDF or Word Document are allowed",
      }
    ),
});

const ApplyJobDrawer = ({ job, user, fetchJob, applied = false }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  const {
    fn: fnApplyJob,
    error: applyJobError,
    loading: loadingApplyJob,
  } = useFetch(applyToJob);

  function onSubmitForm(jobData) {
    console.log("-->", jobData);
    console.log("--<<", user);

    fnApplyJob({
      ...jobData,
      job_id: job?.id,
      candidate_id: user?.id,
      name: user?.fullName,
      status: "Applied",
      resume: jobData.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  }

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied}
        >
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job?.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription>Please fill the form below.</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="flex flex-col gap-4 p-4 -b-0"
        >
          <Input
            type="number"
            placeholder="Years of Experience"
            className="flex-1"
            {...register("experience", {
              valueAsNumber: true,
            })}
          />
          {errors.experience && (
            <p className="text-red-500">{errors?.experience?.message}</p>
          )}

          <Input
            type="text"
            placeholder="Skills (Comma Seperated)"
            className="flex-1"
            {...register("skills")}
          />

          {errors.skills && (
            <p className="text-red-500">{errors?.skills?.message}</p>
          )}

          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="graduate" />
                  <Label htmlFor="graduate">Graduate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post Graduate" id="post-graduate" />
                  <Label htmlFor="post-graduate">Post Graduate</Label>
                </div>
              </RadioGroup>
            )}
          />

          {errors?.education && (
            <p className="text-red-500">{errors?.education?.message}</p>
          )}

          <Input
            type="file"
            placeholder=".pdf .doc .docx"
            className="flex-1 file:text-gray-500"
            {...register("resume")}
          />

          {errors?.resume && (
            <p className="text-red-500">{errors?.resume?.message}</p>
          )}

          {applyJobError?.message && (
            <p className="text-red-500">{errors?.resume?.message}</p>
          )}

          {loadingApplyJob && (
            <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
          )}

          <Button type="submit" variant="blue" size="lg">
            Apply
          </Button>
        </form>

        <DrawerFooter>
          {/* <Button>Submit</Button> */}
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;
