'use server';

import { aiWorkoutRecommendations, AiWorkoutRecommendationsInput } from '@/ai/flows/ai-workout-recommendations';

export async function getAIWorkout(input: AiWorkoutRecommendationsInput) {
    try {
        const result = await aiWorkoutRecommendations(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to generate workout plan. Please try again later.' };
    }
}
