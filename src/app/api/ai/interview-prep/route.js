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

    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 400 }
      );
    }

    // Generate interview preparation
    const interviewPrep = generateInterviewPrep(loggedInUser, job);

    return NextResponse.json({
      success: true,
      interviewPrep: interviewPrep,
      message: "Interview preparation generated successfully"
    });

  } catch (error) {
    console.error("Interview Prep Error:", error);
    return NextResponse.json(
      { 
        message: "Failed to generate interview preparation. Please try again.",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

function generateInterviewPrep(user, job) {
  const jobKeywords = extractKeywords(job.description + ' ' + job.title + ' ' + job.role);
  const userSkills = user.skills || [];
  const companyName = job.company?.name || 'the company';
  
  let prep = `## Interview Preparation Guide\n\n`;
  prep += `**Position:** ${job.title}\n`;
  prep += `**Company:** ${companyName}\n`;
  prep += `**Experience Level:** ${job.experience} years\n\n`;
  
  // Technical Questions
  prep += `## Technical Questions to Expect\n\n`;
  
  const technicalQuestions = generateTechnicalQuestions(jobKeywords, job.experience);
  technicalQuestions.forEach((q, index) => {
    prep += `${index + 1}. **${q.question}**\n`;
    prep += `   - *Focus on:* ${q.focus}\n`;
    prep += `   - *Sample Answer:* ${q.sampleAnswer}\n\n`;
  });
  
  // Behavioral Questions
  prep += `## Behavioral Questions\n\n`;
  
  const behavioralQuestions = [
    {
      question: "Tell me about a challenging project you worked on",
      focus: "Problem-solving, teamwork, and results",
      sampleAnswer: "Describe a specific project, the challenges faced, your role, and the outcome with metrics if possible."
    },
    {
      question: "How do you handle tight deadlines?",
      focus: "Time management and stress handling",
      sampleAnswer: "Explain your prioritization method and give a specific example of meeting a deadline."
    },
    {
      question: "Describe a time you had to learn a new technology quickly",
      focus: "Learning ability and adaptability",
      sampleAnswer: "Share a specific instance, your learning approach, and how you applied the new knowledge."
    },
    {
      question: "How do you handle conflicts in a team?",
      focus: "Communication and conflict resolution",
      sampleAnswer: "Explain your approach to resolving conflicts professionally and maintaining team harmony."
    }
  ];
  
  behavioralQuestions.forEach((q, index) => {
    prep += `${index + 1}. **${q.question}**\n`;
    prep += `   - *Focus on:* ${q.focus}\n`;
    prep += `   - *Sample Answer:* ${q.sampleAnswer}\n\n`;
  });
  
  // Company-Specific Tips
  prep += `## Company-Specific Preparation\n\n`;
  prep += `### Research Points\n`;
  prep += `- Company mission and values\n`;
  prep += `- Recent news and developments\n`;
  prep += `- Company culture and work environment\n`;
  prep += `- Products/services offered\n`;
  prep += `- Competitors and market position\n\n`;
  
  prep += `### Questions to Ask\n`;
  prep += `1. "What does success look like for this role in the first 6 months?"\n`;
  prep += `2. "What are the biggest challenges the team is currently facing?"\n`;
  prep += `3. "How does the company support professional development?"\n`;
  prep += `4. "What's the typical career progression for someone in this role?"\n`;
  prep += `5. "Can you tell me about the team I'll be working with?"\n\n`;
  
  // Skills Assessment
  prep += `## Skills Assessment\n\n`;
  prep += `### Your Strong Skills\n`;
  const strongSkills = userSkills.filter(skill => 
    jobKeywords.some(keyword => skill.toLowerCase().includes(keyword.toLowerCase()))
  );
  
  if (strongSkills.length > 0) {
    strongSkills.forEach(skill => {
      prep += `- ✅ ${skill}\n`;
    });
  } else {
    prep += `- Focus on transferable skills and learning ability\n`;
  }
  
  prep += `\n### Skills to Highlight\n`;
  const missingSkills = jobKeywords.filter(keyword => 
    !userSkills.some(skill => skill.toLowerCase().includes(keyword.toLowerCase()))
  ).slice(0, 3);
  
  if (missingSkills.length > 0) {
    missingSkills.forEach(skill => {
      prep += `- 🔄 ${skill} (mention willingness to learn)\n`;
    });
  }
  
  // Interview Tips
  prep += `\n## General Interview Tips\n\n`;
  prep += `### Before the Interview\n`;
  prep += `- Research the company thoroughly\n`;
  prep += `- Review the job description multiple times\n`;
  prep += `- Prepare your portfolio and code samples\n`;
  prep += `- Practice common questions out loud\n`;
  prep += `- Prepare questions to ask the interviewer\n\n`;
  
  prep += `### During the Interview\n`;
  prep += `- Use the STAR method for behavioral questions\n`;
  prep += `- Be specific with examples and metrics\n`;
  prep += `- Show enthusiasm and genuine interest\n`;
  prep += `- Ask thoughtful questions\n`;
  prep += `- Be honest about what you don't know\n\n`;
  
  prep += `### After the Interview\n`;
  prep += `- Send a thank-you email within 24 hours\n`;
  prep += `- Follow up on any promised information\n`;
  prep += `- Reflect on what went well and what to improve\n\n`;
  
  return {
    content: prep,
    metadata: {
      jobTitle: job.title,
      companyName: companyName,
      experienceLevel: job.experience,
      technicalQuestions: technicalQuestions,
      behavioralQuestions: behavioralQuestions,
      strongSkills: strongSkills,
      missingSkills: missingSkills,
      generatedAt: new Date().toISOString()
    }
  };
}

function generateTechnicalQuestions(keywords, experience) {
  const questions = [];
  
  // React/JavaScript questions
  if (keywords.includes('react') || keywords.includes('javascript')) {
    questions.push({
      question: "Explain React hooks and their lifecycle",
      focus: "Understanding of React fundamentals",
      sampleAnswer: "Discuss useState, useEffect, and custom hooks with practical examples."
    });
    
    if (experience >= 3) {
      questions.push({
        question: "How would you optimize a React application?",
        focus: "Performance optimization and best practices",
        sampleAnswer: "Mention code splitting, memoization, lazy loading, and bundle optimization."
      });
    }
  }
  
  // Backend questions
  if (keywords.includes('node.js') || keywords.includes('python')) {
    questions.push({
      question: "Explain RESTful API design principles",
      focus: "API design and architecture",
      sampleAnswer: "Discuss HTTP methods, status codes, resource naming, and statelessness."
    });
  }
  
  // Database questions
  if (keywords.includes('mongodb') || keywords.includes('sql')) {
    questions.push({
      question: "How would you design a database schema for this project?",
      focus: "Database design and relationships",
      sampleAnswer: "Discuss normalization, indexing, and choosing between SQL and NoSQL."
    });
  }
  
  // Cloud/DevOps questions
  if (keywords.includes('aws') || keywords.includes('docker')) {
    questions.push({
      question: "Explain your experience with cloud deployment",
      focus: "DevOps and infrastructure knowledge",
      sampleAnswer: "Discuss CI/CD, containerization, and cloud services you've used."
    });
  }
  
  // General programming questions
  questions.push({
    question: "How do you handle debugging and troubleshooting?",
    focus: "Problem-solving approach",
    sampleAnswer: "Explain your systematic approach: reproduce, isolate, fix, test, and document."
  });
  
  return questions.slice(0, 5); // Return top 5 questions
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