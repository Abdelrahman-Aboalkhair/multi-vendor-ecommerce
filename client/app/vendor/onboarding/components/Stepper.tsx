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
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                  currentStep > step.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : currentStep === step.id
                    ? "border-2 border-indigo-600 text-indigo-600"
                    : "border-2 border-gray-200 text-gray-400"
                )}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium hidden sm:block",
                  currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 sm:mx-4 transition-all duration-300",
                  currentStep > step.id + 1
                    ? "bg-indigo-600"
                    : currentStep > step.id
                    ? "bg-gradient-to-r from-indigo-600 to-gray-200"
                    : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
