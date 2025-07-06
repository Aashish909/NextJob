import axios from "axios";
import {
  SkillAddFail,
  SkillremoveFail,
  btnLoadingStart,
  forgotFail,
  forgotSuccess,
  getUserFail,
  getUserProfileFail,
  getUserProfileSucces,
  getUserSucces,
  loadingStart,
  loginFail,
  loginSuccess,
  photoUpdateFail,
  photoUpdateSuccess,
  registerFail,
  registerSuccess,
  resetFail,
  resetSuccess,
  resumeUpdateFail,
  resumeUpdateSuccess,
  skillAddSuccess,
  skillremoveSuccess,
  updateFail,
  updateSuccess,
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
} from "../reducer/userReducer";
import Cookies from "js-cookie";
import { getAllCompany } from "./company";

export const registerUser = (formdata) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());

    const { data } = await axios.post("/api/user/register", formdata);

    Cookies.set("token", data.token, { expires: 5, secure: true, path: "/" });

    dispatch(registerSuccess(data));
    dispatch(getAllCompany());
  } catch (error) {
    dispatch(registerFail(error.response.data.message));
  }
};

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());

    const { data } = await axios.post("/api/user/login", { email, password });

    Cookies.set("token", data.token, { expires: 5, secure: true, path: "/" });

    dispatch(loginSuccess(data));
    dispatch(getAllCompany());
  } catch (error) {
    dispatch(loginFail(error.response.data.message));
  }
};

export const getUser = () => async (dispatch) => {
  try {
    dispatch(loadingStart());

    const { data } = await axios.get(
      "/api/user/myprofile?token=" + Cookies.get("token")
    );

    dispatch(getUserSucces(data));
  } catch (error) {
    dispatch(getUserFail(error.response.data.message));
  }
};

export const forgotPassword = (email, setEmail) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());

    const { data } = await axios.post("/api/user/forgot", { email });

    dispatch(forgotSuccess(data));
    setEmail("");
  } catch (error) {
    dispatch(forgotFail(error.response.data.message));
  }
};

export const resetPassword =
  (password, token, setPassword) => async (dispatch) => {
    try {
      dispatch(btnLoadingStart());

      const { data } = await axios.post("/api/user/reset?token=" + token, {
        password,
      });

      dispatch(resetSuccess(data));
      setPassword("");
    } catch (error) {
      dispatch(resetFail(error.response.data.message));
    }
  };

export const updatePhoto = (formdata) => async (dispatch) => {
  try {
    dispatch(loadingStart());

    const { data } = await axios.post(
      "/api/user/update/profilepic?token=" + Cookies.get("token"),
      formdata
    );

    dispatch(photoUpdateSuccess(data));
    dispatch(getUser());
  } catch (error) {
    dispatch(photoUpdateFail(error.response.data.message));
  }
};

export const updateProfile = (name, phoneNumber, bio) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());

    const { data } = await axios.post(
      "/api/user/update/info?token=" + Cookies.get("token"),
      { name, phoneNumber, bio }
    );

    dispatch(updateSuccess(data));
    dispatch(getUser());
  } catch (error) {
    dispatch(updateFail(error.response.data.message));
  }
};

export const updateResume = (formdata) => async (dispatch) => {
  try {
    dispatch(loadingStart());

    const { data } = await axios.post(
      "/api/user/update/resume?token=" + Cookies.get("token"),
      formdata
    );

    dispatch(resumeUpdateSuccess(data));
    dispatch(getUser());
  } catch (error) {
    dispatch(resumeUpdateFail(error.response.data.message));
  }
};

export const AddSkill = (skill) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());

    const { data } = await axios.post(
      "/api/user/skill/add?token=" + Cookies.get("token"),
      { skill }
    );

    dispatch(skillAddSuccess(data));
    dispatch(getUser());
  } catch (error) {
    dispatch(SkillAddFail(error.response.data.message));
  }
};

export const removeSkill = (skill) => async (dispatch) => {
  try {
    dispatch(btnLoadingStart());

    const { data } = await axios.delete(
      "/api/user/skill/remove?token=" + Cookies.get("token") + "&skill=" + skill
    );

    dispatch(skillremoveSuccess(data));
    dispatch(getUser());
  } catch (error) {
    dispatch(SkillremoveFail(error.response.data.message));
  }
};

export const getUserProfile = (id) => async (dispatch) => {
  try {
    dispatch(loadingStart());

    const { data } = await axios.get(
      "/api/user/profile?token=" + Cookies.get("token") + "&id=" + id
    );

    dispatch(getUserProfileSucces(data));
  } catch (error) {
    dispatch(getUserProfileFail(error.response.data.message));
  }
};

export const getAIResumeFeedback = () => async (dispatch) => {
  try {
    dispatch(aiFeedbackStart());

    const { data } = await axios.post(
      "/api/ai/resume-feedback?token=" + Cookies.get("token")
    );

    dispatch(aiFeedbackSuccess(data));
  } catch (error) {
    dispatch(aiFeedbackFail(error.response?.data?.message || "Failed to get AI feedback"));
  }
};

export const getAIResumeJDMatching = (jobId) => async (dispatch) => {
  try {
    dispatch(aiResumeJDMatchingStart());

    const { data } = await axios.post(
      `/api/ai/resume-jd-matching?token=${Cookies.get("token")}&jobId=${jobId}`
    );

    dispatch(aiResumeJDMatchingSuccess(data));
  } catch (error) {
    dispatch(aiResumeJDMatchingFail(error.response?.data?.message || "Failed to analyze resume-JD matching"));
  }
};

export const getAIJobSummary = (jobId) => async (dispatch) => {
  try {
    dispatch(aiJobSummaryStart());

    const { data } = await axios.post(
      `/api/ai/job-summary?jobId=${jobId}`
    );

    dispatch(aiJobSummarySuccess(data));
  } catch (error) {
    dispatch(aiJobSummaryFail(error.response?.data?.message || "Failed to generate job summary"));
  }
};

export const getAICoverLetter = (jobId, tone = "professional") => async (dispatch) => {
  try {
    dispatch(aiCoverLetterStart());

    const { data } = await axios.post(
      `/api/ai/cover-letter?token=${Cookies.get("token")}&jobId=${jobId}&tone=${tone}`
    );

    dispatch(aiCoverLetterSuccess(data));
  } catch (error) {
    dispatch(aiCoverLetterFail(error.response?.data?.message || "Failed to generate cover letter"));
  }
};

export const getAIInterviewPrep = (jobId) => async (dispatch) => {
  try {
    dispatch(aiInterviewPrepStart());

    const { data } = await axios.post(
      `/api/ai/interview-prep?token=${Cookies.get("token")}&jobId=${jobId}`
    );

    dispatch(aiInterviewPrepSuccess(data));
  } catch (error) {
    dispatch(aiInterviewPrepFail(error.response?.data?.message || "Failed to generate interview preparation"));
  }
};
