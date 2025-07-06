import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userProfile: null,
  isAuth: false,
  savedJobs: null,
  loading: false,
  btnLoading: false,
  error: null,
  message: null,
  aiFeedback: null,
  aiFeedbackLoading: false,
  aiResumeJDMatching: null,
  aiResumeJDMatchingLoading: false,
  aiJobSummary: null,
  aiJobSummaryLoading: false,
  aiCoverLetter: null,
  aiCoverLetterLoading: false,
  aiInterviewPrep: null,
  aiInterviewPrepLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadingStart: (state) => {
      state.loading = true;
    },
    btnLoadingStart: (state) => {
      state.btnLoading = true;
    },
    registerSuccess: (state, action) => {
      state.btnLoading = false;
      state.user = action.payload.user;
      state.isAuth = true;
      state.message = action.payload.message;
    },
    registerFail: (state, action) => {
      state.btnLoading = false;
      state.user = null;
      state.isAuth = false;
      state.error = action.payload;
    },
    loginSuccess: (state, action) => {
      state.btnLoading = false;
      state.user = action.payload.user;
      state.isAuth = true;
      state.message = action.payload.message;
    },
    getUserSucces: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuth = true;
    },
    getUserFail: (state) => {
      state.isAuth = false;
      state.loading = false;
    },
    loginFail: (state, action) => {
      state.btnLoading = false;
      state.user = null;
      state.isAuth = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuth = false;
      state.message = "Logged Out";
    },
    forgotSuccess: (state, action) => {
      state.btnLoading = false;
      state.message = action.payload.message;
    },
    forgotFail: (state, action) => {
      state.btnLoading = false;
      state.error = action.payload;
    },
    resetSuccess: (state, action) => {
      state.btnLoading = false;
      state.message = action.payload.message;
    },
    resetFail: (state, action) => {
      state.btnLoading = false;
      state.error = action.payload;
    },
    photoUpdateSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    photoUpdateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateSuccess: (state, action) => {
      state.btnLoading = false;
      state.message = action.payload.message;
    },
    updateFail: (state, action) => {
      state.btnLoading = false;
      state.error = action.payload;
    },
    resumeUpdateSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    resumeUpdateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    skillAddSuccess: (state, action) => {
      state.btnLoading = false;
      state.message = action.payload.message;
    },
    SkillAddFail: (state, action) => {
      state.btnLoading = false;
      state.error = action.payload;
    },
    skillremoveSuccess: (state, action) => {
      state.btnLoading = false;
      state.message = action.payload.message;
    },
    SkillremoveFail: (state, action) => {
      state.btnLoading = false;
      state.error = action.payload;
    },
    getUserProfileSucces: (state, action) => {
      state.loading = false;
      state.userProfile = action.payload;
    },
    getUserProfileFail: (state) => {
      state.loading = false;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    aiFeedbackStart: (state) => {
      state.aiFeedbackLoading = true;
      state.error = null;
    },
    aiFeedbackSuccess: (state, action) => {
      state.aiFeedbackLoading = false;
      state.aiFeedback = action.payload.feedback;
      state.message = action.payload.message;
    },
    aiFeedbackFail: (state, action) => {
      state.aiFeedbackLoading = false;
      state.error = action.payload;
    },
    aiResumeJDMatchingStart: (state) => {
      state.aiResumeJDMatchingLoading = true;
      state.error = null;
    },
    aiResumeJDMatchingSuccess: (state, action) => {
      state.aiResumeJDMatchingLoading = false;
      state.aiResumeJDMatching = action.payload.analysis;
      state.message = action.payload.message;
    },
    aiResumeJDMatchingFail: (state, action) => {
      state.aiResumeJDMatchingLoading = false;
      state.error = action.payload;
    },
    aiJobSummaryStart: (state) => {
      state.aiJobSummaryLoading = true;
      state.error = null;
    },
    aiJobSummarySuccess: (state, action) => {
      state.aiJobSummaryLoading = false;
      state.aiJobSummary = action.payload.summary;
      state.message = action.payload.message;
    },
    aiJobSummaryFail: (state, action) => {
      state.aiJobSummaryLoading = false;
      state.error = action.payload;
    },
    aiCoverLetterStart: (state) => {
      state.aiCoverLetterLoading = true;
      state.error = null;
    },
    aiCoverLetterSuccess: (state, action) => {
      state.aiCoverLetterLoading = false;
      state.aiCoverLetter = action.payload.coverLetter;
      state.message = action.payload.message;
    },
    aiCoverLetterFail: (state, action) => {
      state.aiCoverLetterLoading = false;
      state.error = action.payload;
    },
    aiInterviewPrepStart: (state) => {
      state.aiInterviewPrepLoading = true;
      state.error = null;
    },
    aiInterviewPrepSuccess: (state, action) => {
      state.aiInterviewPrepLoading = false;
      state.aiInterviewPrep = action.payload.interviewPrep;
      state.message = action.payload.message;
    },
    aiInterviewPrepFail: (state, action) => {
      state.aiInterviewPrepLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loadingStart,
  btnLoadingStart,
  registerFail,
  registerSuccess,
  loginFail,
  loginSuccess,
  getUserFail,
  getUserSucces,
  logoutSuccess,
  forgotFail,
  forgotSuccess,
  resetFail,
  resetSuccess,
  photoUpdateFail,
  photoUpdateSuccess,
  updateFail,
  updateSuccess,
  resumeUpdateFail,
  resumeUpdateSuccess,
  skillAddSuccess,
  SkillAddFail,
  skillremoveSuccess,
  SkillremoveFail,
  clearError,
  clearMessage,
  getUserProfileFail,
  getUserProfileSucces,
  aiFeedbackStart,
  aiFeedbackSuccess,
  aiFeedbackFail,
  aiResumeJDMatchingStart,
  aiResumeJDMatchingSuccess,
  aiResumeJDMatchingFail,
  aiJobSummaryStart,
  aiJobSummarySuccess,
  aiJobSummaryFail,
  aiCoverLetterStart,
  aiCoverLetterSuccess,
  aiCoverLetterFail,
  aiInterviewPrepStart,
  aiInterviewPrepSuccess,
  aiInterviewPrepFail,
} = userSlice.actions;

export default userSlice.reducer;
