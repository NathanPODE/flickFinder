import { z } from 'zod'

const registerSchema = z.object({
    email: z.string({
        invalid_type_error: 'Email must be a string'
    })
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email'})
    .max(255, { message: 'Email must be less than 255 characters'}),
    password: z.string({
        invalid_type_error: 'Password must be a string'
    }).min(8, { message: 'Passowrd must be at least 8 characters'})
    .max(72, { message: 'Password must be less than 72 characters'}),
})

export default registerSchema