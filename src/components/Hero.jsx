import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="bg-secondary/10 py-20">
      <div className="container mx-auto max-w-7xl px-6 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            <span className="text-primary">NextJob</span> <br />
            <span className="text-gray-800">
              Your gateway to career success
            </span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Discover your dream job effortlessly. Explore thousands of
            opportunities, connect with top employers, and take control of your
            career with NextJob — your one-stop job solution.
          </p>
          <div className="flex justify-center md:justify-start gap-4 pt-4">
            <Link href="/jobs">
              <Button size="lg">Browse Jobs</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                About Us
              </Button>
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 w-full">
          <img
            className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
            src="/hero.jpeg"
            alt="hero image"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
