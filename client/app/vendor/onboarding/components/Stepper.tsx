import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/app/utils";

interface Step {
  label: string;
  id: number;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2",
              currentStep > step.id
                ? "bg-indigo-500 border-indigo-500 text-white"
                : currentStep === step.id
                ? "border-indigo-500 text-indigo-500"
                : "border-gray-300 text-gray-400"
            )}
          >
            {currentStep > step.id ? (
              <CheckCircle2 size={20} />
            ) : (
              <span>{step.id}</span>
            )}
          </div>
          <div className="ml-3">
            <p
              className={cn(
                "text-sm font-medium",
                currentStep >= step.id ? "text-gray-900" : "text-gray-400"
              )}
            >
              {step.label}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-1 mx-4",
                currentStep > step.id ? "bg-indigo-500" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
