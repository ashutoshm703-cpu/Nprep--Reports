
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_DATA, STATUS_MAP } from './constants';
import { GoalBar } from './components/GoalBar';
import { BottomSheet } from './components/BottomSheet';
import { generateNextPlan } from './services/geminiService';
import { SubjectPerformance } from './types';

const App: React.FC = () => {
  // SORTING: Order subjects from Lowest Percentile (Weakest) -> Highest Percentile (Strongest)
  const sortedSubjects = useMemo(() => {
    return [...MOCK_DATA.subjects].sort((a, b) => a.percentile - b.percentile);
  }, []);

  // Default to the first subject (which is now the weakest one due to sorting)
  const [selectedSubject, setSelectedSubject] = useState<SubjectPerformance>(sortedSubjects[0]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  
  // State for toggling details to reduce cognitive load
  const [showDetails, setShowDetails] = useState(false);
  
  const [aiPlan, setAiPlan] = useState<string[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(true);

  // Prefetch plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const plan = await generateNextPlan(MOCK_DATA);
        setAiPlan(plan);
      } catch (e) {
        console.error("Failed to load plan", e);
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchPlan();
  }, []);

  // HELPER: Generic Status Labels
  const getGenericStatusLabel = (status: string) => {
    switch (status) {
      case 'weak': return 'Focus Area';
      case 'strong': return 'Mastered';
      default: return 'On Track';
    }
  };

  // HELPER: Gradient Colors for Top of Card
  const getGradientColors = (status: string) => {
    switch (status) {
      case 'weak': return 'from-red-50 via-white to-white'; 
      case 'strong': return 'from-green-50 via-white to-white';
      default: return 'from-gray-50 via-white to-white';
    }
  };

  // HELPER: Status Pill Styles (The "Hero" Badge)
  const getStatusPillStyle = (status: string) => {
    switch (status) {
      case 'weak': return 'bg-white text-gray-600 border border-red-100 shadow-sm';
      case 'strong': return 'bg-white text-gray-600 border border-green-100 shadow-sm';
      default: return 'bg-white text-gray-600 border border-gray-100 shadow-sm';
    }
  };

  // HELPER: Analysis Box Theme (Connects Zone 3 and Zone 4)
  const getAnalysisTheme = (status: string) => {
    switch (status) {
      case 'weak': return {
        headerBg: 'bg-red-50',
        borderColor: 'border-red-100',
        titleColor: 'text-gray-800',
        notchColor: 'text-red-50' // For the SVG fill
      };
      case 'strong': return {
        headerBg: 'bg-green-50',
        borderColor: 'border-green-100',
        titleColor: 'text-gray-800',
        notchColor: 'text-green-50'
      };
      default: return {
        headerBg: 'bg-gray-50',
        borderColor: 'border-gray-200',
        titleColor: 'text-gray-800',
        notchColor: 'text-gray-50'
      };
    }
  };

  const analysisTheme = getAnalysisTheme(selectedSubject.status);

  // Style logic for cards (Selection State - Option A: Tactile Pop)
  const getCardStyle = (isSelected: boolean, status: string) => {
      if (isSelected) {
          // Active state: Pop up, Big Shadow, No Border Color
          return 'border-transparent shadow-xl scale-110 z-20 -translate-y-2 ring-0 bg-white';
      }
      // Inactive state: Receded, Flat, Subtle
      return 'border-gray-100 shadow-sm scale-95 opacity-70 hover:opacity-100 hover:scale-100 hover:shadow-md z-10 bg-white/90';
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 pb-20 font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-sm relative overflow-hidden flex flex-col">
        
        {/* --- ZONE 1: UNIFIED REPORT CARD (EXPANDABLE) --- */}
        <div className="px-6 pt-10 pb-2 bg-white mb-6">
          <div className="flex justify-between items-end mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Hello, {MOCK_DATA.studentName} 👋</h1>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm relative overflow-hidden transition-all duration-300">
             {/* Row 1: Score & Rank (Always Visible) */}
             <div className="flex justify-between items-start">
                {/* Score Section */}
                <div>
                   <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Your Score</p>
                   <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-gray-800">{MOCK_DATA.marks}</span>
                      <span className="text-gray-400 text-lg font-medium">/ {MOCK_DATA.totalMarks}</span>
                   </div>
                   {MOCK_DATA.growth && (
                     <div className="inline-flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-lg mt-2">
                        <span className="text-green-600 text-xs font-bold">📈 +{MOCK_DATA.growth}</span>
                        <span className="text-green-700 text-[10px] font-medium">vs last test</span>
                     </div>
                   )}
                </div>

                {/* Rank Section */}
                <div className="text-right">
                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Rank</p>
                    <div className="text-3xl font-black text-gray-800">{MOCK_DATA.rank}</div>
                    <button 
                      onClick={() => setShowLeaderboard(true)}
                      className="text-blue-600 text-xs font-bold mt-2 flex items-center justify-end ml-auto hover:text-blue-800 transition-colors"
                    >
                       View Leaderboard →
                    </button>
                </div>
             </div>

             {/* Goal Track Bar */}
             <GoalBar 
               current={MOCK_DATA.percentile} 
               target={MOCK_DATA.goalPercentile}
               currentScore={MOCK_DATA.marks}
               targetScore={MOCK_DATA.goalMarks}
               totalScore={MOCK_DATA.totalMarks}
             />

             {/* EXPANDABLE SECTION: The Data Heavy Details (REVISED TO LOW-CONTRAST GRID) */}
             {showDetails && (
               <div className="mt-4 animate-fade-in-down">
                 {/* Divider */}
                 <div className="h-px bg-gray-100 mb-4"></div>

                 {/* Minimalist 3x2 Grid - Tighter Spacing, Smaller Text, Grey Colors */}
                 <div className="grid grid-cols-3 gap-y-3 gap-x-2 py-2">
                    
                    {/* Row 1: Outcomes */}
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-gray-500 leading-none">{MOCK_DATA.correctCount}</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-1">Correct</span>
                    </div>

                    <div className="flex flex-col items-center border-l border-gray-100">
                        <span className="text-sm font-bold text-gray-500 leading-none">{MOCK_DATA.incorrectCount}</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-1">Wrong</span>
                    </div>

                    <div className="flex flex-col items-center border-l border-gray-100">
                        <span className="text-sm font-bold text-gray-500 leading-none">{MOCK_DATA.unattemptedCount}</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-1">Skipped</span>
                    </div>

                    {/* Row 2: Efficiency */}
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-gray-500 leading-none">{MOCK_DATA.overallAccuracy}%</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-1">Accuracy</span>
                    </div>

                    <div className="flex flex-col items-center border-l border-gray-100">
                        <span className="text-sm font-bold text-gray-500 leading-none">{MOCK_DATA.avgTimePerQuestion}</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-1">Avg Time</span>
                    </div>

                    <div className="flex flex-col items-center border-l border-gray-100">
                        <span className="text-sm font-bold text-gray-500 leading-none">{MOCK_DATA.totalTimeSpent}</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-1">Total Time</span>
                    </div>

                 </div>
               </div>
             )}

             {/* SUBTLE TOGGLE */}
             <button 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full mt-2 pt-3 border-t border-gray-50 text-center text-xs text-gray-400 font-bold hover:text-gray-600 transition-colors flex items-center justify-center uppercase tracking-wide"
             >
                {showDetails ? "Hide Details" : "View Details"}
                <svg className={`w-3 h-3 ml-1 transform transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
             </button>

          </div>
        </div>

        {/* --- ZONE 3: SUBJECT BREAKDOWN --- */}
        {/* Adjusted margin-bottom to 0 to pull the next section up */}
        <div className="mb-0 relative z-20">
          <div className="px-6 mb-2 flex justify-between items-end">
             <h3 className="text-sm font-bold text-gray-800">Subject Breakdown</h3>
          </div>
          
          <div className="overflow-x-auto pb-10 pt-4 -mx-6 px-6 no-scrollbar flex space-x-2 snap-x items-center">
             {sortedSubjects.map((subject) => {
               const isSelected = selectedSubject.name === subject.name;
               // Get theme specifically for this subject to color the notch correctly
               const subjectTheme = getAnalysisTheme(subject.status);
               
               let cardClass = "flex-shrink-0 w-28 rounded-2xl border flex flex-col py-3 px-1 snap-center cursor-pointer transition-all duration-300 ease-out relative h-32 overflow-visible ";
               cardClass += getCardStyle(isSelected, subject.status);

               return (
                 <div key={subject.name} className="relative group">
                    <div
                        onClick={() => setSelectedSubject(subject)}
                        className={cardClass}
                    >
                        {/* Gradient Inside Card */}
                        <div className={`absolute top-0 left-0 right-0 h-16 rounded-t-2xl bg-gradient-to-b ${getGradientColors(subject.status)} z-0 overflow-hidden`}></div>

                        {/* Status Badge */}
                        <div className={`relative z-10 self-end px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider mb-2 mr-1 ${getStatusPillStyle(subject.status)}`}>
                            {getGenericStatusLabel(subject.status)}
                        </div>

                        {/* Name */}
                        <div className="relative z-10 flex flex-col items-center justify-center flex-grow w-full mt-0">
                             <p className={`font-black tracking-tight text-center leading-none transition-all px-1 ${isSelected ? 'text-base text-gray-800' : 'text-sm text-gray-600'}`}>
                                {subject.name}
                             </p>
                        </div>

                        {/* THE NOTCH / POINTER - Now Attached to the selected card */}
                        {isSelected && (
                          <div className="absolute -bottom-[12px] left-1/2 transform -translate-x-1/2 z-30 filter drop-shadow-[0_4px_3px_rgba(0,0,0,0.07)]">
                             <svg width="40" height="15" viewBox="0 0 40 15" className={`fill-current ${subjectTheme.notchColor}`}>
                                <path d="M20 15L40 0H0L20 15Z" transform="translate(0,0) scale(1, -1) translate(0, -15)" /> 
                                <path d="M20 0L40 16H0L20 0Z" />
                             </svg>
                          </div>
                        )}
                    </div>
                 </div>
               );
             })}
          </div>
        </div>

        {/* --- ZONE 4: THE "CONNECTED" DIAGNOSIS --- */}
        {/* Negative margin pulls this up under the cards */}
        <div className="px-6 mb-8 relative z-10 -mt-6">
          
          <div className={`bg-white rounded-2xl p-0 border ${analysisTheme.borderColor} overflow-hidden shadow-lg transition-all duration-300`}>
            
            {/* Header - Now Dynamic Color */}
            <div className={`${analysisTheme.headerBg} px-5 py-3 border-b ${analysisTheme.borderColor} flex justify-between items-center transition-colors duration-300`}>
               <div className="flex items-center space-x-2">
                 <h3 className={`text-sm font-bold ${analysisTheme.titleColor}`}>{selectedSubject.name} Analysis</h3>
               </div>
               {/* Tiny Icon based on status */}
               <span className="text-lg">
                 {selectedSubject.status === 'weak' ? '⚠️' : selectedSubject.status === 'strong' ? '🌟' : '📊'}
               </span>
            </div>

            {/* Mini-Stat Row */}
            <div className={`grid grid-cols-3 divide-x divide-gray-100 border-b ${analysisTheme.borderColor} bg-white`}>
                <div className="p-3 text-center">
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Marks</p>
                   <p className="text-sm font-black text-gray-700">{selectedSubject.score}<span className="text-gray-400 text-xs font-medium">/{selectedSubject.totalScore}</span></p>
                </div>
                <div className="p-3 text-center">
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Accuracy</p>
                   <p className="text-sm font-black text-gray-700">
                     {selectedSubject.accuracy}%
                   </p>
                </div>
                <div className="p-3 text-center">
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Time</p>
                   <p className="text-sm font-black text-gray-700">{selectedSubject.timeSpent}</p>
                </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {/* Layer 1: What Worked (Strength) */}
              <div className="p-4 flex items-start space-x-3">
                 <div className="bg-green-100 text-green-700 p-1.5 rounded-lg text-lg min-w-[36px] flex justify-center">👍</div>
                 <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Your Strength</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedSubject.strongTopics.length > 0 
                        ? `You have a good command over ${selectedSubject.strongTopics[0]}.` 
                        : "You attempted easy questions confidently."}
                    </p>
                 </div>
              </div>

              {/* Layer 2: Weakness */}
              <div className="p-4 flex items-start space-x-3 bg-red-50/40">
                 <div className="bg-red-100 text-red-700 p-1.5 rounded-lg text-lg min-w-[36px] flex justify-center">⚠️</div>
                 <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Needs Work</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedSubject.weakTopics.length > 0 
                        ? `Struggled with ${selectedSubject.weakTopics.join(" & ")}.` 
                        : "Missed some conceptual questions."}
                    </p>
                 </div>
              </div>

              {/* Layer 3: Insight (Why) */}
              <div className="p-4 flex items-start space-x-3">
                 <div className="bg-blue-100 text-blue-700 p-1.5 rounded-lg text-lg min-w-[36px] flex justify-center">💡</div>
                 <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Insight</p>
                    <p className="text-sm font-medium text-gray-700">
                      {selectedSubject.reasons.accuracy ? "Accuracy was low. Focus on reducing negative marking." : 
                       selectedSubject.reasons.time ? "Time management was the main issue here." : 
                       "You just need more revision on core concepts."}
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- ZONE 5: ROADMAP CTA --- */}
        <div className="px-6 mb-12">
           <div 
             onClick={() => setShowPlan(true)}
             className="relative group cursor-pointer"
           >
              {/* Blurred Background Card */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl transform rotate-1 opacity-20 group-hover:rotate-2 transition-transform"></div>
              
              <div className="relative bg-white border border-indigo-100 rounded-2xl p-6 shadow-md flex justify-between items-center overflow-hidden">
                 <div className="z-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Your Improvement Roadmap</h3>
                    <p className="text-xs text-gray-500">Based on your weak areas & performance</p>
                 </div>
                 <div className="z-10 bg-indigo-600 text-white rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 </div>
                 
                 {/* Decorative background circle */}
                 <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-50 rounded-full z-0"></div>
              </div>
           </div>
        </div>

        {/* --- BOTTOM SHEETS --- */}

        {/* 1. Leaderboard Sheet */}
        <BottomSheet 
          isOpen={showLeaderboard} 
          onClose={() => setShowLeaderboard(false)} 
          title="Class Leaderboard"
        >
           <div className="space-y-0">
             <div className="bg-indigo-50 p-4 rounded-xl mb-6 text-center">
                <p className="text-sm text-indigo-800 font-medium">Your Current Rank</p>
                <p className="text-3xl font-black text-indigo-900">{MOCK_DATA.rank}</p>
             </div>
             {[
               { rank: 1, name: "Sanya Sharma", marks: 98 },
               { rank: 2, name: "Amit Patel", marks: 96 },
               { rank: 3, name: "Priya Singh", marks: 95 },
               { rank: "...", name: "...", marks: "..." },
               { rank: 1245, name: "Rahul (You)", marks: 45, isMe: true },
               { rank: 1246, name: "Vikram R.", marks: 44 },
             ].map((student, i) => (
               <div key={i} className={`flex justify-between items-center p-3 border-b border-gray-100 ${student.isMe ? 'bg-blue-50 -mx-4 px-7' : ''}`}>
                  <div className="flex items-center space-x-4">
                     <span className={`w-6 text-center font-bold ${student.rank === 1 ? 'text-yellow-500' : 'text-gray-500'}`}>
                       {student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : student.rank}
                     </span>
                     <span className={`font-medium ${student.isMe ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>{student.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{student.marks}</span>
               </div>
             ))}
           </div>
        </BottomSheet>

        {/* 3. Improvement Plan Sheet */}
        <BottomSheet 
          isOpen={showPlan} 
          onClose={() => setShowPlan(false)} 
          title="Your Action Plan"
        >
           {loadingPlan ? (
             <div className="flex justify-center py-10">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
             </div>
           ) : (
             <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 text-sm mb-1">Focus Area: Physics</h4>
                  <p className="text-xs text-blue-700">This is your weakest link. Improving here will boost your rank significantly.</p>
                </div>

                <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pl-6 py-2">
                  {aiPlan.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center bg-indigo-600"></div>
                      
                      <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">
                        {idx === 0 ? "Step 1: Revise Concepts" : idx === 1 ? "Step 2: Practice" : "Step 3: Exam Strategy"}
                      </h5>
                      <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setShowPlan(false)}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform"
                >
                  Got it, I'll start today!
                </button>
             </div>
           )}
        </BottomSheet>

      </div>
    </div>
  );
};

export default App;
