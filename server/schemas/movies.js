import { z } from 'zod';

export const moviePostSchema = z.object({
  movie: z.object({
    id: z.number({ required_error: "TMDB ID is required" }).int(), 
    title: z.string().min(1, "Title is required").max(255, "Title must be under 255 characters"),
    poster_path: z.string().max(255).nullable().optional(),
    overview: z.string().nullable().optional(), 
    watched: z.boolean().optional().default(false),
  })
});

export default moviePostSchema