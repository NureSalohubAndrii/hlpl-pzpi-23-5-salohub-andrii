import { useId, useState } from 'react';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '../components/ui/input-otp';
import { Label } from '../components/ui/label';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const id = useId();
  const [code, setCode] = useState<string>('');
  const { verifyEmail, isLoading } = useVerifyEmail();

  const handleChange = async (value: string) => {
    setCode(value);
    if (value.length === 4) {
      const { success, error } = await verifyEmail(value);
      if (success) {
        toast.success('Email verified successully!');
        navigate({ to: '/' });
      } else {
        toast.error(error);
      }
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col justify-center items-center">
      <div className="space-y-2 text-center mb-8">
        <h1 className="font-bold text-2xl">Verify your email</h1>
        <p className="text-muted-foreground text-sm">
          Verification code was sent to your email. Please check it out.
        </p>
      </div>
      <div className="space-y-3">
        <Label htmlFor={id}>Enter verificaiton code</Label>
        <InputOTP
          id={id}
          maxLength={4}
          disabled={isLoading}
          value={code}
          onChange={handleChange}
        >
          <InputOTPGroup className="gap-2 *:data-[active=true]:ring-0 *:data-[slot=input-otp-slot]:rounded-none *:data-[slot=input-otp-slot]:border-0 *:data-[slot=input-otp-slot]:border-b-2 *:data-[slot=input-otp-slot]:shadow-none *:dark:data-[slot=input-otp-slot]:bg-transparent">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
