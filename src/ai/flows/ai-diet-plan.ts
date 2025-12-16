'use server';
/**
 * @fileOverview AI-powered diet plan generation flow.
 *
 * - aiDietPlan - A function that generates diet plans based on user input.
 * - AiDietPlanInput - The input type for the aiDietPlan function.
 * - AiDietPlanOutput - The return type for the aiDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDietPlanInputSchema = z.object({
  dietaryPreference: z
    .enum(['omnivore', 'vegetarian', 'vegan', 'keto', 'paleo'])
    .describe('The user\'s primary dietary preference.'),
  healthGoals: z
    .string()
    .describe('The user\'s main health goals, e.g., weight loss, muscle gain, general wellness.'),
  allergies: z
    .string()
    .optional()
    .describe('A list of any food allergies the user has, e.g., "peanuts, shellfish, gluten".'),
    dailyMeals: z
    .enum(['3', '4', '5'])
    .describe('The number of meals the user wants to have per day.'),
});
export type AiDietPlanInput = z.infer<
  typeof AiDietPlanInputSchema
>;

const AiDietPlanOutputSchema = z.object({
  dietPlan: z
    .string()
    .describe('A personalized 7-day diet plan formatted in Markdown.'),
});
export type AiDietPlanOutput = z.infer<
  typeof AiDietPlanOutputSchema
>;

export async function aiDietPlan(
  input: AiDietPlanInput
): Promise<AiDietPlanOutput> {
  return aiDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDietPlanPrompt',
  input: {schema: AiDietPlanInputSchema},
  output: {schema: AiDietPlanOutputSchema},
  prompt: `You are a world-class nutritionist and dietary expert. Your task is to create a personalized, healthy, and balanced 7-day meal plan based on the user's details.

**Instructions for the Output:**
- **Structure:** Create a plan for a full 7 days (Day 1, Day 2, etc.). For each day, list out the meals based on the user's preference (e.g., Breakfast, Lunch, Dinner, Snack).
- **Formatting:** Use Markdown for formatting. Use headings for each day (e.g., "### Day 1") and bullet points for each meal. Use bold text for meal names (e.g., "**Breakfast:**").
- **Content:** Provide simple, healthy meal ideas. Include estimated calorie counts for each meal.
- **Clarity:** Be clear and concise.
- **Disclaimer:** Always include a disclaimer at the end advising the user to consult with a healthcare professional or registered dietitian before making significant dietary changes.

**User Details:**
- **Dietary Preference:** {{{dietaryPreference}}}
- **Health Goals:** {{{healthGoals}}}
- **Allergies:** {{{allergies}}}
- **Meals Per Day:** {{{dailyMeals}}}

Now, create the personalized 7-day diet plan.`,
});

const aiDietPlanFlow = ai.defineFlow(
  {
    name: 'aiDietPlanFlow',
    inputSchema: AiDietPlanInputSchema,
    outputSchema: AiDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
