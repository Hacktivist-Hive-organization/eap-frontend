import { CameraIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/common/FormField';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { setAvatarUrl, updateUserProfile } from '@/store/slices/userSlice';
import { formatUserName, getAvatarUrl, getInitials } from '@/utils';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    } else {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPendingFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open, user, form, previewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onSubmit = async (values: UpdateProfilePayload) => {
    try {
      if (pendingFile) {
        const result = await userService.uploadAvatar(pendingFile);
        dispatch(setAvatarUrl(result.avatar_url));
      }
      await userService.updateMe(values);
      dispatch(updateUserProfile(values));
      onOpenChange(false);
    } catch {
      form.setError('root', { message: 'Failed to save. Please try again.' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    form.clearErrors('root');
  };

  const fullName = user ? formatUserName(user) : '';
  const initials = getInitials(fullName);
  const avatarSrc = previewUrl ?? getAvatarUrl(user?.avatar_url);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Profile settings</SheetTitle>
          <SheetDescription>
            Update your profile photo and name here.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              className="group relative cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload profile photo"
            >
              <Avatar className="h-20 w-20 rounded-xl">
                <AvatarImage src={avatarSrc} className="rounded-xl" />
                <AvatarFallback className="rounded-xl text-xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <CameraIcon className="h-6 w-6 text-white" />
              </div>
            </button>
            <p className="text-xs text-muted-foreground">
              {pendingFile
                ? pendingFile.name
                : 'Click to upload photo (PNG, JPEG)'}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
