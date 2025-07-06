"use client";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Info from "./(component)/Info";
import Loading from "@/components/loading";
import Skill from "./(component)/Skill";
import Company from "./(component)/Company";
import SavedJob from "./(component)/SavedJob";
import AppliedJobs from "./(component)/AppliedJobs";

const Account = () => {
  const { isAuth, user, btnLoading, loading } = useSelector(
    (state) => state.user
  );
  const { jobs, applications } = useSelector((state) => state.job);

  const [savedJobs, setsavedJobs] = useState([]);

  useEffect(() => {
    if (jobs && user && Array.isArray(jobs) && Array.isArray(user.savedJobs)) {
      const savedJobArray = jobs.filter((job) =>
        user.savedJobs.includes(job._id)
      );
      setsavedJobs(savedJobArray);
    }
  }, [jobs, user]);

  if (!isAuth) return redirect("/login");

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          {user && (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  My Profile
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your account and professional information
                </p>
              </div>

              {/* Main Content */}
              <div className="space-y-8">
                {/* Profile Information */}
                <Info user={user} btnLoading={btnLoading} />

                {/* Skills Section for Job Seekers */}
                {user.role === "jobseeker" && (
                  <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                    <Skill user={user} btnLoading={btnLoading} />
                  </div>
                )}

                {/* Company Section for Recruiters */}
                {user.role === "recruiter" && (
                  <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                    <Company />
                  </div>
                )}

                {/* Saved Jobs Section for Job Seekers */}
                {user.role === "jobseeker" && (
                  <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                    <SavedJob savedJobs={savedJobs} />
                  </div>
                )}

                {/* Applied Jobs Section for Job Seekers */}
                {user.role === "jobseeker" && (
                  <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                    <AppliedJobs jobs={applications} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Account;
