import { Controller, UseFormReturn } from "react-hook-form";
import { Tag } from "lucide-react";

export interface CategoryFormData {
  id?: string; // Optional for create, required for update
  name: string;
  slug: string;
}

interface CategoryFormProps {
  form: UseFormReturn<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  form,
  onSubmit,
  isLoading,
  submitLabel = "Save",
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Category Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Name
        </label>
        <div className="relative">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Category name is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                placeholder="Enter category name"
              />
            )}
          />
          <Tag className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug
        </label>
        <Controller
          name="slug"
          control={control}
          rules={{ required: "Slug is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              placeholder="Enter slug"
            />
          )}
        />
        {errors.slug && (
          <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
