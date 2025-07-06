import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Job } from "../../../../../models/Job";

export async function POST(req) {
  try {
    connectDb();

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId).populate('company');

    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 400 }
      );
    }

    // Generate job summary
    const summary = generateJobSummary(job);

    return NextResponse.json({
      success: true,
      summary: summary,
      message: "Job summary generated successfully"
    });

  } catch (error) {
    console.error("Job Summary Error:", error);
    return NextResponse.json(
      { 
        message: "Failed to generate job summary. Please try again.",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

function generateJobSummary(job) {
  const keywords = extractKeywords(job.description + ' ' + job.title + ' ' + job.role);
  
  let summary = `## Job Summary\n\n`;
  summary += `**Position:** ${job.title}\n`;
  summary += `**Company:** ${job.company?.name || 'Unknown'}\n`;
  summary += `**Location:** ${job.location}\n`;
  summary += `**Experience:** ${job.experience} years\n`;
  summary += `**Salary:** $${job.salary.toLocaleString()}\n`;
  summary += `**Status:** ${job.status}\n\n`;
  
  summary += `## Key Requirements\n`;
  summary += `- **Primary Skills:** ${keywords.slice(0, 5).join(', ')}\n`;
  summary += `- **Experience Level:** ${getExperienceLevel(job.experience)}\n`;
  summary += `- **Job Type:** ${job.status === 'open' ? 'Active Position' : 'Closed'}\n\n`;
  
  summary += `## Quick Overview\n`;
  
  // Generate a brief description based on keywords
  if (keywords.includes('react') || keywords.includes('javascript')) {
    summary += `This is a frontend development role focusing on modern web technologies.\n`;
  } else if (keywords.includes('python') || keywords.includes('java')) {
    summary += `This is a backend development position requiring strong programming skills.\n`;
  } else if (keywords.includes('aws') || keywords.includes('cloud')) {
    summary += `This role involves cloud infrastructure and DevOps responsibilities.\n`;
  } else {
    summary += `This position requires a mix of technical and professional skills.\n`;
  }
  
  summary += `\n## Key Technologies\n`;
  keywords.slice(0, 8).forEach(keyword => {
    summary += `- ${keyword}\n`;
  });
  
  summary += `\n## Application Status\n`;
  if (job.status === 'open') {
    summary += `✅ **Position is currently open for applications**\n`;
  } else {
    summary += `❌ **Position is currently closed**\n`;
  }
  
  return {
    title: job.title,
    company: job.company?.name,
    location: job.location,
    experience: job.experience,
    salary: job.salary,
    status: job.status,
    keywords: keywords,
    summary: summary,
    quickOverview: {
      role: job.title,
      company: job.company?.name,
      experience: `${job.experience} years`,
      salary: `$${job.salary.toLocaleString()}`,
      location: job.location,
      status: job.status
    }
  };
}

function extractKeywords(text) {
  const commonKeywords = [
    'javascript', 'react', 'node.js', 'python', 'java', 'sql', 'mongodb',
    'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum', 'api',
    'html', 'css', 'typescript', 'graphql', 'redux', 'express',
    'postgresql', 'mysql', 'redis', 'elasticsearch', 'kafka',
    'machine learning', 'ai', 'data science', 'analytics',
    'project management', 'leadership', 'communication',
    'problem solving', 'teamwork', 'collaboration'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  const keywords = new Set();
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 2 && commonKeywords.includes(cleanWord)) {
      keywords.add(cleanWord);
    }
  });
  
  return Array.from(keywords);
}

function getExperienceLevel(years) {
  if (years === 0) return 'Entry Level (Fresher)';
  if (years <= 2) return 'Junior Level';
  if (years <= 5) return 'Mid Level';
  if (years <= 8) return 'Senior Level';
  return 'Expert Level';
} 