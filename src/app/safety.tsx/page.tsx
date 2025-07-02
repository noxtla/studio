// src/app/safety.tsx/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

import HorizontalTabBar from '@/components/common/horizontal-tab-bar'; // Import the new component

// --- Data Types ---
interface QuizCard {
  q: string; // Question
  a: string; // Answer
  status: 'new' | 'correct' | 'incorrect';
  reviewCounter: number;
  completedOnce: boolean; // To know if it has been answered correctly at least once
}

interface QuizSection {
  name: string;
  questions: Array<{ q: string; a: string }>;
}

// --- Quiz Data (Translated to English) ---
const sectionsData: QuizSection[] = [
  {
    name: "General Site Safety",
    questions: [
      { q: "What is the first step before starting any arboriculture work?", a: "A complete work site inspection to identify hazards such as power lines, unstable ground, and the condition of the tree." },
      { q: "Name 3 essential pieces of Personal Protective Equipment (PPE) for an arborist.", a: "Helmet, eye protection, and hearing protection. Chainsaw trousers/chaps and safety boots are also crucial." },
      { q: "What is the minimum approach distance to power lines with voltages up to 50kV according to ANSI Z133?", a: "10 feet (approximately 3 meters)." },
      { q: "What should a pre-work safety meeting (tailgate meeting) include?", a: "Discussion of the day's specific hazards, task assignments, emergency response plan, and communication confirmation." },
      { q: "Why is it crucial to establish a 'drop zone'?", a: "To keep personnel and the public safe from falling branches and debris. It must be clearly marked and controlled." },
      { q: "Practical Question: You are about to prune a large tree near a busy sidewalk. What measures do you take to ensure public safety?", a: "Establish a safe work zone with cones and caution tape, use a ground spotter to control pedestrian traffic, and clearly communicate hazards." }
    ]
  },
  {
    name: "Chainsaw Safety",
    questions: [
      { q: "What is chainsaw 'kickback' and how can it be prevented?", a: "It is a violent, upward reaction of the guide bar. It is prevented by avoiding cutting with the tip of the bar and maintaining a firm two-handed grip." },
      { q: "What PPE is mandatory when operating a chainsaw?", a: "Head, eye, ear, and hand protection, along with cut-resistant chaps or trousers, and safety boots." },
      { q: "How should a chainsaw be safely started on the ground?", a: "Placing your boot on the rear handle, a firm hand on the front handlebar, and pulling the starter cord with the other hand, ensuring the chain brake is engaged." },
      { q: "Describe the correct body posture for operating a chainsaw.", a: "Feet shoulder-width apart for good balance, knees bent, and a straight back to use your body as leverage." },
      { q: "When should the chain brake be engaged?", a: "Before starting the saw, when walking (even short distances), and whenever the saw is not actively cutting." },
      { q: "Practical Question: You are cutting a large branch on the ground. The branch is under tension. Where do you make the first cut to safely release it?", a: "Make a small cut on the compression side first, followed by the main cut on the tension side to prevent the saw from getting pinched." }
    ]
  },
  {
    name: "Manual Climbing Techniques",
    questions: [
      { q: "What is a 'Tie-In Point' (TIP) and what characteristics should a good one have?", a: "It is the point on the tree where the climbing rope is anchored. It should be on a strong, live branch union, capable of supporting the climber's dynamic load." },
      { q: "Name two climbing hitches commonly used by arborists.", a: "The Prusik and Blake's Hitch are two classic examples. More modern knots like the Tautline Hitch are also common." },
      { q: "What does the 'three points of contact' rule mean when climbing?", a: "Always maintain two hands and one foot, or two feet and one hand, in stable contact with the tree to ensure stability." },
      { q: "Why is it unsafe to use gaffs (spurs) on a tree that will not be removed?", a: "Because the wounds they create can open pathways for diseases and pests, damaging the tree's long-term health." },
      { q: "What inspection should you perform on your climbing rope before each use?", a: "Visual and tactile inspection along its entire length, looking for cuts, abrasions, glazed areas (from heat), or any deformities." },
      { q: "Practical Question: You are halfway through a climb and need to position yourself for a cut. What system do you use to stay safe and stable?", a: "Use a positioning lanyard in addition to your main climbing system. The lanyard provides a second anchor point and allows for precise positioning." }
    ]
  },
  {
    name: "Bucket Truck Operation",
    questions: [
      { q: "What should be checked in the daily inspection of a bucket truck before use?", a: "Fluid levels, operating controls (upper and lower), condition of hydraulic hoses, and the stability of outriggers." },
      { q: "Why is it crucial to level the truck before extending the boom?", a: "To ensure vehicle stability and prevent tip-over. The truck's level indicator must be within the manufacturer's specified limits." },
      { q: "When working from a bucket, is it mandatory to use a harness and a lanyard?", a: "Yes, always. The climber must be anchored to the designated anchor point in the bucket, not to the boom or the tree." },
      { q: "What danger does the 'whiplash effect' pose in an aerial bucket?", a: "If the boom is struck or moves suddenly, the bucket can swing violently, potentially ejecting the operator or striking them against an object." },
      { q: "Can a bucket truck be used to lift or drag heavy loads?", a: "No. Aerial buckets are designed for positioning personnel, not for use as a crane, unless specifically rated for it." },
      { q: "Practical Question: You are operating the bucket and realize a branch you are about to cut might fall on the lower controls. What do you do?", a: "Stop the work, reposition the truck, or plan the cut so the branch falls into a safe zone, away from controls and ground personnel." }
    ]
  },
  {
    name: "Rigging and Cutting Techniques",
    questions: [
      { q: "Describe the difference between a 'notch cut' and a 'back cut'.", a: "The notch cut is made on the side where the piece is intended to fall and guides the fall. The back cut is made on the opposite side to release the piece." },
      { q: "What is 'hinge wood' and why is it vital when felling a tree?", a: "It is the wood left uncut between the notch and the back cut. It controls the speed and direction of the tree's fall." },
      { q: "What is a rigging system in arboriculture?", a: "A system of ropes, pulleys, and friction devices used to controllably lower sections of a tree being dismantled." },
      { q: "What is the function of a 'friction device' in rigging?", a: "It is anchored at the base of the tree to add friction to the rigging rope, allowing ground personnel to control the descent of heavy pieces." },
      { q: "Explain the concept of 'rope angle' in rigging and why it is important.", a: "Acute rope angles (less than 45 degrees) multiply forces on the anchor and equipment, potentially causing failures. Wider angles should be sought." },
      { q: "Practical Question: You need to remove a large branch hanging over a roof. What cutting and rigging technique would you use?", a: "Install a rigging anchor point above the branch. Tie off the branch and make a bottom notch cut, then a top cut to release it, lowering it controllably with the rigging system." }
    ]
  }
];

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export default function SafetyModulesPage() {
  const { toast } = useToast();

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [activeDeck, setActiveDeck] = useState<QuizCard[]>([]);
  const [currentCard, setCurrentCard] = useState<QuizCard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [elaboration, setElaboration] = useState<string | null>(null);
  const [isElaborating, setIsElaborating] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); // Controls if quiz or initial/final message is shown

  // Get section labels for the tab bar
  const sectionLabels = sectionsData.map(section => section.name);

  const getProgress = useCallback(() => {
    const completedCount = activeDeck.filter(card => card.completedOnce).length;
    const totalCount = activeDeck.length;
    return totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  }, [activeDeck]);

  const displayMessage = useCallback((sectionName: string, isCompleted: boolean = false) => {
    setQuizStarted(false); // Hide quiz interface
    setShowAnswer(false); // Hide answer if visible
    setElaboration(null); // Hide elaboration
    setIsElaborating(false); // Hide elaboration spinner

    if (isCompleted) {
      toast({
        title: "Section Completed",
        description: `Congratulations! You have completed the ${sectionName} section.`,
        variant: "default",
      });
    }
  }, [toast]);

  const loadSection = useCallback(() => {
    setQuizStarted(true); // Show quiz interface
    setShowAnswer(false);
    setElaboration(null);
    setIsElaborating(false);

    const initialDeck: QuizCard[] = sectionsData[currentSectionIndex].questions.map(card => ({
      ...card,
      status: 'new',
      reviewCounter: 0,
      completedOnce: false
    }));
    shuffleArray(initialDeck);
    setActiveDeck(initialDeck);
    
    // Show the first card
    // Small delay to ensure state updates before displaying
    setTimeout(() => { 
      showNextCard(initialDeck);
    }, 0);
  }, [currentSectionIndex]);

  // New function to handle tab clicks
  const handleTabClick = useCallback((label: string) => {
    const newIndex = sectionLabels.indexOf(label);
    if (newIndex !== -1 && newIndex !== currentSectionIndex) {
      setCurrentSectionIndex(newIndex);
      // The useEffect below will handle calling displayMessage for the new section.
    }
  }, [currentSectionIndex, sectionLabels]);

  const showNextCard = useCallback((deck?: QuizCard[]) => {
    const deckToUse = deck || activeDeck; // Allow passing the newly loaded deck

    setShowAnswer(false);
    setElaboration(null);
    setIsElaborating(false);

    // Decrement review counters for all waiting cards
    const updatedDeck = deckToUse.map(card => {
      if (card.reviewCounter > 0) {
        return { ...card, reviewCounter: card.reviewCounter - 1 };
      }
      return card;
    });
    setActiveDeck(updatedDeck);

    let eligibleCards = updatedDeck.filter(card => card.reviewCounter <= 0 && !card.completedOnce);

    if (eligibleCards.length === 0) {
      eligibleCards = updatedDeck.filter(card => card.reviewCounter <= 0); // Check if there are cards to review
      if (eligibleCards.length === 0) {
        // If no eligible cards left, the section is complete
        displayMessage(sectionsData[currentSectionIndex].name, true);
        return;
      }
    }

    // Prioritize incorrect cards, then new, then correct for review
    const nextCard = eligibleCards.find(c => c.status === 'incorrect') || eligibleCards.find(c => c.status === 'new') || eligibleCards[0];

    setCurrentCard(nextCard);
  }, [activeDeck, currentSectionIndex, displayMessage]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (!currentCard) return;

    const updatedDeck = activeDeck.map(card => {
      if (card.q === currentCard.q) { // Identify the current card
        return {
          ...card,
          status: isCorrect ? 'correct' : 'incorrect',
          reviewCounter: isCorrect ? 10 : 3, // Review after X cards
          completedOnce: isCorrect ? true : card.completedOnce,
        };
      }
      return card;
    });
    setActiveDeck(updatedDeck);

    const allCompleted = updatedDeck.every(card => card.completedOnce);
    if (allCompleted) {
      displayMessage(sectionsData[currentSectionIndex].name, true);
    } else {
      showNextCard(updatedDeck); // Pass the updated deck to showNextCard
    }
  }, [activeDeck, currentCard, currentSectionIndex, displayMessage, showNextCard]);

  // Simulating elaboration without an API Key
  const handleElaborate = useCallback(async () => {
    if (!currentCard) return;

    setIsElaborating(true);
    setElaboration(null); // Clear any previous elaboration

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulated elaboration message
    setElaboration(
      "This is an example elaboration. " +
      "Safety in arboriculture work is fundamental to protect yourself and those around you. " +
      "Failure to follow rules can lead to serious accidents, such as falls from heights, severe chainsaw cuts, " +
      "or electrocutions from contact with power lines. " +
      "For example, if you don't wear a helmet, a small falling branch could cause a severe brain injury. " +
      "Always prioritize your PPE and safety guidelines."
    );
    setIsElaborating(false);
  }, [currentCard]);


  // --- Initialization effect on page load ---
  useEffect(() => {
    // When changing sections, reset quiz state and show the welcome message for the new section
    displayMessage(sectionsData[currentSectionIndex].name, false);
    setActiveDeck([]); // Clear the active deck for the new section
    setCurrentCard(null); // Ensure no active card
  }, [currentSectionIndex, displayMessage]);


  return (
    // Outer container: takes full height, sets background color, uses flexbox to center content.
    // Padding `p-4` ensures some margin on all screen sizes for the entire content.
    <div className="flex flex-col min-h-screen bg-quiz-background-light p-4 items-center">

      {/* Page Title:
          - `w-full max-w-2xl mx-auto`: Centers the title and limits its width on larger screens for readability.
          - `text-center`: ensures text is centered.
          - `mb-4 sm:mb-6`: responsive bottom margin to separate it from the tab bar.
      */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center w-full max-w-2xl mx-auto mb-4 sm:mb-6">
        Arborist Safety Study Flashcards
      </h1>

      {/* Horizontal Tab Bar Container (NOW FULL WIDTH)
          - `w-full`: Ensures it spans the entire width of the parent (which is `p-4` wide).
          - `mb-4 sm:mb-6`: responsive bottom margin to separate it from the content below.
          - No `max-w-2xl` here, allowing it to expand.
          - The HorizontalTabBar component itself (`src/components/common/horizontal-tab-bar.tsx`)
            handles its internal responsiveness (scrolling on small screens, centering tabs on larger).
      */}
      <div className="w-full mb-4 sm:mb-6">
        <HorizontalTabBar
          labels={sectionLabels}
          activeTab={sectionsData[currentSectionIndex].name}
          onTabClick={handleTabClick}
        />
      </div>

      {/* Main Content Wrapper (Progress Bar, Flashcards, Messages)
          - `w-full max-w-2xl mx-auto`: Limits this block's width and centers it,
            ensuring that the *cards themselves* stay within a readable content column.
          - `space-y-4 sm:space-y-6`: responsive vertical spacing between the progress bar and the card.
      */}
      <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">

        {/* Progress Bar: Responsive height. */}
        {quizStarted && (
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
            <Progress value={getProgress()} className="h-full rounded-full bg-quiz-success-green" />
          </div>
        )}

        {/* Flashcard Display Area (Card component) */}
        {quizStarted && currentCard && (
          <Card className="rounded-quiz-md p-4 sm:p-6 flex flex-col justify-between items-center shadow-lg min-h-[180px] sm:min-h-[200px] bg-quiz-section-bg">
            <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
              {currentSectionIndex !== null ? sectionsData[currentSectionIndex].name : 'Loading Section...'}
            </p>
            <div className="flex-grow flex flex-col justify-center items-center w-full">
              <div className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-5 min-h-[70px] sm:min-h-[80px] flex items-center justify-center text-center w-full">
                {currentCard.q}
              </div>
              {showAnswer && (
                <div className="text-lg sm:text-xl font-normal text-gray-700 min-h-[70px] sm:min-h-[80px] flex items-center justify-center text-center w-full animate-in fade-in duration-300">
                  {currentCard.a}
                </div>
              )}
              {isElaborating ? (
                <div className="flex justify-center items-center h-[50px] w-full mt-4">
                  <Loader2 className="h-6 w-6 animate-spin text-quiz-action" />
                </div>
              ) : (
                elaboration && (
                  <div className="bg-quiz-elaboration-green border-l-4 border-quiz-elaboration-border text-quiz-elaboration-text p-3 sm:p-4 rounded-quiz-md mt-3 sm:mt-4 text-sm text-left shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
                    {elaboration}
                  </div>
                )
              )}
            </div>
            <div className="w-full flex flex-col items-center gap-3 sm:gap-4 mt-auto">
              {!showAnswer && (
                <Button
                  onClick={() => setShowAnswer(true)}
                  className="w-full max-w-xs bg-quiz-action hover:bg-quiz-action-darker py-2 sm:py-3 rounded-quiz-sm font-semibold shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg text-base sm:text-lg"
                >
                  Reveal Answer
                </Button>
              )}
              {showAnswer && (
                <>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full max-w-md">
                    <Button
                      onClick={() => handleAnswer(true)}
                      className="flex-1 bg-quiz-success-green hover:bg-quiz-success-green-darker py-2 sm:py-3 rounded-quiz-sm font-semibold shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg text-sm sm:text-base"
                    >
                      Correct (review in 10 cards)
                    </Button>
                    <Button
                      onClick={() => handleAnswer(false)}
                      className="flex-1 bg-quiz-danger-red hover:bg-quiz-danger-red-darker py-2 sm:py-3 rounded-quiz-sm font-semibold shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg text-sm sm:text-base"
                    >
                      Incorrect (review in 3 cards)
                    </Button>
                  </div>
                  <Button
                    onClick={handleElaborate}
                    disabled={isElaborating}
                    className={cn(
                      "w-full max-w-xs bg-quiz-action hover:bg-quiz-action-darker py-2 sm:py-3 rounded-quiz-sm font-semibold shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg text-base sm:text-lg",
                      isElaborating && "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-md"
                    )}
                  >
                    {isElaborating ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      "✨ Elaborate Answer ✨"
                    )}
                  </Button>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Section Completion / Welcome Message (Card component) */}
        {!quizStarted && (
          <Card className="rounded-quiz-md p-4 sm:p-5 font-medium flex flex-col gap-3 sm:gap-4 bg-quiz-message-blue text-quiz-message-blue-text shadow-lg">
            <p className="text-base sm:text-lg">
              Welcome to the {sectionsData[currentSectionIndex].name} section. Click "Start Section" to begin.
            </p>
            <Button
              onClick={loadSection}
              className="bg-quiz-action hover:bg-quiz-action-darker py-2 sm:py-3 rounded-quiz-sm font-semibold shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg text-base sm:text-lg"
            >
              Start Section
            </Button>
            {activeDeck.length > 0 && activeDeck.every(card => card.completedOnce) && currentSectionIndex < sectionsData.length - 1 && (
              <Button
                onClick={() => {
                  setCurrentSectionIndex(prev => prev + 1);
                }}
                className="bg-quiz-action hover:bg-quiz-action-darker py-2 sm:py-3 rounded-quiz-sm font-semibold shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg text-base sm:text-lg mt-2"
              >
                Go to Next Section
              </Button>
            )}
            {currentSectionIndex === sectionsData.length - 1 && activeDeck.length > 0 && activeDeck.every(card => card.completedOnce) && (
              <p className="text-base sm:text-lg font-bold mt-2">You have completed all sections!</p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}