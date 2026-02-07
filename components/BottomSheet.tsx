
import React from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 transition-opacity duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* 
         Centered Modal Card 
         - max-h-[85vh]: Ensures vertical margins even on short screens
         - w-full max-w-md: Ensures horizontal margins on mobile, constrained width on desktop
         - rounded-3xl: Friendly aesthetics
      */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-pop-in p-6 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5 shrink-0">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 rounded-full bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.95) translateY(10px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
