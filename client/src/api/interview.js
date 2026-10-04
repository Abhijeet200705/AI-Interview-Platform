import api from './axios';

export const startInterview = (type) => {
  return api.post('/interview/start', { type });
};

export const submitAnswer = (interviewId, answer) => {
  return api.post(`/interview/${interviewId}/answer`, { answer });
};