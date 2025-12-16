'use server';

import { aiWorkoutRecommendations, AiWorkoutRecommendationsInput } from '@/ai/flows/ai-workout-recommendations';
import { aiDietPlan, AiDietPlanInput } from '@/ai/flows/ai-diet-plan';


export async function getAIWorkout(input: AiWorkoutRecommendationsInput) {
    try {
        const result = await aiWorkoutRecommendations(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to generate workout plan. Please try again later.' };
    }
}

export async function getAIDietPlan(input: AiDietPlanInput) {
    try {
        const result = await aiDietPlan(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to generate diet plan. Please try again later.' };
    }
}
