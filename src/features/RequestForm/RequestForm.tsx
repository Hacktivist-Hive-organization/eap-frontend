import { ArrowRight, FileText, Settings, UploadCloud } from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { createRequestService } from '@/services/api/requests/request';
import { useRequestTypes } from './hooks/useRequestTypes';

type Props = {
  onCancel?: () => void;
  onSuccess?: () => void;
};

type FormState = {
  type_id: number | null;
  subtype_id: number | null;
  title: string;
  description: string;
  justification: string;
  priority: string;
};

type FormErrors = Partial<Record<keyof FormState | 'attachments', string>>;

const INITIAL_FORM_STATE: FormState = {
  type_id: null,
  subtype_id: null,
  title: '',
  description: '',
  justification: '',
  priority: '',
};

const PRIORITIES = ['low', 'medium', 'high'];

export const RequestForm = ({ onCancel, onSuccess }: Props) => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  //const [typesError, setTypesError] = useState<string | null>(null);
  const { types, loading, error } = useRequestTypes();

  const validate = (data: FormState) => {
    const newErrors: FormErrors = {};

    if (data.type_id === null) {
      newErrors.type_id = 'Type is required and must be valid';
    }

    if (data.subtype_id === null) {
      newErrors.subtype_id = 'Subtype is required and must match selected type';
    }

    if (data.title.length < 5 || form.title.length > 200) {
      newErrors.title = 'Title must be between 5 and 200 characters';
    }

    if (data.description.length < 20 || form.description.length > 2000) {
      newErrors.description =
        'Description must be between 20 and 2000 characters';
    }

    if (data.justification.length < 20 || form.justification.length > 1000) {
      newErrors.justification =
        'Business justification must be between 20 and 1000 characters';
    }

    if (!PRIORITIES.includes(data.priority)) {
      newErrors.priority = 'Priority is required and must be valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //useEffect(() => {
  //validate();
  //}, [form]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const nextForm = {
      ...form,
      [name]: value,
    };

    setForm(nextForm);
    validate(nextForm);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setErrors({});
  };
  const handleCancel = () => {
    setForm(INITIAL_FORM_STATE);
    onCancel?.();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('form', form);
    if (!validate(form)) return;
    if (form.type_id === null || form.subtype_id === null) {
      return;
    }
    try {
      await createRequestService.createRequest({
        type_id: form.type_id,
        subtype_id: form.subtype_id,
        title: form.title,
        description: form.description,
        business_justification: form.justification,
        priority: form.priority.toLowerCase(),
        requester_id: 1,
      });
      resetForm();
      onSuccess?.();
    } catch (_error) {
      alert('Failed to create request. Please try again.');
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  if (loading) return <p>Loading form...</p>;

  return (
    <Form
      className="max-w-4xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl"
      onSubmit={handleSubmit}
    >
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
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-gray-700 font-bold mb-2">
            <FileText className="h-5 w-5 text-orange-500" />{' '}
            <span>REQUEST CONTENT</span>
          </div>
          {/* Request Title */}
          <FormField>
            <FormItem>
              <FormLabel htmlFor="title">Request Title</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Annual Marketing Budget Review"
                  className="text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm transition duration-150"
                />
              </FormControl>
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </FormItem>
          </FormField>

          {/* Detailed Description */}
          <FormField>
            <FormItem>
              <FormLabel htmlFor="description">Detailed Description</FormLabel>
              <FormControl>
                <Textarea
                  name="description"
                  rows={2}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Explain the scope and requirements of this request..."
                  className="text-xs h-16 resize-none border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm transition duration-150"
                />
              </FormControl>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </FormItem>
          </FormField>
          {/* Business Justification */}
          <FormField>
            <FormItem>
              <FormLabel htmlFor="justification">
                Business Justification
              </FormLabel>
              <FormControl>
                <Textarea
                  name="justification"
                  rows={2}
                  value={form.justification}
                  onChange={handleChange}
                  placeholder="Why is this request necessary for the business?"
                  className="text-xs h-16 resize-none  border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm transition duration-150"
                />
              </FormControl>
              {errors.justification && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.justification}
                </p>
              )}
            </FormItem>
          </FormField>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-gray-700 font-bold mb-2">
            <Settings className="h-5 w-5 text-orange-500" />{' '}
            <span>METADATA</span>
          </div>

          {/* Request Type */}
          <FormField>
            <FormLabel htmlFor="type_id">Request Type</FormLabel>
            <FormItem>
              <Select
                value={form.type_id?.toString() ?? ''}
                onValueChange={(value) => {
                  const nextForm = {
                    ...form,
                    type_id: Number(value),
                    subtype_id: null,
                  };
                  setForm(nextForm);
                  validate(nextForm);
                }}
              >
                <SelectTrigger className="w-full text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>

                <SelectContent>
                  {types.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id.toString()}
                      className="hover:bg-blue-100 rounded-md px-2 py-1"
                    >
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type_id && (
                <p className="text-red-500 text-xs mt-1">{errors.type_id}</p>
              )}
            </FormItem>
          </FormField>
          {/* Request Subtype */}
          <FormField>
            <FormLabel htmlFor="subtype_id">Request Subtype</FormLabel>
            <FormItem>
              <Select
                value={form.subtype_id?.toString() ?? ''}
                onValueChange={(value) => {
                  const nextForm = {
                    ...form,
                    subtype_id: Number(value),
                  };

                  setForm(nextForm);
                  validate(nextForm);
                }}
              >
                <SelectTrigger className="w-full text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <SelectValue placeholder="Select subtype" />
                </SelectTrigger>

                <SelectContent>
                  {types
                    .find((type) => type.id === form.type_id)
                    ?.subtypes.map((subtype) => (
                      <SelectItem
                        key={subtype.id}
                        value={subtype.id.toString()}
                        className="hover:bg-blue-100 rounded-md px-2 py-1"
                      >
                        {subtype.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.subtype_id && (
                <p className="text-red-500 text-xs mt-1">{errors.subtype_id}</p>
              )}
            </FormItem>
          </FormField>
          {/* Priority */}
          <FormField>
            <FormLabel htmlFor="priority">Priority</FormLabel>
            <FormItem>
              <Select
                value={form.priority}
                onValueChange={(value) => {
                  const nextForm = {
                    ...form,
                    priority: value,
                  };

                  setForm(nextForm);
                  validate(nextForm);
                }}
              >
                <SelectTrigger className="w-full text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>

                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem
                      key={p}
                      value={p}
                      className={`${
                        p === 'high'
                          ? 'text-red-600 font-semibold'
                          : p === 'medium'
                            ? 'text-yellow-600 font-medium'
                            : 'text-green-600 font-medium'
                      } hover:bg-gray-100 rounded-md px-2 py-1`}
                    >
                      {p.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-red-500 text-xs mt-1">{errors.priority}</p>
              )}
            </FormItem>
          </FormField>
          <div className="flex items-center gap-2 text-gray-700 font-bold mt-4 mb-2">
            <UploadCloud className="h-5 w-5 text-orange-500" />{' '}
            <span>ATTACHMENTS</span>
          </div>
          {/* Drag & Drop Upload */}
          <FormField>
            <FormControl>
              <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 text-sm cursor-pointer hover:border-blue-400 hover:text-blue-500 transition">
                Click or drag files <br />{' '}
                <span className="text-xs text-gray-400">Max 10MB per file</span>
              </div>
            </FormControl>
          </FormField>
        </div>
      </div>
      {/* Footer Buttons */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="link"
          size="lg"
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          Cancel
        </Button>
        <div className="flex gap-3">
          <Button type="submit" variant="secondary" size="lg">
            Save as Draft
          </Button>
          <Button disabled type="submit" variant="default" size="lg">
            <ArrowRight className="h-4 w-4" /> Submit Request
          </Button>
        </div>
      </div>
    </Form>
  );
};
