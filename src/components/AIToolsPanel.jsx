"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  getAIResumeJDMatching, 
  getAIJobSummary, 
  getAICoverLetter, 
  getAIInterviewPrep 
} from "@/redux/action/user";
import { 
  Brain, 
  FileText, 
  Target, 
  MessageSquare, 
  Users, 
  Loader2, 
  Sparkles,
  TrendingUp,
  Briefcase,
  Calendar,
  MapPin,
  DollarSign
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AIToolsPanel = ({ jobId, job }) => {
  const dispatch = useDispatch();
  const {
    aiResumeJDMatching,
    aiResumeJDMatchingLoading,
    aiJobSummary,
    aiJobSummaryLoading,
    aiCoverLetter,
    aiCoverLetterLoading,
    aiInterviewPrep,
    aiInterviewPrepLoading,
    error
  } = useSelector((state) => state.user);

  const [selectedTool, setSelectedTool] = useState(null);
  const [coverLetterTone, setCoverLetterTone] = useState("professional");
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef();

  const handleToolClick = async (tool, params = {}) => {
    setSelectedTool(tool);
    setIsOpen(true);
    
    switch (tool) {
      case 'matching':
        await dispatch(getAIResumeJDMatching(jobId));
        break;
      case 'summary':
        await dispatch(getAIJobSummary(jobId));
        break;
      case 'coverLetter':
        await dispatch(getAICoverLetter(jobId, coverLetterTone));
        break;
      case 'interviewPrep':
        await dispatch(getAIInterviewPrep(jobId));
        break;
    }
  };

  const getLoadingState = () => {
    switch (selectedTool) {
      case 'matching': return aiResumeJDMatchingLoading;
      case 'summary': return aiJobSummaryLoading;
      case 'coverLetter': return aiCoverLetterLoading;
      case 'interviewPrep': return aiInterviewPrepLoading;
      default: return false;
    }
  };

  const getContent = () => {
    switch (selectedTool) {
      case 'matching': return aiResumeJDMatching?.detailedAnalysis;
      case 'summary': return aiJobSummary?.summary;
      case 'coverLetter': return aiCoverLetter?.content;
      case 'interviewPrep': return aiInterviewPrep?.content;
      default: return null;
    }
  };

  const getTitle = () => {
    switch (selectedTool) {
      case 'matching': return "Resume-JD Matching Analysis";
      case 'summary': return "Job Summary";
      case 'coverLetter': return "AI Cover Letter";
      case 'interviewPrep': return "Interview Preparation";
      default: return "AI Tools";
    }
  };

  const getIcon = () => {
    switch (selectedTool) {
      case 'matching': return <Target className="w-5 h-5" />;
      case 'summary': return <FileText className="w-5 h-5" />;
      case 'coverLetter': return <MessageSquare className="w-5 h-5" />;
      case 'interviewPrep': return <Users className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const formatContent = (content) => {
    if (!content) return "";
    
    return content
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-blue-600 mt-4 mb-2">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-gray-800 mt-3 mb-2">$1</h3>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="space-y-4">
      {/* AI Tools Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h2 className="text-xl font-semibold text-gray-800">AI-Powered Job Tools</h2>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resume-JD Matching */}
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200">
          <div 
            className="flex items-center gap-3"
            onClick={() => handleToolClick('matching')}
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Resume-JD Matching</h3>
              <p className="text-sm text-gray-600">Analyze how well your resume matches this job</p>
            </div>
          </div>
        </Card>

        {/* Job Summary */}
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-green-200">
          <div 
            className="flex items-center gap-3"
            onClick={() => handleToolClick('summary')}
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Job Summary</h3>
              <p className="text-sm text-gray-600">Get a quick overview of key requirements</p>
            </div>
          </div>
        </Card>

        {/* Cover Letter Generator */}
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-200">
          <div 
            className="flex items-center gap-3"
            onClick={() => handleToolClick('coverLetter')}
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Cover Letter</h3>
              <p className="text-sm text-gray-600">Generate a personalized cover letter</p>
            </div>
          </div>
        </Card>

        {/* Interview Preparation */}
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-orange-200">
          <div 
            className="flex items-center gap-3"
            onClick={() => handleToolClick('interviewPrep')}
          >
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Interview Prep</h3>
              <p className="text-sm text-gray-600">Get questions and tips for interviews</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Cover Letter Tone Selector */}
      {selectedTool === 'coverLetter' && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Cover Letter Tone
          </label>
          <Select value={coverLetterTone} onValueChange={setCoverLetterTone}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Results Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button ref={triggerRef} className="hidden">
            Open Results
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getIcon()}
              {getTitle()}
            </DialogTitle>
            <DialogDescription>
              AI-powered analysis to help you succeed in your job application
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {getLoadingState() ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2">AI is analyzing...</span>
              </div>
            ) : getContent() ? (
              <div 
                className="prose prose-sm max-w-none whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formatContent(getContent()) }}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Click on a tool to get started
              </div>
            )}
          </div>

          {/* Quick Stats for Matching */}
          {selectedTool === 'matching' && aiResumeJDMatching && (
            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {aiResumeJDMatching.score}%
                  </div>
                  <div className="text-sm text-gray-600">Match Score</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {aiResumeJDMatching.matchingKeywords?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Matching Keywords</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {aiResumeJDMatching.missingKeywords?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Missing Keywords</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {job?.experience || 0}
                  </div>
                  <div className="text-sm text-gray-600">Years Required</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats for Job Summary */}
          {selectedTool === 'summary' && aiJobSummary && (
            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {aiJobSummary.quickOverview?.role}
                  </div>
                  <div className="text-sm text-gray-600">Position</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {aiJobSummary.quickOverview?.experience}
                  </div>
                  <div className="text-sm text-gray-600">Experience</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">
                    {aiJobSummary.quickOverview?.salary}
                  </div>
                  <div className="text-sm text-gray-600">Salary</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {aiJobSummary.quickOverview?.location}
                  </div>
                  <div className="text-sm text-gray-600">Location</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIToolsPanel; 