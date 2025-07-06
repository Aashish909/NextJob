"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { BriefcaseBusiness, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { ApplyForJob } from "@/redux/action/job";
import Image from "next/image";

const JobCard = ({ job }) => {
  const { user } = useSelector((state) => state.user);

  const { btnLoading, applications } = useSelector((state) => state.job);

  const dispatch = useDispatch();

  const applyHandler = () => {
    dispatch(ApplyForJob(job._id));
  };

  const [applied, setapplied] = useState(false);

  useEffect(() => {
    if (applications && job._id) {
      applications.forEach((item) => item.job === job._id && setapplied(true));
    }
  }, [applications, job._id]);
  return (
    <Card className="w-[350px] hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-gray-300">
      <CardHeader>
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 mb-1">
              {job.title}
            </CardTitle>
            {job.company?.name && (
              <p className="text-sm text-gray-600 font-medium mb-2">
                {job.company.name}
              </p>
            )}
          </div>
          <Link href={`/company/${job.company?._id || job.company}`}>
            <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm overflow-hidden">
              {(job.company?.logo || job.comapnyLogo) ? (
                <img
                  src={job.company?.logo || job.comapnyLogo}
                  alt={`${job.company?.name || 'Company'} logo`}
                  className="max-w-[70%] max-h-[70%] object-contain"
                  style={{ display: 'block' }}
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg hidden">
                {job.company?.name?.charAt(0)?.toUpperCase() || 'C'}
              </div>
            </div>
          </Link>
        </div>
        <CardDescription className="flex items-center gap-2">
          {job.experience === 0 ? (
            <>
              <BriefcaseBusiness /> <p>Fresher</p>
            </>
          ) : (
            <>
              <BriefcaseBusiness /> {job.experience} Years
            </>
          )}
        </CardDescription>
        <CardDescription className="flex items-center gap-2">
          <MapPin /> {job.location}
        </CardDescription>
        <CardDescription>₹ {job.salary} P.A</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm leading-relaxed">
          {job.description.length > 80 
            ? `${job.description.slice(0, 80)}...` 
            : job.description
          }
        </p>
      </CardContent>

      <CardFooter className="flex justify-between pt-4">
        <Link href={`/jobs/${job._id}`}>
          <Button variant="outline" className="hover:bg-gray-50">
            View Detail
          </Button>
        </Link>

        {user && user.role === "jobseeker" && (
          <>
            {applied ? (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Already Applied
              </div>
            ) : (
              <>
                {job.status === "closed" ? (
                  <div className="flex items-center gap-2 text-red-600 font-medium">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Position Closed
                  </div>
                ) : (
                  <Button 
                    onClick={applyHandler} 
                    disabled={btnLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Easy Apply
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
