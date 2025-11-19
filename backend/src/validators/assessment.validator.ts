import { z } from 'zod';

// Create assessment validation schema
export const createAssessmentSchema = z.object({
  body: z.object({
    businessProfileId: z.string().uuid('Invalid business profile ID'),
  }),
});

// Get assessment by ID validation schema
export const getAssessmentByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid assessment ID'),
  }),
});

// Save responses validation schema
export const saveResponsesSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid assessment ID'),
  }),
  body: z.object({
    responses: z.array(
      z.object({
        questionId: z.string().uuid('Invalid question ID'),
        answer: z.any(), // Can be any type (boolean, string, number, object)
      })
    ),
  }),
});

// Submit assessment validation schema
export const submitAssessmentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid assessment ID'),
  }),
});

// Delete assessment validation schema
export const deleteAssessmentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid assessment ID'),
  }),
});
