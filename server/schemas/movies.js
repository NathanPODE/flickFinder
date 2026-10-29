import { z } from 'zod';

export const moviePostSchema = z.object({
  movie: z.object({
    id: z.number({
    error: (issue) => issue.input === undefined
        ? 'TMDB ID is required'
        : 'TMDB ID must be a number',
    }).int(),
    title: z.string().min(1, "Title is required").max(255, "Title must be under 255 characters"),
    poster_path: z.string().max(255).nullable().optional(),
    overview: z.string().nullable().optional(), 
    watched: z.boolean().optional().default(false),
  })
});

export default moviePostSchema