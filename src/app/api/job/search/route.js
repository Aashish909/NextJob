import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Job } from "../../../../../models/Job";
import { Company } from "../../../../../models/Company";

export async function GET(req) {
  try {
    connectDb();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    if (!q) {
      return NextResponse.json({ jobs: [] });
    }

   
    const companies = await Company.find({
      name: { $regex: q, $options: "i" },
    }).select("_id");
    const companyIds = companies.map((c) => c._id);

    // Search jobs by title, description, role, or company
    const jobs = await Job.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { role: { $regex: q, $options: "i" } },
        { company: { $in: companyIds } },
      ],
    }).sort("-createdAt");

    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
} 