"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePhoto, updateProfile, updateResume } from "@/redux/action/user";
import { Edit, Mail, NotepadText, Phone, User, Briefcase, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import AIFeedbackModal from "@/components/AIFeedbackModal";

const Info = ({ user, btnLoading }) => {
  const inputRef = useRef();
  const handleClick = () => {
    inputRef.current.click();
  };

  const [name, setname] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [bio, setbio] = useState("");

  const editRef = useRef();

  const handleEditClick = () => {
    editRef.current.click();
    setname(user.name);
    setphoneNumber(user.phoneNumber);
    setbio(user.bio);
  };

  const dispatch = useDispatch();

  const changeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formdata = new FormData();
      formdata.append("profilePic", file);

      dispatch(updatePhoto(formdata));
    }
  };

  const updateProfileHandler = () => {
    dispatch(updateProfile(name, phoneNumber, bio));
  };

  const resumeRef = useRef();

  const resumeClick = () => {
    resumeRef.current.click();
  };

  const changeResume = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload Pdf file");
        return;
      }

      const formdata = new FormData();
      formdata.append("resume", file);
      dispatch(updateResume(formdata));
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="relative group">
            <div className="relative">
              <Image
                src={user.profilePic}
                alt="profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 shadow-2xl"
                width={160}
                height={160}
              />
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClick}
                  className="text-white hover:bg-white/20"
                >
                  <Edit size={16} />
                </Button>
              </div>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              ref={inputRef}
              onChange={changeHandler}
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEditClick}
                className="text-white hover:bg-white/20"
              >
                <Edit size={18} />
              </Button>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Briefcase className="w-4 h-4" />
              <span className="text-lg capitalize">{user.role}</span>
            </div>

            {user.role === "jobseeker" && user.bio && (
              <p className="text-white/90 text-lg max-w-2xl">
                {user.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card className="p-6 shadow-lg border-0 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phoneNumber}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Resume Section */}
        {user.role === "jobseeker" && (
          <Card className="p-6 shadow-lg border-0 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <NotepadText className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Resume</h2>
            </div>
            
            <div className="space-y-4">
              {user.resume ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <NotepadText className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-green-800">Resume Uploaded</p>
                      <p className="text-sm text-green-600">Your resume is ready for job applications</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={resumeClick}
                      className="flex-1"
                    >
                      <Edit size={16} className="mr-2" />
                      Update Resume
                    </Button>
                    <Link href={user.resume} target="_blank">
                      <Button variant="default" size="sm" className="flex-1">
                        <NotepadText size={16} className="mr-2" />
                        View Resume
                      </Button>
                    </Link>
                  </div>
                  
                  <AIFeedbackModal />
                </div>
              ) : (
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <NotepadText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">No resume uploaded yet</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resumeClick}
                  >
                    <Edit size={16} className="mr-2" />
                    Upload Resume
                  </Button>
                </div>
              )}
              
              <input
                type="file"
                ref={resumeRef}
                className="hidden"
                accept="application/pdf"
                onChange={changeResume}
              />
            </div>
          </Card>
        )}
      </div>

      {/* Profile Stats */}
      <Card className="p-6 shadow-lg border-0 bg-gradient-to-r from-gray-50 to-blue-50">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{user.skills?.length || 0}</div>
            <div className="text-sm text-gray-600">Skills</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">{user.savedJobs?.length || 0}</div>
            <div className="text-sm text-gray-600">Saved Jobs</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {user.resume ? "✓" : "✗"}
            </div>
            <div className="text-sm text-gray-600">Resume</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {user.profilePic ? "✓" : "✗"}
            </div>
            <div className="text-sm text-gray-600">Photo</div>
          </div>
        </div>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button ref={editRef} variant="outline" className="hidden">
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Edit Profile
            </DialogTitle>
            <DialogDescription>
              Update your profile information to keep it current and professional.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                className="col-span-3"
                value={name}
                onChange={(e) => setname(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                type="number"
                className="col-span-3"
                value={phoneNumber}
                onChange={(e) => setphoneNumber(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Input
                id="bio"
                type="text"
                className="col-span-3"
                value={bio}
                onChange={(e) => setbio(e.target.value)}
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={btnLoading}
              onClick={updateProfileHandler}
              className="w-full"
            >
              {btnLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Info;
