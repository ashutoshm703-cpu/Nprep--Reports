
export interface SubjectPerformance {
  name: string;
  status: 'strong' | 'average' | 'weak' | 'good';
  description: string;
  icon: string;
  strongTopics: string[];
  weakTopics: string[];
  reasons: {
    topic: boolean;
    time: boolean;
    accuracy: boolean;
  };
  score: number;
  totalScore: number;
  accuracy: number;
  timeSpent: string;
  percentile: number;
}

export interface AssessmentData {
  studentName: string;
  overallStatus: 'excellent' | 'good' | 'average' | 'needs-practice';
  percentile: number;
  goalPercentile: number;
  goalMarks: number; // Added goal marks for tooltip
  topperPercentile: number;
  rank: number;
  totalStudents: number;
  marks: number;
  totalMarks: number;
  growth?: number;
  subjects: SubjectPerformance[];
  peerContext: string;
  // New Test Strategy Data
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  overallAccuracy: number;
  avgTimePerQuestion: string;
  topperAvgTimePerQuestion: string;
  totalTimeSpent: string;
}

export type AppView = 'summary' | 'details' | 'plan';
