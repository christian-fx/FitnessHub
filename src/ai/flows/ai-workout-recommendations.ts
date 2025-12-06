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
  prompt: `You are a world-class personal trainer and fitness expert. Your task is to create a personalized, safe, and effective workout plan based on the user's details.

**Instructions for the Output:**
- **Structure:** Format the output clearly with sections like "Workout Overview", "Warm-up", "Main Workout", and "Cool-down".
- **Formatting:** Use Markdown for formatting. Use headings (e.g., "### Warm-up"), bullet points for exercises, and bold text for emphasis on things like sets, reps, or duration.
- **Clarity:** Provide clear and concise instructions for each exercise.
- **Safety:** Always include a disclaimer about consulting a healthcare professional.

**User Details:**
- **Fitness Goals:** {{{fitnessGoals}}}
- **Fitness Level:** {{{fitnessLevel}}}
- **Available Equipment:** {{{availableEquipment}}}
- **Existing Health Recommendations:** {{{existingHealthRecommendations}}}

Now, create the personalized workout plan.`,
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
