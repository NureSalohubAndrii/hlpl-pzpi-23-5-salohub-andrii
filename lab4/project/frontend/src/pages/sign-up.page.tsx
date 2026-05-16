import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  signUpFormSchema,
  type SignUpFormErrors,
  type SignUpFormValues,
} from '../validation/sign-up.validation';
import { toast } from 'sonner';
import { useRegisterMutation } from '../queries/auth.queries';
import { Link, useNavigate } from '@tanstack/react-router';
import { ApiError } from '../api/client';

const SignUpPage = () => {
  const { mutateAsync: register, isPending } = useRegisterMutation();
  const navigate = useNavigate();

  const [values, setValues] = useState<SignUpFormValues>({
    fullName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<SignUpFormErrors>({});

  const handleChange = (
    field: keyof SignUpFormValues,
    value: string | boolean
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = signUpFormSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: SignUpFormErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignUpFormValues;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }

        toast.info('Validation Error', {
          description: 'Please check all fields and try again',
        });
        setErrors(fieldErrors);
        return;
      }
    }

    void (async () => {
      try {
        await register(values);
        toast.success('Account Created Successfully', {
          description: 'Check your email to verify your account',
        });
        navigate({ to: '/verify-email' });
      } catch (error) {
        const message = error instanceof ApiError ? error.message : 'Registration failed';
        toast.error('Authentication error', { description: message });
      }
    })();

    setErrors({});
  };

  return (
    <div className="w-full max-w-sm mt-8">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-2xl">Create an account</h1>
          <p className="text-muted-foreground text-sm">
            Sign up to get started with our platform
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            className="bg-background"
            placeholder="John Doe"
            value={values.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            disabled={isPending}
          />
          {errors.fullName && (
            <p className="text-destructive text-sm">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            className="bg-background"
            placeholder="you@example.com"
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={isPending}
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            className="bg-background"
            placeholder="Create a strong password"
            type="password"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            disabled={isPending}
          />
          <p className="text-muted-foreground text-xs">
            Must contain uppercase, lowercase, and number
          </p>
          {errors.password && (
            <p className="text-destructive text-sm">{errors.password}</p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? 'Creating Account...' : 'Create Account'}
        </Button>

        <p className="text-center text-muted-foreground text-sm">
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
