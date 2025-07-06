import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";

const locations = [
  "Bangalore",
  "Delhi",
  "Mumbai",
  "India",
  "Remote",
];
const experiences = [
  { label: "Fresher", value: 0 },
  { label: "1 Year", value: 1 },
  { label: "2 Years", value: 2 },
  { label: "3 Years", value: 3 },
  { label: "4 Years", value: 4 },
  { label: "5 Years", value: 5 },
  { label: "6 Years", value: 6 },
  { label: "7 Years", value: 7 },
];

const Hero = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    let url = "/jobs?";
    if (search) url += `search=${encodeURIComponent(search)}`;
    if (location) url += `${url.endsWith("?") ? "" : "&"}location=${encodeURIComponent(location)}`;
    if (experience) url += `${url.endsWith("?") ? "" : "&"}experience=${encodeURIComponent(experience)}`;
    router.push(url);
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-20">
      <div className="container mx-auto max-w-7xl px-6 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-left space-y-8">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            <span className="text-primary">NextJob</span> <br />
            <span className="text-gray-800">
              AI-Powered Career Success
            </span>
          </h1>
          <p className="text-blue-600 text-lg font-semibold mb-2">
            Supercharge your job search with advanced AI tools.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Discover your dream job effortlessly with NextJob's AI-powered platform. Instantly match your resume to job descriptions, get personalized feedback, generate tailored cover letters, and prepare for interviews—all with the help of smart AI. Explore thousands of opportunities, connect with top employers, and take control of your career with NextJob.
          </p>

          {/* Modern Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row items-center gap-3 bg-white/90 rounded-xl shadow-lg p-4 border border-gray-100 mt-6"
          >
            <Input
              type="text"
              placeholder="Search jobs, roles, or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:w-64 w-full"
            />
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="md:w-40 w-full">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger className="md:w-40 w-full">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                {experiences.map((exp) => (
                  <SelectItem key={exp.value} value={exp.value.toString()}>{exp.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="submit"
              size="lg"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
            >
              <span>Search</span>
              <span className="ml-2 px-2 py-0.5 text-xs rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-sm">
                AI Powered
              </span>
            </Button>
          </form>

          <div className="flex justify-center md:justify-start gap-4 pt-4">
            <Link href="/jobs">
              <Button size="lg" variant="secondary">Browse Jobs</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                About Us
              </Button>
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 w-full flex justify-center">
          <Image
            src="/hero.jpeg"
            alt="hero image"
            className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
            width={500}
            height={500}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
