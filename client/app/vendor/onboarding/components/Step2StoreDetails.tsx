import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUploader from "@/app/components/molecules/ImageUploader";
import { Mail } from "lucide-react";
import Input from "@/app/components/atoms/Input";
import TextArea from "@/app/components/atoms/TextArea";

const schema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  description: z.string().optional(),
  contact: z
    .string()
    .email("Must be a valid email")
    .optional()
    .or(z.literal("")),
  businessDetails: z.object({
    taxId: z.string().optional(),
    businessLicense: z.string().optional(),
    otherDocuments: z.array(z.string()).optional(),
  }),
  logoFiles: z.array(z.any()).optional(),
});

interface Step2StoreDetailsProps {
  formData: {
    storeName: string;
    description: string;
    contact: string;
    businessDetails: {
      taxId: string;
      businessLicense: string;
      otherDocuments: string[];
    };
    logoFiles: File[];
  };
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2StoreDetails: React.FC<Step2StoreDetailsProps> = ({
  formData,
  onChange,
  onNext,
  onBack,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData,
  });

  console.log("formData => ", formData);

  const onSubmit = (data: any) => {
    onChange(data);
    onNext();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Store Details</h2>
      <p className="text-gray-600 mb-6">
        Provide information about your store and verification documents to
        create a unique presence on our platform.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          control={control}
          name="storeName"
          label="Store Name"
          placeholder="My Awesome Store"
          error={errors.storeName?.message}
        />
        <TextArea
          control={control}
          name="description"
          label="Description"
          placeholder="Describe your store..."
          error={errors.description?.message}
        />
        <ImageUploader
          control={control}
          errors={errors}
          watch={watch}
          setValue={setValue}
          label="Store Logo"
          name="logoFiles"
        />
        <Input
          control={control}
          name="contact"
          label="Contact Email"
          placeholder="contact@yourstore.com"
          icon={Mail}
          error={errors.contact?.message}
        />
        <Input
          control={control}
          name="businessDetails.taxId"
          label="Tax ID"
          placeholder="Enter your tax ID"
          error={errors.businessDetails?.taxId?.message}
        />
        <Input
          control={control}
          name="businessDetails.businessLicense"
          label="Business License"
          placeholder="Enter your business license number"
          error={errors.businessDetails?.businessLicense?.message}
        />
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2StoreDetails;
