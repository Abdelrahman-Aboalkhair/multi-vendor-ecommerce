import { Trash2 } from "lucide-react";
import Image from "next/image";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";

interface ImageUploaderProps {
  control: any;
  errors: any;
  watch: any;
  setValue: any;
  label: string;
  name: string;
  existingImages?: string[];
}

const ImageUploader = ({
  control,
  errors,
  watch,
  setValue,
  label,
  name,
  existingImages,
}: ImageUploaderProps) => {
  const images = watch(name) || [];
  const [previews, setPreviews] = useState<string[]>(existingImages || []);

  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setPreviews(existingImages);
    } else if (images && images.length > 0) {
      const newPreviews = images.map((img: any) =>
        typeof img === "string" ? img : URL.createObjectURL(img)
      );
      setPreviews(newPreviews);
    } else {
      setPreviews([]);
    }

    // Cleanup object URLs to prevent memory leaks
    return () => {
      previews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [existingImages, images]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newPreviews = files.map((file: any) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    setValue(name, [...images, ...files]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setValue(name, newImages);
    setPreviews(newPreviews);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {previews.length > 0 && (
        <div className="flex gap-3 flex-wrap mb-3">
          {previews.map((img, index) => (
            <div
              key={index}
              className="relative group w-24 h-24 rounded-lg border border-gray-200 overflow-hidden"
            >
              <Image
                src={img || "../../assets/images/iphone.png"}
                alt={`Uploaded ${index}`}
                width={200}
                height={200}
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-white/80 hover:bg-white p-1 rounded-full transition-all shadow group-hover:scale-100 scale-90"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Controller
        name={name}
        control={control}
        render={() => (
          <div className="relative mb-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        )}
      />

      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default ImageUploader;
