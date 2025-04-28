import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUploader from "@/app/components/molecules/ImageUploader";
import { Mail, Store, FileText, FileCheck } from "lucide-react";
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
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    onChange(data);
    onNext();
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
        Store Details
      </h2>
      <p className="text-gray-600 mb-6">
        Tell us about your business to create your vendor profile.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              control={control}
              name="storeName"
              label="Store Name"
              placeholder="Your Store Name"
              icon={Store}
              error={errors.storeName?.message}
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              control={control}
              name="description"
              label="Store Description"
              placeholder="Tell customers about your store and products..."
              error={errors.description?.message}
              rows={4}
            />
          </div>

          <div className="md:col-span-2">
            <ImageUploader
              control={control}
              errors={errors}
              watch={watch}
              setValue={setValue}
              label="Store Logo"
              name="logoFiles"
            />
          </div>

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
            label="Tax ID / VAT Number"
            placeholder="Enter your tax ID"
            icon={FileText}
            error={errors.businessDetails?.taxId?.message}
          />

          <div className="md:col-span-2">
            <Input
              control={control}
              name="businessDetails.businessLicense"
              label="Business License Number"
              placeholder="Enter your business license number"
              icon={FileCheck}
              error={errors.businessDetails?.businessLicense?.message}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200 focus:outline-none"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg focus:ring-2 focus:ring-indigo-200 focus:outline-none"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2StoreDetails;
