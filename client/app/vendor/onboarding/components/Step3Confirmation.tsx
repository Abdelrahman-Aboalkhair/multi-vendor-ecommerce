import React from "react";

interface Step3ConfirmationProps {
  formData: {
    storeName: string;
    description: string;
    logo: string;
    contact: string;
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
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Details</h2>
      <p className="text-gray-600 mb-6">
        Review your store details before submitting your application.
      </p>
      <div className="space-y-4 mb-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Store Name</h3>
          <p className="text-gray-900">{formData.storeName}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="text-gray-900">{formData.description || "N/A"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Logo URL</h3>
          <p className="text-gray-900">{formData.logo || "N/A"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Contact Email</h3>
          <p className="text-gray-900">{formData.contact || "N/A"}</p>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-md text-white transition-colors ${
            isSubmitting
              ? "bg-teal-300 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </div>
  );
};

export default Step3Confirmation;
