'use server';
/**
 * @fileOverview AI-powered workout recommendation flow.
 *
 * - aiWorkoutRecommendations - A function that generates workout recommendations based on user input.
 * - AiWorkoutRecommendationsInput - The input type for the aiWorkoutRecommendations function.
 * - AiWorkoutRecommendationsOutput - The return type for the aiWorkoutRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiWorkoutRecommendationsInputSchema = z.object({
  fitnessGoals: z
    .string()
    .describe('The user fitness goals, e.g., lose weight, gain muscle, improve endurance.'),
  fitnessLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The user current fitness level.'),
  availableEquipment: z
    .string()
    .describe('The equipment available to the user, e.g., dumbbells, treadmill, bodyweight only.'),
  existingHealthRecommendations: z
    .string()
    .optional()
    .describe('Any existing health recommendations for the user.'),
});
export type AiWorkoutRecommendationsInput = z.infer<
  typeof AiWorkoutRecommendationsInputSchema
>;

const AiWorkoutRecommendationsOutputSchema = z.object({
  workoutPlan: z
    .string()
    .describe('A personalized workout plan based on the user inputs.'),
});
export type AiWorkoutRecommendationsOutput = z.infer<
  typeof AiWorkoutRecommendationsOutputSchema
>;

export async function aiWorkoutRecommendations(
  input: AiWorkoutRecommendationsInput
): Promise<AiWorkoutRecommendationsOutput> {
  return aiWorkoutRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiWorkoutRecommendationsPrompt',
  input: {schema: AiWorkoutRecommendationsInputSchema},
  output: {schema: AiWorkoutRecommendationsOutputSchema},
  prompt: `You are a personal trainer that specializes in creating workout plans.

Create a personalized workout plan based on the user's fitness goals, fitness level, and available equipment. Incorporate any existing health recommendations into the workout plan. Make sure the workout plan is safe and effective for the user.

Fitness Goals: {{{fitnessGoals}}}
Fitness Level: {{{fitnessLevel}}}
Available Equipment: {{{availableEquipment}}}
Existing Health Recommendations: {{{existingHealthRecommendations}}}

Workout Plan:`,
});

const aiWorkoutRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiWorkoutRecommendationsFlow',
    inputSchema: AiWorkoutRecommendationsInputSchema,
    outputSchema: AiWorkoutRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
