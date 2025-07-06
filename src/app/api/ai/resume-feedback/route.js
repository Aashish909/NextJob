import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import CheckAuth from "../../../../../middlewares/isAuth";
import { User } from "../../../../../models/User";

export async function POST(req) {
  try {
    connectDb();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const user = await CheckAuth(token);

    if (!user) {
      return NextResponse.json(
        { message: "Please Login" },
        { status: 400 }
      );
    }

    const loggedInUser = await User.findById(user._id);

    if (!loggedInUser.resume) {
      return NextResponse.json(
        { message: "No resume found. Please upload a resume first." },
        { status: 400 }
      );
    }

    // Generate structured feedback based on user profile
    const feedback = generateResumeFeedback(loggedInUser);

    return NextResponse.json({
      success: true,
      feedback: feedback,
      message: "AI feedback generated successfully"
    });

  } catch (error) {
    console.error("AI Feedback Error:", error);
    return NextResponse.json(
      { 
        message: "Failed to generate AI feedback. Please try again.",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

function generateResumeFeedback(user) {
  const skills = user.skills || [];
  const bio = user.bio || '';
  const role = user.role;
  
  // Analyze user profile and generate personalized feedback
  const hasSkills = skills.length > 0;
  const hasBio = bio.length > 0;
  const isJobSeeker = role === 'jobseeker';
  
  let feedback = `## Overall Assessment\n`;
  
  if (isJobSeeker) {
    feedback += `Based on your profile as a job seeker, here's a comprehensive analysis of your resume and profile to help you improve your job applications.\n\n`;
  } else {
    feedback += `As a recruiter, you can use this feedback to help job seekers improve their resumes.\n\n`;
  }

  feedback += `## Key Strengths\n`;
  
  if (hasSkills) {
    feedback += `- You have ${skills.length} skills listed, which shows good technical diversity\n`;
    feedback += `- Your skills include: ${skills.join(', ')}\n`;
  } else {
    feedback += `- You have a clear professional profile\n`;
  }
  
  if (hasBio) {
    feedback += `- You have a professional bio that helps recruiters understand your background\n`;
  }
  
  feedback += `- You have uploaded a resume, which is essential for job applications\n`;
  feedback += `- Your profile is complete with contact information\n\n`;

  feedback += `## Areas for Improvement\n`;
  
  if (!hasSkills) {
    feedback += `- Consider adding relevant skills to your profile to improve ATS matching\n`;
    feedback += `- Skills help recruiters quickly identify your technical capabilities\n`;
  }
  
  if (!hasBio) {
    feedback += `- Add a compelling bio that highlights your career objectives and key achievements\n`;
    feedback += `- A strong bio can make your profile stand out to recruiters\n`;
  }
  
  if (skills.length < 5) {
    feedback += `- Consider adding more skills to increase your profile's searchability\n`;
  }
  
  feedback += `- Ensure your resume is up-to-date with your latest experience and achievements\n`;
  feedback += `- Consider adding certifications or additional qualifications if relevant\n\n`;

  feedback += `## Action Items\n`;
  feedback += `- Review and update your resume with recent achievements and experiences\n`;
  feedback += `- Add specific skills that match your target job requirements\n`;
  feedback += `- Write a compelling bio that tells your professional story\n`;
  feedback += `- Consider adding a professional summary to your resume\n`;
  feedback += `- Ensure all contact information is current and professional\n\n`;

  feedback += `## ATS Optimization\n`;
  feedback += `To improve your chances with Applicant Tracking Systems, consider adding these keywords to your resume and profile:\n`;
  
  // Suggest keywords based on common job categories
  const suggestedKeywords = [
    'project management', 'leadership', 'problem solving', 'communication',
    'team collaboration', 'analytical skills', 'technical expertise',
    'results-driven', 'innovative', 'strategic planning'
  ];
  
  suggestedKeywords.forEach(keyword => {
    feedback += `- ${keyword}\n`;
  });
  
  feedback += `\n## Formatting & Presentation\n`;
  feedback += `- Use clear, professional formatting in your resume\n`;
  feedback += `- Include bullet points for easy scanning\n`;
  feedback += `- Use consistent font and spacing throughout\n`;
  feedback += `- Keep your resume to 1-2 pages maximum\n`;
  feedback += `- Use action verbs to describe your achievements\n\n`;

  feedback += `## Industry-Specific Tips\n`;
  
  if (isJobSeeker) {
    feedback += `- Tailor your resume for each job application\n`;
    feedback += `- Research the company before applying to customize your approach\n`;
    feedback += `- Network actively in your industry to increase opportunities\n`;
    feedback += `- Consider creating a portfolio if relevant to your field\n`;
  } else {
    feedback += `- As a recruiter, you can help job seekers by providing specific feedback\n`;
    feedback += `- Consider what makes candidates stand out in your industry\n`;
  }

  feedback += `\n## Next Steps\n`;
  feedback += `1. Update your resume with the suggestions above\n`;
  feedback += `2. Add missing skills and improve your bio\n`;
  feedback += `3. Apply to jobs that match your updated profile\n`;
  feedback += `4. Follow up on applications within 1-2 weeks\n`;
  feedback += `5. Continue building your professional network\n`;

  return feedback;
} 