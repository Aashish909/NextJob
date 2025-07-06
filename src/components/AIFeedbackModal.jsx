"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAIResumeFeedback } from "@/redux/action/user";
import { Brain, Loader2, Sparkles } from "lucide-react";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AIFeedbackModal = () => {
  const { aiFeedback, aiFeedbackLoading, error } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef();
  const dispatch = useDispatch();

  const handleGetFeedback = async () => {
    await dispatch(getAIResumeFeedback());
    triggerRef.current.click();
  };

  const formatFeedback = (feedback) => {
    if (!feedback) return "";
    
    // Convert markdown-style headers to HTML and escape quotes
    return feedback
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-blue-600 mt-4 mb-2">$1</h2>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      .replace(/"/g, '&quot;');
  };

  return (
    <>
      <Button
        onClick={handleGetFeedback}
        disabled={aiFeedbackLoading}
        variant="outline"
        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
      >
        {aiFeedbackLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Brain className="h-4 w-4" />
        )}
        {aiFeedbackLoading ? "Analyzing..." : "Get AI Feedback"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button ref={triggerRef} className="hidden">
            Open Feedback
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              AI Resume Feedback
            </DialogTitle>
            <DialogDescription>
              Personalized feedback to improve your resume and increase your chances of getting interviews.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {aiFeedbackLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2">AI is analyzing your resume...</span>
              </div>
            ) : aiFeedback ? (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {aiFeedback}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Click &quot;Get AI Feedback&quot; to analyze your resume
              </div>
            )}
          </div>

          {aiFeedback && (
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Use this feedback to improve your resume and increase your chances of getting interviews!
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIFeedbackModal; 