'use server';

/**
 * @fileOverview A flow to explain SAFE agreement terms in plain language.
 *
 * - explainSafeTerms - A function that explains SAFE terms.
 * - ExplainSafeTermsInput - The input type for the explainSafeTerms function.
 * - ExplainSafeTermsOutput - The return type for the explainSafeTerms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainSafeTermsInputSchema = z.object({
  investmentAmount: z
    .number()
    .describe('The amount of money invested in the SAFE agreement.'),
  valuationCap: z
    .number()
    .describe(
      'The valuation cap of the SAFE agreement, representing the maximum valuation at which the SAFE converts into equity.'
    ),
  discountRate: z
    .number()
    .describe(
      'The discount rate of the SAFE agreement, representing the percentage discount applied to the price per share at which the SAFE converts into equity.'
    ),
});
export type ExplainSafeTermsInput = z.infer<typeof ExplainSafeTermsInputSchema>;

const ExplainSafeTermsOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A plain language explanation of the SAFE agreement terms and their potential implications.'
    ),
});
export type ExplainSafeTermsOutput = z.infer<typeof ExplainSafeTermsOutputSchema>;

export async function explainSafeTerms(
  input: ExplainSafeTermsInput
): Promise<ExplainSafeTermsOutput> {
  return explainSafeTermsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainSafeTermsPrompt',
  input: {schema: ExplainSafeTermsInputSchema},
  output: {schema: ExplainSafeTermsOutputSchema},
  prompt: `You are an AI assistant specialized in explaining complex financial terms in plain language.

  Based on the following SAFE agreement terms, provide a clear and concise explanation of the terms and their potential implications for a founder without a financial background:

  Investment Amount: {{investmentAmount}}
  Valuation Cap: {{valuationCap}}
  Discount Rate: {{discountRate}}
  `,
});

const explainSafeTermsFlow = ai.defineFlow(
  {
    name: 'explainSafeTermsFlow',
    inputSchema: ExplainSafeTermsInputSchema,
    outputSchema: ExplainSafeTermsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

