import { z } from 'zod'

export const emailField = z.string({error: (issue) => issue.input === undefined
            ? 'Email is required'
            : 'Email must be a string',
}).trim()
        .toLowerCase()
        .min(1, { error: 'Email is required' })
        .email({ error: 'Must be a valid email' })
        .max(255, { error: 'Email must be 255 characters or fewer' })

export const currentPasswordField = z.string({
        error: (issue) => issue.input === undefined
            ? 'Password is required'
            : 'Password must be a string',
})
        .min(1, { error: 'Password is required' })


const registerSchema = z.object({
    email: emailField,
    password: z.string({
        error: (issue) => issue.input === undefined
            ? 'Password is required'
            : 'Password must be a string',
    })
        .min(8, { error: 'Password must be at least 8 characters' })
        .max(72, { error: 'Password must be 72 characters or fewer' }),
})

export const changeEmailSchema = z.object({
    newEmail: emailField,
    password: currentPasswordField,
})

export const deleteAccountSchema = z.object({
    password: currentPasswordField,
})

export default registerSchema