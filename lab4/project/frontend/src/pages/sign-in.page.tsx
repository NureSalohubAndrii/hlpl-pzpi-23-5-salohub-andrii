import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  signInFormSchema,
  type SignInFormErrors,
  type SignInFormValues,
} from '../validation/sign-in.validation';
import { Link, useNavigate } from '@tanstack/react-router';
import { useLoginMutation } from '../queries/auth.queries';
import { toast } from 'sonner';
import { ApiError } from '../api/client';

const SignInPage = () => {
  const { mutateAsync: login, isPending } = useLoginMutation();
  const navigate = useNavigate();

  const [values, setValues] = useState<SignInFormValues>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<SignInFormErrors>({});

  const handleChange = (field: keyof SignInFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = signInFormSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: SignInFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignInFormValues;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    void (async () => {
      try {
        await login(values);
        toast.success('Signed in successfully', { description: 'Welcome back!' });
        navigate({ to: '/' });
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : 'Invalid email or password';
        toast.error('Sign in failed', { description: message });
      }
    })();

    setErrors({});
  };

  return (
    <div className="w-full max-w-sm mt-8">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-2xl">Welcome back</h1>
          <p className="text-muted-foreground text-sm">
            Enter your credentials to access your account
          </p>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            className="bg-background"
            placeholder="Enter your password"
            type="password"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            disabled={isPending}
          />
          {errors.password && (
            <p className="text-destructive text-sm">{errors.password}</p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? 'Signing in' : 'Sign in'}
        </Button>

        <p className="text-center text-muted-foreground text-sm">
          Don't have an account? <Link to="/">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignInPage;
