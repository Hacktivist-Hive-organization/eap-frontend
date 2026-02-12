import {
  FileIcon,
  FileTextIcon,
  SendHorizonalIcon,
  Settings,
} from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type Priority, priorityMap } from '@/types/Priority';
import { useRequestForm } from './hooks/useRequestForm';
import { useRequestTypes } from './hooks/useRequestTypes';

type Props = {
  onSuccess?: () => void;
};

const PRIORITIES = Object.keys(priorityMap) as Priority[];

export const RequestForm = ({ onSuccess }: Props) => {
  const { data: types = [], isLoading, isError } = useRequestTypes();
  const { form, onSubmit, isPending } = useRequestForm({ onSuccess });

  // Watch selected type (stored as string)
  const selectedTypeId = useWatch({
    control: form.control,
    name: 'type_id',
  });

  const selectedType = types.find((t) => t.id === selectedTypeId);

  const subtypes = selectedType?.subtypes ?? [];

  // When type changes, auto-select first subtype
  useEffect(() => {
    const type = types.find((t) => t.id === selectedTypeId);
    if (!type) return;

    const firstSubtype = type.subtypes?.[0];

    if (firstSubtype) {
      form.setValue('subtype_id', firstSubtype.id, { shouldValidate: true });
    } else {
      form.resetField('subtype_id');
    }
  }, [selectedTypeId, types, form]);

  if (isError)
    return <p className="text-red-500">Failed to load request types</p>;

  if (isLoading) return <p>Loading form...</p>;

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Create New Request
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Submit a detailed administrative ticket.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-gray-700 font-bold mb-2">
            <FileTextIcon className="h-4 w-4 text-primary" />
            <span>REQUEST CONTENT</span>
          </div>

          {/* Title */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormField>
                <FormItem>
                  <FormLabel>Request Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Annual Marketing Budget Review"
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              </FormField>
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormField>
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={2}
                      placeholder="Explain the scope and requirements..."
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              </FormField>
            )}
          />

          {/* Justification */}
          <Controller
            name="justification"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormField>
                <FormItem>
                  <FormLabel>Business Justification</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={2}
                      placeholder="Why is this request necessary?"
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              </FormField>
            )}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-gray-700 font-bold mb-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>METADATA</span>
          </div>

          {/* Type */}
          <Controller
            name="type_id"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormField>
                <FormLabel>Request Type</FormLabel>
                <FormItem>
                  <Select
                    value={String(field.value ?? '')}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              </FormField>
            )}
          />

          {/* Subtype */}
          <Controller
            name="subtype_id"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormField>
                <FormLabel>Request Subtype</FormLabel>
                <FormItem>
                  <Select
                    disabled={!subtypes.length}
                    value={String(field.value ?? '')}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select subtype" />
                    </SelectTrigger>
                    <SelectContent>
                      {subtypes.map((subtype) => (
                        <SelectItem
                          key={subtype.id}
                          value={subtype.id.toString()}
                        >
                          {subtype.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              </FormField>
            )}
          />

          {/* Priority */}
          <Controller
            name="priority"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormField>
                <FormLabel>Priority</FormLabel>
                <FormItem>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => {
                        const priority = priorityMap[p];
                        return (
                          <SelectItem key={p} value={p}>
                            <span className="flex items-center gap-2">
                              <span className={priority.className}>
                                {priority.icon}
                              </span>
                              {priority.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              </FormField>
            )}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-4">
        <div className="flex gap-3">
          <Button disabled={isPending} type="submit" variant="secondary">
            <FileIcon />
            {isPending ? 'Saving...' : 'Save as Draft'}
          </Button>

          <Button disabled={true} type="button">
            <SendHorizonalIcon />
            Submit Request
          </Button>
        </div>
      </div>
    </Form>
  );
};
