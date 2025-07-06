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

    // Generate matching analysis
    const analysis = generateResumeJDMatching(loggedInUser, job);

    return NextResponse.json({
      success: true,
      analysis: analysis,
      message: "Resume-JD matching analysis completed"
    });

  } catch (error) {
    console.error("Resume-JD Matching Error:", error);
    return NextResponse.json(
      { 
        message: "Failed to analyze resume-JD matching. Please try again.",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

function generateResumeJDMatching(user, job) {
  const userSkills = user.skills || [];
  const userBio = user.bio || '';
  
  // Extract keywords from job description
  const jobText = (job.description || '') + ' ' + (job.title || '') + ' ' + (job.role || '');
  const userText = (userBio || '') + ' ' + (userSkills || []).join(' ');
  
  const jobKeywords = extractKeywords(jobText);
  const userKeywords = extractKeywords(userText);
  
  // Handle edge cases
  if (jobKeywords.length === 0) {
    return {
      score: 0,
      matchingKeywords: [],
      missingKeywords: [],
      detailedAnalysis: `## Resume-JD Matching Analysis\n\n**Overall Match Score: 0%**\n\n❌ **Unable to analyze** - No keywords found in job description.\n\n## Job Summary\n**Role:** ${job.title}\n**Company:** ${job.company?.name || 'Unknown'}\n**Experience Required:** ${job.experience} years\n**Location:** ${job.location}\n**Salary:** $${job.salary.toLocaleString()}\n`,
      jobSummary: {
        title: job.title,
        company: job.company?.name,
        experience: job.experience,
        location: job.location,
        salary: job.salary
      }
    };
  }
  
  // Calculate matching score with better logic
  const matchingKeywords = jobKeywords.filter(keyword => 
    userKeywords.some(userKeyword => 
      userKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(userKeyword.toLowerCase()) ||
      userKeyword.toLowerCase() === keyword.toLowerCase()
    )
  );
  
  // Calculate score with fallback for edge cases
  let score = 0;
  if (jobKeywords.length > 0) {
    score = Math.round((matchingKeywords.length / jobKeywords.length) * 100);
  }
  
  // Ensure score is a valid number
  if (isNaN(score) || score < 0) score = 0;
  if (score > 100) score = 100;
  
  // Find missing keywords
  const missingKeywords = jobKeywords.filter(keyword => 
    !matchingKeywords.includes(keyword)
  ).slice(0, 5); // Top 5 missing keywords
  
  // Generate detailed analysis
  let analysis = `## Resume-JD Matching Analysis\n\n`;
  analysis += `**Overall Match Score: ${score}%**\n\n`;
  
  if (score >= 80) {
    analysis += `🎉 **Excellent Match!** Your resume aligns very well with this job description.\n\n`;
  } else if (score >= 60) {
    analysis += `👍 **Good Match** Your resume has good alignment with the job requirements.\n\n`;
  } else if (score >= 40) {
    analysis += `⚠️ **Moderate Match** Consider improving your resume to better match this role.\n\n`;
  } else if (score >= 20) {
    analysis += `❌ **Low Match** Your resume needs significant improvements for this role.\n\n`;
  } else {
    analysis += `❌ **Very Low Match** Your resume needs major improvements or this role may not be a good fit.\n\n`;
  }
  
  analysis += `## Matching Keywords (${matchingKeywords.length} found)\n`;
  if (matchingKeywords.length > 0) {
    matchingKeywords.forEach(keyword => {
      analysis += `- ✅ ${keyword}\n`;
    });
  } else {
    analysis += `- No matching keywords found\n`;
  }
  
  if (missingKeywords.length > 0) {
    analysis += `\n## Missing Keywords (Consider adding)\n`;
    missingKeywords.forEach(keyword => {
      analysis += `- ❌ ${keyword}\n`;
    });
  }
  
  analysis += `\n## Recommendations\n`;
  
  if (score < 20) {
    analysis += `- This role may not be a good fit for your current skillset\n`;
    analysis += `- Consider applying to roles that better match your experience\n`;
    analysis += `- Focus on developing skills relevant to this type of position\n`;
  } else if (score < 40) {
    analysis += `- Add the missing keywords to your resume\n`;
    analysis += `- Include specific examples of your experience with these technologies\n`;
    analysis += `- Update your skills section to match job requirements\n`;
    analysis += `- Consider taking courses or certifications in the missing areas\n`;
  } else if (score < 60) {
    analysis += `- Fine-tune your resume with the missing keywords\n`;
    analysis += `- Add more specific achievements related to the job requirements\n`;
    analysis += `- Highlight relevant projects and experiences\n`;
  } else if (score < 80) {
    analysis += `- Your resume is well-aligned! Focus on customizing your cover letter\n`;
    analysis += `- Highlight your most relevant experiences in your application\n`;
    analysis += `- Consider adding any missing keywords if relevant\n`;
  } else {
    analysis += `- Your resume is excellently aligned! Focus on customizing your cover letter\n`;
    analysis += `- Highlight your most relevant experiences in your application\n`;
    analysis += `- You're well-positioned for this role\n`;
  }
  
  analysis += `\n## Job Summary\n`;
  analysis += `**Role:** ${job.title}\n`;
  analysis += `**Company:** ${job.company?.name || 'Unknown'}\n`;
  analysis += `**Experience Required:** ${job.experience} years\n`;
  analysis += `**Location:** ${job.location}\n`;
  analysis += `**Salary:** $${job.salary.toLocaleString()}\n`;
  
  return {
    score: score,
    matchingKeywords: matchingKeywords,
    missingKeywords: missingKeywords,
    detailedAnalysis: analysis,
    jobSummary: {
      title: job.title,
      company: job.company?.name,
      experience: job.experience,
      location: job.location,
      salary: job.salary
    }
  };
}

function extractKeywords(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Common technical keywords and skills
  const commonKeywords = [
    'javascript', 'react', 'node.js', 'nodejs', 'python', 'java', 'sql', 'mongodb',
    'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum', 'api',
    'html', 'css', 'typescript', 'graphql', 'redux', 'express',
    'postgresql', 'mysql', 'redis', 'elasticsearch', 'kafka',
    'machine learning', 'ai', 'data science', 'analytics',
    'project management', 'leadership', 'communication',
    'problem solving', 'teamwork', 'collaboration', 'next.js', 'nextjs',
    'vue', 'angular', 'php', 'c++', 'c#', 'dotnet', '.net',
    'spring', 'django', 'flask', 'fastapi', 'laravel', 'wordpress',
    'jquery', 'bootstrap', 'tailwind', 'sass', 'less', 'webpack',
    'babel', 'jest', 'mocha', 'cypress', 'selenium', 'jenkins',
    'ci/cd', 'devops', 'microservices', 'rest', 'soap', 'xml',
    'json', 'yaml', 'toml', 'nginx', 'apache', 'linux', 'unix',
    'windows', 'macos', 'ios', 'android', 'flutter', 'react native',
    'swift', 'kotlin', 'go', 'rust', 'scala', 'r', 'matlab',
    'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
    'tableau', 'powerbi', 'excel', 'google analytics', 'seo',
    'ux', 'ui', 'design', 'figma', 'sketch', 'adobe', 'photoshop',
    'illustrator', 'invision', 'zeplin', 'jira', 'confluence',
    'slack', 'teams', 'zoom', 'meet', 'trello', 'asana', 'notion'
  ];
  
  // Clean and normalize text
  const cleanText = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace special characters with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
  
  const words = cleanText.split(/\s+/);
  const keywords = new Set();
  
  // Extract single word keywords
  words.forEach(word => {
    const cleanWord = word.trim();
    if (cleanWord.length > 2 && commonKeywords.includes(cleanWord)) {
      keywords.add(cleanWord);
    }
  });
  
  // Extract multi-word keywords (like "machine learning", "data science")
  const multiWordKeywords = [
    'machine learning', 'data science', 'artificial intelligence',
    'deep learning', 'natural language processing', 'computer vision',
    'cloud computing', 'software development', 'web development',
    'mobile development', 'full stack', 'frontend', 'backend',
    'database administration', 'system administration', 'network security',
    'cyber security', 'information technology', 'quality assurance',
    'user experience', 'user interface', 'product management',
    'business analysis', 'data analysis', 'market research',
    'customer service', 'sales', 'marketing', 'finance', 'accounting',
    'human resources', 'operations', 'logistics', 'supply chain'
  ];
  
  multiWordKeywords.forEach(keyword => {
    if (cleanText.includes(keyword)) {
      keywords.add(keyword);
    }
  });
  
  // Extract common programming patterns and frameworks
  const patterns = [
    /react\.?js/gi, /node\.?js/gi, /next\.?js/gi, /vue\.?js/gi,
    /angular\.?js/gi, /express\.?js/gi, /mongodb/gi, /postgresql/gi,
    /mysql/gi, /redis/gi, /aws/gi, /docker/gi, /kubernetes/gi,
    /git/gi, /github/gi, /gitlab/gi, /jenkins/gi, /jira/gi,
    /agile/gi, /scrum/gi, /kanban/gi, /devops/gi, /ci\/cd/gi
  ];
  
  patterns.forEach(pattern => {
    const matches = cleanText.match(pattern);
    if (matches) {
      matches.forEach(match => keywords.add(match.toLowerCase()));
    }
  });
  
  return Array.from(keywords);
} 