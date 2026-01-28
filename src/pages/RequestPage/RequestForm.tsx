import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea }  from '@/components/ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import type { RequestType, RequestSubtype } from '@/services/api/request.service';

type FormState = {
  type_id: number | null;
  subtype_id: number | null;
  title: string;
  description: string;
  justification: string;
  priority: string;
};
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
    const [errors, setErrors] = useState({});
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
        newErrors.type = "Type is required and must be valid";
      }

      const selectedSubtype = selectedType?.subtypes.find(st => st.id === form.subtype_id);
      if (!selectedSubtype) {
        newErrors.subtype = "Subtype is required and must match selected type";
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
    const handleChange = (e) => {
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

  const handleSubmit = async (e) => {
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

    <Form className="max-w-3xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl"
                 onSubmit={handleSubmit} >

     <div className="space-y-1">
        <h2 className="text-xl font-bold">Create New Request</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Submit a detailed administrative ticket.
        </p>
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


   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div className="md:col-span-2 space-y-4 sticky top-6" >
        <p className="text-sm font-bold">REQUEST CONTENT</p>
         {/* Request Title */}
          <FormField>
            <FormItem>
              <FormLabel className="text-xs text-gray-700 dark:text-gray-300 mb-1">Request Title</FormLabel>
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
             <FormMessage className="text-red-600 mt-1">{errors.title}</FormMessage>
             </FormItem>
             </FormField>

           {/* Detailed Description */}
              <FormField>
                <FormItem>
                  <FormLabel className="text-xs text-gray-700 dark:text-gray-300 mb-1">Detailed Description</FormLabel>
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
                  <FormMessage className="text-red-600 mt-1">{errors.description}</FormMessage>
                </FormItem>
              </FormField>
        {/* Business Justification */}
          <FormField>
            <FormItem>
              <FormLabel className="text-xs text-gray-700 dark:text-gray-300 mb-1">Business Justification</FormLabel>
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
              <FormMessage className="text-red-600 mt-1">{errors.justification}</FormMessage>
            </FormItem>
          </FormField>

        </div>
        <div className="md:col-span-1 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl space-y-4">
           <p className="text-sm font-bold">METADATA</p>
            {/* Request Type */}
            <FormField>
            <FormLabel className="text-xs text-gray-700 dark:text-gray-300 mb-1">Request Type</FormLabel>
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

              <FormMessage className="text-red-600 mt-1">{errors.type}</FormMessage>
            </FormItem>
          </FormField>
        {/* Request Subtype */}
          <FormField>
            <FormLabel className="text-xs text-gray-700 dark:text-gray-300 mb-1">Request Subtype</FormLabel>
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
              <FormMessage className="text-red-600 mt-1">{errors.subtype}</FormMessage>
            </FormItem>
          </FormField>
        {/* Priority */}
          <FormField>
            <FormLabel className="text-xs text-gray-700 dark:text-gray-300 mb-1">Priority</FormLabel>
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
              <FormMessage className="text-red-600 mt-1">{errors.priority}</FormMessage>
            </FormItem>
          </FormField>
        <p className="text-sm font-bold">ATTACHMENTS</p>

        {/* Drag & Drop Upload */}
<FormField>
  <FormControl>

  </FormControl>
  <FormMessage className="text-red-600 mt-1">{errors.attachments}</FormMessage>
</FormField>
    </div>

    </div>
     <div className="flex justify-between items-center mt-4">

        <Button
            variant="link"
            size="lg"
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Cancel
          </Button>
         <div className="flex gap-4">
        <Button
          type="button"
          variant="secondary"
          size="lg"
        >
          Save as Draft
        </Button>
        <Button
          type="submit"
          variant="default"
          size="lg"
        >
          Submit Request
        </Button>
      </div>
      </div>
    </Form>
    );
}