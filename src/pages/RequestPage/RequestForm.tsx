import { useEffect, useState  } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {  FileText, Settings, UploadCloud , ArrowRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea }  from '@/components/ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { requestService }  from '@/services/api/request.service';
import type { RequestType } from '@/services/api/request.service';

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
  type_id:  null,
  subtype_id: null,
  title: "",
  description: "",
  justification: "",
  priority: "",
};

const PRIORITIES = ["low", "medium", "high"];

export const  RequestForm = () => {
    const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [requestTypes, setRequestTypes] = useState<RequestType[]>([]);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [typesError, setTypesError] = useState<string | null>(null);

    useEffect(() => {
      if (successMessage) {
        const timer = setTimeout(() => setSuccessMessage(null), 5000);
        return () => clearTimeout(timer);
      }
    }, [successMessage]);

   useEffect(() => {
      const fetchRequestTypes = async () => {
        try {
          const data = await requestService.getRequestTypes();
          console.log(data)
          setRequestTypes(data);
        } catch (error) {
          setTypesError('Unable to load request types');
        } finally {
          setLoadingTypes(false);
        }
      };

      fetchRequestTypes();
   }, []);
     const validate = () => {
      const newErrors: any = {};

      const selectedType = requestTypes.find(t => t.id === form.type_id);

      if (!selectedType) {
        newErrors.type_id = "Type is required and must be valid";
      }

      const selectedSubtype = selectedType?.subtypes.find(st => st.id === form.subtype_id);
      if (!selectedSubtype) {
        newErrors.subtype_id = "Subtype is required and must match selected type";
      }

      if (form.title.length < 5 || form.title.length > 200) {
        newErrors.title = "Title must be between 5 and 200 characters";
      }

      if (form.description.length < 20 || form.description.length > 2000) {
        newErrors.description = "Description must be between 20 and 2000 characters";
      }

      if (form.justification.length < 20 || form.justification.length > 1000) {
        newErrors.justification = "Business justification must be between 20 and 1000 characters";
      }

      if (!PRIORITIES.includes(form.priority)) {
        newErrors.priority = "Priority is required and must be valid";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

    const resetForm = () => {
      setForm(INITIAL_FORM_STATE);
      setErrors({});
    };
    const handleCancel = () => {
      resetForm()
      setSuccessMessage(null); // also clear any existing success message
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("form",form);
    if (!validate()) return;
    try {
        await requestService.createRequest({
        type_id: form.type_id!,
          subtype_id: form.subtype_id!,
          title: form.title,
          description: form.description,
          business_justification: form.justification,
          priority: form.priority.toLowerCase(),
          requester_id: 1,
        });
        setSuccessMessage("Request saved successfully!");
        resetForm()
      } catch (error) {
        alert('Failed to create request. Please try again.');
      }
  };

 if (loadingTypes) return <p>Loading request types...</p>;
 if (typesError) return <p className="text-red-500">{typesError}</p>;

return (

    <Form className="max-w-4xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl" onSubmit={handleSubmit} >

     {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create New Request</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Submit a detailed administrative ticket.</p>
      </div>
      {successMessage && (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md mb-4">
            <span>✅ {successMessage}</span>
            <button
              type="button"
              className="font-bold"
              onClick={() => setSuccessMessage(null)} // optional dismiss button
            >
              &times;
            </button>
          </div>
        )}


   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="md:col-span-2 space-y-4" >
          <div className="flex items-center gap-2 text-gray-700 font-bold mb-2">
            <FileText className="h-5 w-5 text-orange-500" /> <span>REQUEST CONTENT</span>
          </div>
          {/* Request Title */}
          <FormField>
            <FormItem>
              <FormLabel>Request Title</FormLabel>
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
             {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
             </FormItem>
             </FormField>

           {/* Detailed Description */}
              <FormField>
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
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
                   {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </FormItem>
              </FormField>
        {/* Business Justification */}
          <FormField>
            <FormItem>
              <FormLabel>
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
              {errors.justification && <p className="text-red-500 text-xs mt-1">{errors.justification}</p>}
            </FormItem>
          </FormField>

        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-gray-700 font-bold mb-2">
                <Settings className="h-5 w-5 text-orange-500" /> <span>METADATA</span>
            </div>

            {/* Request Type */}
            <FormField>
            <FormLabel >Request Type</FormLabel>
            <FormItem>
              <Select
                  value={form.type_id?.toString() ?? ""}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      type_id: Number(value),
                      subtype_id: null,
                    }))
                  }
                >
              <SelectTrigger className="w-full text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>

              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}  className="hover:bg-blue-100 rounded-md px-2 py-1">
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              {errors.type_id  && <p className="text-red-500 text-xs mt-1">{errors.type_id }</p>}

            </FormItem>
          </FormField>
        {/* Request Subtype */}
          <FormField>
            <FormLabel>Request Subtype</FormLabel>
            <FormItem>

            <Select
              value={form.subtype_id?.toString()??"" }
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                 subtype_id: Number(value),
                }))
              }
            >
              <SelectTrigger className="w-full text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Select subtype" />
              </SelectTrigger>

             <SelectContent>
              {requestTypes
                .find((type) => type.id === form.type_id)
                ?.subtypes.map((subtype) => (
                  <SelectItem key={subtype.id} value={subtype.id.toString()}
                  className="hover:bg-blue-100 rounded-md px-2 py-1">
                    {subtype.name}
                  </SelectItem>
                ))}
            </SelectContent>
            </Select>
              {errors.subtype_id  && <p className="text-red-500 text-xs mt-1">{errors.subtype_id }</p>}
            </FormItem>
          </FormField>
        {/* Priority */}
          <FormField>
            <FormLabel >Priority</FormLabel>
            <FormItem>
            <Select
              value={form.priority}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  priority: value,
                }))
              }
            >
              <SelectTrigger className="w-full text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>

              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}
                  className={`${
                        p === "high"
                          ? "text-red-600 font-semibold"
                          : p === "medium"
                          ? "text-yellow-600 font-medium"
                          : "text-green-600 font-medium"
                      } hover:bg-gray-100 rounded-md px-2 py-1`}>
                    {p.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority}</p>}
            </FormItem>
          </FormField>
           <div className="flex items-center gap-2 text-gray-700 font-bold mt-4 mb-2">
            <UploadCloud className="h-5 w-5 text-orange-500" /> <span>ATTACHMENTS</span>
          </div>
        {/* Drag & Drop Upload */}
        <FormField>
            <FormControl>
              <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 text-sm cursor-pointer hover:border-blue-400 hover:text-blue-500 transition">
                Click or drag files <br /> <span className="text-xs text-gray-400">Max 10MB per file</span>
              </div>
            </FormControl>
          </FormField>
    </div>

    </div>
           {/* Footer Buttons */}
      <div className="flex justify-between items-center mt-4">
        <Button variant="link" size="lg" onClick={handleCancel} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Cancel</Button>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" size="lg">Save as Draft</Button>
          <Button type="submit" variant="default" size="lg">
          <ArrowRight className="h-4 w-4" /> Submit Request</Button>
        </div>
      </div>
    </Form>
    );
}