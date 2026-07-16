import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor to add authorization token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    return res.data;
  },
  getProfile: async () => {
    const res = await API.get('/auth/profile');
    return res.data;
  }
};

export const courseAPI = {
  getCourses: async () => {
    const res = await API.get('/courses');
    return res.data;
  },
  getCourseById: async (id) => {
    const res = await API.get(`/courses/${id}`);
    return res.data;
  },
  completeLesson: async (lessonId) => {
    const res = await API.post('/courses/complete-lesson', { lessonId });
    return res.data;
  }
};

export const quizAPI = {
  getQuizByCourseId: async (courseId) => {
    const res = await API.get(`/quizzes/course/${courseId}`);
    return res.data;
  },
  submitScore: async (quizId, score, totalQuestions) => {
    const res = await API.post('/quizzes/submit', { quizId, score, totalQuestions });
    return res.data;
  }
};

export const chatbotAPI = {
  sendMessage: async (message, history) => {
    const res = await API.post('/chatbot', { message, history });
    return res.data;
  }
};

export default API;
