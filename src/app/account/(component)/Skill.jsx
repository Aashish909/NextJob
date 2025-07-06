"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AddSkill, removeSkill } from "@/redux/action/user";
import { Delete, Plus, Zap } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const Skill = ({ user, btnLoading }) => {
  const [skill, setskill] = useState("");

  const dispatch = useDispatch();

  const addSkillHandler = () => {
    if (skill === "") return alert("Please give value");
    dispatch(AddSkill(skill));
    setskill(""); // Clear input after adding
  };

  const removeSkillHandler = (skill) => {
    if (confirm("Are you sure you want to remove this skill?"))
      dispatch(removeSkill(skill));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Zap className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <CardTitle className="text-xl font-semibold text-gray-800">Skills & Expertise</CardTitle>
          <CardDescription className="text-gray-600">
            Showcase your professional skills to attract better opportunities
          </CardDescription>
        </div>
      </div>

      {/* Add Skill Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Add New Skill
            </label>
            <Input
              type="text"
              placeholder="e.g., React.js, Project Management, Data Analysis"
              className="w-full"
              value={skill}
              onChange={(e) => setskill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkillHandler()}
            />
          </div>
          <Button 
            disabled={btnLoading} 
            onClick={addSkillHandler}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          >
            <Plus size={16} className="mr-2" />
            {btnLoading ? "Adding..." : "Add Skill"}
          </Button>
        </div>
      </div>

      {/* Skills Display */}
      <CardContent className="p-0">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Your Skills ({user.skills?.length || 0})
          </h3>
          
          {user.skills && user.skills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {user.skills.map((skill) => (
                <div
                  key={skill}
                  className="group relative p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <span className="text-sm font-medium text-gray-800 pr-8">
                    {skill}
                  </span>
                  <button
                    disabled={btnLoading}
                    onClick={() => removeSkillHandler(skill)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    title="Remove skill"
                  >
                    <Delete size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No skills added yet</p>
              <p className="text-sm text-gray-400">
                Add your first skill to get started
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
};

export default Skill;
