import { useEffect, useState } from "react";
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
        });
        setSuccessMessage("Request saved successfully!");
        resetForm()
        //setForm(INITIAL_FORM_STATE);
        //setErrors({});
        //alert("Request saved successfully!");
      } catch (error) {
        alert('Failed to create request. Please try again.');
      }
  };

 if (loadingTypes) return <p>Loading request types...</p>;
 if (typesError) return <p className="text-red-500">{typesError}</p>;

return (
    <Form className="max-w-3xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl"
                 onSubmit={handleSubmit} >
      <h2 className="text-2xl font-bold mb-4">Create Request</h2>
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
      <FormField>
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
          <SelectTrigger className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <SelectValue placeholder="Select Type" />
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

      <FormField>
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
          <SelectTrigger className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <SelectValue placeholder="Select Sub Type" />
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

      <FormField>
        <FormItem>
          <FormLabel className="font-medium mb-1">Title *</FormLabel>
          <FormControl>
        <Input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm transition duration-150"
        />
      </FormControl>
          <FormMessage className="text-red-600 mt-1">{errors.title}</FormMessage>
        </FormItem>
      </FormField>

 <FormField>
        <FormItem>
          <FormLabel className="font-medium mb-1">Description *</FormLabel>
          <FormControl>
        <Textarea
          name="description"
          rows={5}
          value={form.description}
          onChange={handleChange}
          className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm transition duration-150"
        />
    </FormControl>
          <FormMessage className="text-red-600 mt-1">{errors.description}</FormMessage>
        </FormItem>
      </FormField>

      <FormField>
        <FormItem>
          <FormLabel className="font-medium mb-1">Business Justification *</FormLabel>
          <FormControl>
        <Textarea
          name="justification"
          rows={4}
          value={form.justification}
          onChange={handleChange}
          className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm transition duration-150"
        />
         </FormControl>
          <FormMessage className="text-red-600 mt-1">{errors.justification}</FormMessage>
        </FormItem>
      </FormField>

      <FormField>
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
          <SelectTrigger className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <SelectValue placeholder="Select Priority" />
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
        <div className="flex gap-4 mt-4">
        <Button
          type="submit"
          variant="default" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-lg px-6 py-2"
        >
          Save Draft
        </Button>
        <Button variant="secondary" size="lg" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </Form>
    );
}