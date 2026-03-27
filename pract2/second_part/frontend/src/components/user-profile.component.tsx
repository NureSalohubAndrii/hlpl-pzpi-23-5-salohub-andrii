import { LogOut, Pencil, User } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Field, FieldGroup } from './ui/field';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useState } from 'react';
import {
  userProfileFormSchema,
  type UserProfileFormErrors,
  type UserProfileFormValues,
} from '../validation/user-profile.validation';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { toast } from 'sonner';

const UserProfile = () => {
  const { user, clearAuth } = useAuthStore();
  const { updateProfile, isLoading } = useUpdateProfile();

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<UserProfileFormValues>({
    fullName: user?.fullName ?? '',
    avatarUrl: user?.avatarUrl ?? '',
  });
  const [errors, setErrors] = useState<UserProfileFormErrors>({});

  const handleChange = (field: keyof UserProfileFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const result = userProfileFormSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: UserProfileFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof UserProfileFormValues;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    const { success, error } = await updateProfile(values);

    if (success) {
      toast.success('Profile updated successfully');
      setOpen(false);
    } else {
      toast.error(error ?? 'Something went wrong');
    }
  };

  return (
    <section className="flex flex-col justify-center items-center gap-4 border p-4 rounded-2xl">
      {user?.avatarUrl ? (
        <img
          alt="User Avatar Preview"
          className="h-28 w-28 object-cover shadow-lg block mx-auto"
          src={user.avatarUrl}
        />
      ) : (
        <User width={112} height={112} />
      )}
      <div className="flex gap-2">
        <h2 className="text-2xl">{user?.fullName}</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Pencil width={18} height={18} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            {values.avatarUrl ? (
              <img
                alt="User Avatar Preview"
                className="h-28 w-28 object-cover shadow-lg block mx-auto"
                src={values.avatarUrl}
              />
            ) : (
              <User width={112} height={112} className="block mx-auto" />
            )}
            <FieldGroup>
              <Field>
                <Label htmlFor="name-1">Full name</Label>
                <Input
                  id="name-1"
                  name="fullName"
                  defaultValue="John Doe"
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  value={values.fullName}
                />
              </Field>
              <Field>
                <Label htmlFor="name-1">Avatar</Label>
                <Input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={values.avatarUrl}
                  onChange={(e) => handleChange('avatarUrl', e.target.value)}
                />
                <p className="text-xs text-gray-500">Direct link to image</p>
              </Field>
              {/* <Field> */}
              {/*   <Label htmlFor="username-1">Username</Label> */}
              {/*   <Input */}
              {/*     id="username-1" */}
              {/*     name="username" */}
              {/*     defaultValue="@peduarte" */}
              {/*   /> */}
              {/* </Field> */}
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-xl">{user?.email}</p>
      <Button className="flex gap-2" onClick={clearAuth}>
        <LogOut />
        <p>Log out</p>
      </Button>
    </section>
  );
};

export default UserProfile;
