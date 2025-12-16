'use server';

import { aiDietPlan, AiDietPlanInput } from '@/ai/flows/ai-diet-plan';

export async function getAIDietPlan(input: AiDietPlanInput) {
    try {
        const result = await aiDietPlan(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to generate diet plan. Please try again later.' };
    }
}
