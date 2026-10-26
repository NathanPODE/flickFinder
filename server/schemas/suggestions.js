import { z } from 'zod'

const suggestionsSchema = z.object({
  prompt: z.string().min(1, { message: 'Prompt is required' }),
  excludeTitles: z.array(z.string()).optional(),
})

export default suggestionsSchema