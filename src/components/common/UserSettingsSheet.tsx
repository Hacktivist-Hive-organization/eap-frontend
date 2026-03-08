import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  type UpdateProfilePayload,
  userService,
} from '@/services/api/requests/user';
import { updateUserProfile } from '@/store/slices/userSlice';

interface UserSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserSettingsSheet({
  open,
  onOpenChange,
}: UserSettingsSheetProps) {
  const user = useAppSelector((state) => state.userState.user);
  const dispatch = useAppDispatch();

  const form = useForm<UpdateProfilePayload>({
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        first_name: user?.first_name ?? '',
        last_name: user?.last_name ?? '',
      });
    }
  }, [open, user, form]);

  const onSubmit = async (values: UpdateProfilePayload) => {
    try {
      await userService.updateProfile(values);
      dispatch(updateUserProfile(values));
      onOpenChange(false);
    } catch {
      form.setError('root', { message: 'Failed to save. Please try again.' });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Profile settings</SheetTitle>
          <SheetDescription>
            Update your first and last name here.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-4"
        >
          <FormField
            form={form}
            name="first_name"
            label="First name"
            placeholder="Enter first name"
          />
          <FormField
            form={form}
            name="last_name"
            label="Last name"
            placeholder="Enter last name"
          />
          {form.formState.errors.root && (
            <p className="text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
          <SheetFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save changes
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
