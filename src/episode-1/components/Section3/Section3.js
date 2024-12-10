import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useSection } from '../../context/SectionContext';

const Section3 = () => {
  const [insertedPhrases, setInsertedPhrases] = useState({
    slot1: null,
    slot2: null,
    slot3: null,
    slot4: null,
    slot5: null
  });
  const [showPhraseModal, setShowPhraseModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showIncorrectModal, setShowIncorrectModal] = useState(false);
  const { 
    stopTimer,
    startTime,
    endTime 
  } = useSection();

  // Add new state for validation feedback
  const [validationState, setValidationState] = useState({
    slot1: null,
    slot2: null,
    slot3: null,
    slot4: null,
    slot5: null
  });

  // Add new state for loading indicator
  const [isValidating, setIsValidating] = useState(false);

  const phrases = [
    {
      id: 1,
      text: "Your achievements are celebrated and rewarded. Every contribution is recognized.",
      correctPosition: 1
    },
    {
      id: 2,
      text: "Your expertise and skills are invaluable assets that drive our success.",
      correctPosition: 2
    },
    {
      id: 3,
      text: "We prioritize your well-being with comprehensive support systems.",
      correctPosition: 3
    },
    {
      id: 4,
      text: "Your unique perspective shapes our future and guides our direction.",
      correctPosition: 4
    },
    {
      id: 5,
      text: "Take ownership of your role with the autonomy to drive change.",
      correctPosition: 5
    }
  ].sort(() => Math.random() - 0.5);

  const handleInsertClick = (slotId) => {
    setSelectedSlot(slotId);
    setShowPhraseModal(true);
  };

  const handlePhraseSelect = (phrase) => {
    setInsertedPhrases(prev => ({
      ...prev,
      [selectedSlot]: phrase
    }));
    setShowPhraseModal(false);
  };

  const isUsed = (phrase) => {
    return Object.values(insertedPhrases).some(p => p?.id === phrase.id);
  };

  // Update validateOrder function
  const validateOrder = () => {
    setIsValidating(true);
    const newValidationState = {};
    let allCorrect = true;

    Object.entries(insertedPhrases).forEach(([slot, phrase]) => {
      if (!phrase) return;
      const slotNumber = parseInt(slot.replace('slot', ''));
      const isCorrect = phrase.correctPosition === slotNumber;
      newValidationState[slot] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });

    setValidationState(newValidationState);
    
    if (allCorrect) {
      stopTimer();
      setTimeout(() => {
        setIsValidating(false);
        setShowSuccessModal(true);
      }, 5000);
    } else {
      setTimeout(() => {
        setIsValidating(false);
        setValidationState({
          slot1: null,
          slot2: null,
          slot3: null,
          slot4: null,
          slot5: null
        });
      }, 5000);
    }
  };

  // Update the areAllSlotsFilled function to properly check all slots
  const areAllSlotsFilled = () => {
    return Object.values(insertedPhrases).filter(Boolean).length === 5;
  };

  // Add this function to handle removing phrases
  const handleRemovePhrase = (slotId) => {
    setInsertedPhrases(prev => ({
      ...prev,
      [slotId]: null
    }));
  };

  // Update the phrase rendering to include validation feedback
  const renderPhrase = (slotId) => {
    const phrase = insertedPhrases[slotId];
    const isValidated = validationState[slotId] !== null;
    const isCorrect = validationState[slotId];

    if (!phrase) {
      return (
        <button 
          onClick={() => handleInsertClick(slotId)}
          className="w-full p-2 border-2 border-dashed border-orange-500/50 rounded-lg hover:bg-orange-500/10 transition-colors text-orange-400 text-xs"
        >
          + Click to add key message
        </button>
      );
    }

    const evpLabels = {
      slot1: "I AM APPRECIATED",
      slot2: "I AM AN ASSET",
      slot3: "I AM CARED FOR",
      slot4: "I AM VALUED",
      slot5: "I AM EMPOWERED"
    };

    return (
      <div 
        onClick={() => !isValidated && handleRemovePhrase(slotId)}
        className={`relative cursor-pointer p-2 rounded-lg transition-all duration-300
          ${isValidated 
            ? isCorrect
              ? 'bg-green-900/20 border border-green-500/50 text-green-300'
              : 'bg-red-900/20 border border-red-500/50 text-red-300'
            : 'text-orange-300 hover:text-orange-400 hover:bg-gray-800/50'
          }`}
      >
        <p>{phrase.text}</p>
        
        {/* EVP Badge for correct phrases */}
        {isValidated && isCorrect && (
          <div className="absolute -top-3 right-2 px-2 py-1 bg-green-900/90 text-green-300 text-[10px] rounded-full border border-green-500/50">
            {evpLabels[slotId]}
          </div>
        )}
      </div>
    );
  };

  // Add formatTime helper function at the top
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-full bg-gray-900 text-white">
      <div className="w-full h-full bg-gray-800">
        <div className="prose prose-invert max-w-none h-full">
          <h1 className="text-xl font-bold text-center text-orange-400 pt-8">
            Join Our Team of Pioneers at Mashreq
          </h1>

          <div className="grid grid-cols-2 gap-8 text-xs w-full h-full p-8 px-32">
            {/* Left Column */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Dear Future Pioneer,</p>

              <p>
                At Mashreq, we're looking for innovators who are ready to shape the future of banking. 
                Here's why you should join us:
              </p>

              {/* Appreciation */}
              {renderPhrase('slot1')}
              <p>Our recognition programs ensure your hard work never goes unnoticed.</p>

              {/* Asset */}
              {renderPhrase('slot2')}
              <p>We invest in your growth through continuous learning and development opportunities.</p>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              {/* Care */}
              {renderPhrase('slot3')}
              <p>Our comprehensive benefits package reflects our commitment to your health and happiness.</p>

              {/* Value */}
              {renderPhrase('slot4')}
              <p>Your ideas and insights drive our innovation and shape our future strategies.</p>

              {/* Empowerment */}
              {renderPhrase('slot5')}
              <p>We believe in giving you the freedom to make decisions and lead initiatives.</p>

              <p className="text-sm font-semibold mt-4">
                Join us in shaping the future of banking.
              </p>
            </div>
          </div>

          {/* Validate button */}
          <div className="absolute bottom-8 right-8 flex items-center gap-3">
            {isValidating && (
              <div className="flex items-center gap-2 text-orange-400 bg-gray-800/80 px-3 py-2 rounded-lg">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-sm">
                  {Object.values(validationState).every(v => v === true) ? 'Well done!' : 'Try again'}
                </span>
              </div>
            )}
            <button
              onClick={validateOrder}
              disabled={!areAllSlotsFilled() || isValidating}
              className={`px-4 py-2 rounded-lg transition-colors text-white text-sm font-semibold shadow-lg
                ${areAllSlotsFilled() && !isValidating
                  ? 'bg-orange-500 hover:bg-orange-600 cursor-pointer' 
                  : 'bg-gray-600 cursor-not-allowed opacity-50'}`}
            >
              {!areAllSlotsFilled() 
                ? `Place All Phrases (${Object.values(insertedPhrases).filter(Boolean).length}/5)` 
                : 'Validate Order'}
            </button>
          </div>
        </div>
      </div>

      {/* Instructions Button */}
      <button
        onClick={() => setShowInstructions(true)}
        className="absolute bottom-6 left-6 p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors shadow-lg flex items-center justify-center text-orange-400 hover:text-orange-300"
      >
        <HelpCircle size={24} />
      </button>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowInstructions(false)}
          />
          <div className="relative bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-orange-400">Instructions</h3>
            <div className="space-y-4 text-sm">
              <p>
                Complete the hiring advertisement by placing the correct phrases in the right order.
              </p>
              <p>
                Click the "+" buttons to select and insert phrases into the text.
              </p>
              <p>
                The phrases need to be arranged in a logical order to create a compelling message.
              </p>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-6 w-full p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Phrase Selection Modal */}
      {showPhraseModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPhraseModal(false)}
          />
          <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4 rounded-lg max-w-md w-full mx-4 shadow-2xl border border-orange-500/20">
            {/* Close button */}
            <button 
              onClick={() => setShowPhraseModal(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white border border-gray-700 shadow-lg transition-colors text-sm"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-3">
              <h3 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Select Message
              </h3>
            </div>

            {/* Phrases */}
            <div className="space-y-2">
              {phrases.map(phrase => (
                <button
                  key={phrase.id}
                  onClick={() => handlePhraseSelect(phrase)}
                  disabled={isUsed(phrase)}
                  className={`group w-full p-2 rounded-lg text-left transition-all duration-300 text-xs
                    ${isUsed(phrase)
                      ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-gray-800 hover:bg-gray-750 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 hover:border-orange-500/30'
                    } relative overflow-hidden border border-gray-700/50`}
                >
                  {/* Hover effect overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    ${isUsed(phrase) ? 'hidden' : ''}`} 
                  />
                  
                  {/* Text content */}
                  <div className="relative z-10">
                    <p>{phrase.text}</p>
                  </div>

                  {/* Used indicator */}
                  {isUsed(phrase) && (
                    <div className="absolute top-1 right-1 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-xl max-w-md mx-4 text-center border border-orange-500/20 shadow-2xl">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-orange-400 mb-4">
              Congratulations! Episode 1 Complete!
            </h2>
            
            <div className="space-y-4 mb-6">
              {/* Add final time display */}
              <div className="bg-gray-900/50 p-3 rounded-lg border border-orange-500/20">
                <p className="text-sm text-gray-400 mb-1">Your Time</p>
                <p className="text-2xl font-bold text-orange-400">
                  {formatTime(endTime - startTime)}
                </p>
              </div>

              <p className="text-sm text-gray-300">
                You've discovered our Employee Value Propositions:
              </p>
              
              <div className="space-y-2 text-sm font-semibold">
                <p className="text-orange-300">I AM APPRECIATED</p>
                <p className="text-orange-300">I AM AN ASSET</p>
                <p className="text-orange-300">I AM CARED FOR</p>
                <p className="text-orange-300">I AM VALUED</p>
                <p className="text-orange-300">I AM EMPOWERED</p>
              </div>
            </div>

            <a
              href="/"
              className="block w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors text-sm font-semibold"
            >
              Return Home
            </a>
          </div>
        </div>
      )}

      {/* Incorrect Order Modal - matching DroneGame style */}
      {showIncorrectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 p-8 rounded-xl max-w-lg mx-4 text-center border border-red-500/20 shadow-2xl">
            <div className="text-6xl mb-6">❌</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Incorrect Order
            </h2>
            <p className="text-gray-300 mb-8">
              The phrases are not in the right order. Try rearranging them to create a more logical flow.
            </p>
            <button
              onClick={() => setShowIncorrectModal(false)}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section3; 