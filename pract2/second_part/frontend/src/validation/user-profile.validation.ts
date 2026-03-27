import { z } from 'zod';

export const userProfileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  avatarUrl: z.string().optional().or(z.literal('')),
});

export type UserProfileFormValues = z.infer<typeof userProfileFormSchema>;
export type UserProfileFormErrors = Partial<
  Record<keyof UserProfileFormValues, string>
>;
