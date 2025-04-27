import Image from "next/image";

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

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Details</h2>
      <p className="text-gray-600 mb-6">
        Review your store details and verification documents before submitting
        your application.
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
          <h3 className="text-sm font-medium text-gray-500">Store Logo</h3>
          {logoPreviews.length > 0 ? (
            <div className="flex gap-3 flex-wrap">
              {logoPreviews.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Logo ${index}`}
                  width={100}
                  height={100}
                  className="w-24 h-24 rounded-lg border border-gray-200 object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-900">N/A</p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Contact Email</h3>
          <p className="text-gray-900">{formData.contact || "N/A"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Tax ID</h3>
          <p className="text-gray-900">
            {formData.businessDetails.taxId || "N/A"}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Business License
          </h3>
          <p className="text-gray-900">
            {formData.businessDetails.businessLicense || "N/A"}
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
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
