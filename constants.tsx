
import React from 'react';
import { AssessmentData } from './types';

export const MOCK_DATA: AssessmentData = {
  studentName: "Rahul",
  overallStatus: 'needs-practice',
  percentile: 42,
  goalPercentile: 90,
  goalMarks: 82, // Score required to reach 90%ile
  topperPercentile: 98,
  rank: 1245,
  totalStudents: 3000,
  marks: 45,
  totalMarks: 100,
  growth: 5,
  peerContext: "You performed better than 45% of students.",
  correctCount: 15,
  incorrectCount: 10,
  unattemptedCount: 5,
  overallAccuracy: 60,
  avgTimePerQuestion: "1m 45s",
  topperAvgTimePerQuestion: "1m 10s",
  totalTimeSpent: "50m / 60m",
  subjects: [
    {
      name: "Physics",
      status: 'weak',
      description: "Needs some practice",
      icon: "⚡",
      strongTopics: ["Units & Dimensions"],
      weakTopics: ["Laws of Motion", "Work & Energy"],
      reasons: { topic: true, time: true, accuracy: true },
      score: 8,
      totalScore: 25,
      accuracy: 45,
      timeSpent: "25m",
      percentile: 32
    },
    {
      name: "Biology",
      status: 'strong',
      description: "You're a star here!",
      icon: "🌱",
      strongTopics: ["Cell Biology", "Genetics"],
      weakTopics: ["Plant Physiology"],
      reasons: { topic: false, time: false, accuracy: false },
      score: 22,
      totalScore: 25,
      accuracy: 92,
      timeSpent: "15m",
      percentile: 96
    },
    {
      name: "Chemistry",
      status: 'average',
      description: "Steady progress",
      icon: "🧪",
      strongTopics: ["Periodic Table"],
      weakTopics: ["Atomic Structure"],
      reasons: { topic: true, time: false, accuracy: false },
      score: 12,
      totalScore: 25,
      accuracy: 65,
      timeSpent: "20m",
      percentile: 68
    },
    {
      name: "Mathematics",
      status: 'weak',
      description: "Calculations needs work",
      icon: "📐",
      strongTopics: ["Algebra"],
      weakTopics: ["Calculus", "Trigonometry"],
      reasons: { topic: true, time: true, accuracy: true },
      score: 5,
      totalScore: 25,
      accuracy: 30,
      timeSpent: "30m",
      percentile: 20
    },
    {
      name: "English",
      status: 'good',
      description: "Good vocabulary",
      icon: "📚",
      strongTopics: ["Grammar", "Reading"],
      weakTopics: [],
      reasons: { topic: false, time: false, accuracy: true },
      score: 20,
      totalScore: 25,
      accuracy: 88,
      timeSpent: "18m",
      percentile: 85
    }
  ]
};

export const STATUS_MAP = {
  'excellent': { emoji: '🤩', title: 'Amazing Work!', subtitle: 'You are crushing it!' },
  'good': { emoji: '😊', title: 'Good Job!', subtitle: 'Very close to your goal' },
  'average': { emoji: '🙂', title: 'Steady Start', subtitle: 'Keep going, you can do it' },
  'needs-practice': { emoji: '💪', title: 'Needs Practice', subtitle: 'Don’t worry, improvement is possible' },
};
