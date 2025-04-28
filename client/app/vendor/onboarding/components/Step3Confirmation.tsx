import React from "react";
import Image from "next/image";
import {
  Store,
  Mail,
  FileText,
  FileCheck,
  Image as ImageIcon,
} from "lucide-react";

interface Step3ConfirmationProps {
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
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const Step3Confirmation: React.FC<Step3ConfirmationProps> = ({
  formData,
  onSubmit,
  onBack,
  isSubmitting,
}) => {
  const logoPreviews =
    formData.logoFiles && formData.logoFiles.length > 0
      ? formData.logoFiles.map((file) => URL.createObjectURL(file))
      : [];

  const infoItems = [
    {
      icon: <Store size={20} className="text-indigo-600" />,
      label: "Store Name",
      value: formData.storeName,
    },
    {
      icon: <Mail size={20} className="text-indigo-600" />,
      label: "Contact Email",
      value: formData.contact || "N/A",
    },
    {
      icon: <FileText size={20} className="text-indigo-600" />,
      label: "Tax ID",
      value: formData.businessDetails.taxId || "N/A",
    },
    {
      icon: <FileCheck size={20} className="text-indigo-600" />,
      label: "Business License",
      value: formData.businessDetails.businessLicense || "N/A",
    },
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
        Review Your Details
      </h2>
      <p className="text-gray-600 mb-6">
        Please verify all information before submitting your vendor application.
      </p>

      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-50 rounded-lg">{item.icon}</div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {item.label}
                </h3>
                <p className="text-gray-900 font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-start space-x-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <ImageIcon size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Store Logo</h3>
            </div>
          </div>

          {logoPreviews.length > 0 ? (
            <div className="flex gap-3 flex-wrap">
              {logoPreviews.map((img, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden border border-gray-200"
                >
                  <Image
                    src={img}
                    alt={`Logo ${index}`}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No logo uploaded</p>
          )}
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-start space-x-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <FileText size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Store Description
              </h3>
            </div>
          </div>
          <p className="text-gray-900">
            {formData.description || "No description provided."}
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200 focus:outline-none disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-lg text-white transition-colors shadow-md focus:outline-none focus:ring-2 ${
            isSubmitting
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg focus:ring-indigo-200"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Application"
          )}
        </button>
      </div>
    </div>
  );
};

export default Step3Confirmation;
