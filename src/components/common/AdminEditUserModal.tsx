import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormField } from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAdminUpdateUser } from '@/features/dashboard/AdminDashboard/hooks';
import { useAppSelector } from '@/hooks/useRedux';
import type {
  AdminUpdateUserPayload,
  UserResponse,
} from '@/services/api/requests/user';
import type { Role } from '@/types/Role';

interface AdminEditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
}

type AdminEditUserFormValues = {
  first_name: string;
  last_name: string;
  role: Role;
  is_out_of_office: boolean;
};

export function AdminEditUserModal({
  open,
  onOpenChange,
  user,
}: AdminEditUserModalProps) {
  const updateUser = useAdminUpdateUser();
  const currentUserId = useAppSelector((state) => state.userState.user?.id);
  const isCurrentUser = user?.id === currentUserId;

  const form = useForm<AdminEditUserFormValues>({
    defaultValues: {
      first_name: '',
      last_name: '',
      role: 'requester',
      is_out_of_office: false,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_out_of_office: user.is_out_of_office,
      });
    }
  }, [user, form]);

  const onSubmit = (values: AdminEditUserFormValues) => {
    if (!user) return;
    const payload: AdminUpdateUserPayload = {
      first_name: values.first_name,
      last_name: values.last_name,
      role: values.role,
      is_out_of_office: values.is_out_of_office,
    };
    updateUser.mutate(
      { userId: user.id, payload },
      {
        onSuccess: () => {
          toast.success('User updated');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Failed to update user');
        },
      },
    );
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>Edit User</ModalTitle>
          {user && <ModalDescription>{user.email}</ModalDescription>}
        </ModalHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
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
          {!isCurrentUser && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role">Role</Label>
              <Controller
                control={form.control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="requester">Requester</SelectItem>
                      <SelectItem value="approver">Approver</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label htmlFor="is_out_of_office">Out of Office</Label>
            <Controller
              control={form.control}
              name="is_out_of_office"
              render={({ field }) => (
                <Switch
                  id="is_out_of_office"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
          <ModalFooter className="mt-2">
            <ModalClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </ModalClose>
            <Button type="submit" disabled={updateUser.isPending}>
              {updateUser.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
