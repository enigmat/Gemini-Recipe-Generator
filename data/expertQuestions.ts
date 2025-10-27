import { ExpertQuestion } from '../types';

export const initialExpertQuestions: ExpertQuestion[] = [
    {
        id: 'q1',
        question: 'Is it safe to use a wooden cutting board for raw chicken? How do I properly sanitize it afterwards?',
        topic: 'Food Safety',
        status: 'Answered',
        submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        answer: {
            chefName: 'Jean-Pierre Dubois',
            answeredDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            text: "That's an excellent question! While plastic boards can go in the dishwasher, wood is naturally antimicrobial. It's safe for raw chicken if you clean it properly. Immediately after use, wash it with hot, soapy water. For deep sanitization, you can spray it with white vinegar, let it sit, then wipe. Never soak a wooden board in water, as it can warp and crack. A monthly conditioning with food-grade mineral oil will also keep it in great shape!"
        }
    }
];
