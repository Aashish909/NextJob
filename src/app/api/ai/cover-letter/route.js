import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import CheckAuth from "../../../../../middlewares/isAuth";
import { User } from "../../../../../models/User";
import { Job } from "../../../../../models/Job";

export async function POST(req) {
  try {
    connectDb();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const jobId = searchParams.get("jobId");
    const tone = searchParams.get("tone") || "professional";

    const user = await CheckAuth(token);

    if (!user) {
      return NextResponse.json(
        { message: "Please Login" },
        { status: 400 }
      );
    }

    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 }
      );
    }

    const loggedInUser = await User.findById(user._id);
    const job = await Job.findById(jobId).populate('company');

    if (!loggedInUser.resume) {
      return NextResponse.json(
        { message: "Please upload a resume first" },
        { status: 400 }
      );
    }

    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 400 }
      );
    }

    // Generate cover letter
    const coverLetter = generateCoverLetter(loggedInUser, job, tone);

    return NextResponse.json({
      success: true,
      coverLetter: coverLetter,
      message: "Cover letter generated successfully"
    });

  } catch (error) {
    console.error("Cover Letter Error:", error);
    return NextResponse.json(
      { 
        message: "Failed to generate cover letter. Please try again.",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

function generateCoverLetter(user, job, tone) {
  const userSkills = user.skills || [];
  const userBio = user.bio || '';
  const companyName = job.company?.name || 'your company';
  const jobTitle = job.title;
  const jobLocation = job.location;
  
  // Extract relevant skills for this job
  const jobKeywords = extractKeywords(job.description + ' ' + job.title);
  const relevantSkills = userSkills.filter(skill => 
    jobKeywords.some(keyword => 
      skill.toLowerCase().includes(keyword.toLowerCase())
    )
  );
  
  let coverLetter = `## Cover Letter\n\n`;
  coverLetter += `**To:** Hiring Manager\n`;
  coverLetter += `**Position:** ${jobTitle}\n`;
  coverLetter += `**Company:** ${companyName}\n\n`;
  
  // Opening paragraph
  coverLetter += `Dear Hiring Manager,\n\n`;
  
  if (tone === "enthusiastic") {
    coverLetter += `I am thrilled to apply for the ${jobTitle} position at ${companyName}! With my passion for technology and proven track record in ${relevantSkills.slice(0, 3).join(', ')}, I am excited about the opportunity to contribute to your team.\n\n`;
  } else if (tone === "formal") {
    coverLetter += `I am writing to express my interest in the ${jobTitle} position at ${companyName}. With ${job.experience}+ years of experience in ${relevantSkills.slice(0, 2).join(' and ')}, I believe I am well-qualified for this role.\n\n`;
  } else {
    coverLetter += `I am excited to apply for the ${jobTitle} position at ${companyName}. My background in ${relevantSkills.slice(0, 3).join(', ')} aligns perfectly with the requirements of this role.\n\n`;
  }
  
  // Body paragraph
  coverLetter += `## Why I'm a Great Fit\n\n`;
  
  if (relevantSkills.length > 0) {
    coverLetter += `My expertise in ${relevantSkills.join(', ')} directly relates to the technical requirements of this position. `;
  }
  
  if (userBio) {
    coverLetter += `${userBio} `;
  }
  
  coverLetter += `I am particularly drawn to this opportunity because it combines my technical skills with the chance to work on innovative projects at ${companyName}.\n\n`;
  
  // Skills and achievements
  coverLetter += `## Key Qualifications\n\n`;
  coverLetter += `- **Technical Skills:** ${userSkills.slice(0, 5).join(', ')}\n`;
  coverLetter += `- **Experience Level:** ${job.experience}+ years in the field\n`;
  coverLetter += `- **Location:** Available for ${jobLocation} position\n`;
  coverLetter += `- **Availability:** Ready to start immediately\n\n`;
  
  // Closing paragraph
  coverLetter += `## Closing\n\n`;
  
  if (tone === "enthusiastic") {
    coverLetter += `I am incredibly excited about the possibility of joining the ${companyName} team and contributing to your continued success. I would love the opportunity to discuss how my skills and enthusiasm can benefit your organization.\n\n`;
  } else if (tone === "formal") {
    coverLetter += `I am confident that my qualifications and experience make me an excellent candidate for this position. I look forward to discussing how I can contribute to the success of ${companyName}.\n\n`;
  } else {
    coverLetter += `I am confident that my background and skills make me an excellent candidate for this role. I look forward to the opportunity to discuss how I can contribute to ${companyName}'s success.\n\n`;
  }
  
  coverLetter += `Thank you for considering my application. I look forward to hearing from you.\n\n`;
  coverLetter += `Sincerely,\n`;
  coverLetter += `${user.name}\n`;
  coverLetter += `${user.email}\n`;
  coverLetter += `${user.phoneNumber}\n`;
  
  return {
    content: coverLetter,
    metadata: {
      jobTitle: jobTitle,
      companyName: companyName,
      userSkills: userSkills,
      relevantSkills: relevantSkills,
      tone: tone,
      generatedAt: new Date().toISOString()
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