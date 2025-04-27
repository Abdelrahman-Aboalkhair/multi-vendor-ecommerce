"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Stepper from "./components/Stepper";
import Step1Intro from "./components/Step1Intro";
import Step2StoreDetails from "./components/Step2StoreDetails";
import Step3Confirmation from "./components/Step3Confirmation";
import Step4Success from "./components/Step4Success";
import OnboardingLayout from "./components/OnboardingLayout";
import { useApplyforVendorMutation } from "@/app/store/apis/AuthApi";
import useToast from "@/app/hooks/ui/useToast";

const steps = [
  { label: "Introduction", id: 1 },
  { label: "Store Details", id: 2 },
  { label: "Confirmation", id: 3 },
  { label: "Success", id: 4 },
];

const VendorOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    logo: "",
    contact: "",
  });
  const [applyForVendor, { isLoading }] = useApplyforVendorMutation();
  const { showToast } = useToast();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormChange = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    try {
      await applyForVendor(formData).unwrap();
      setCurrentStep(4);
      showToast("Application submitted successfully", "success");
    } catch (err: any) {
      showToast("Something went wrong", "error");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Intro onNext={handleNext} />;
      case 2:
        return (
          <Step2StoreDetails
            formData={formData}
            onChange={handleFormChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3Confirmation
            formData={formData}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isLoading}
          />
        );
      case 4:
        return <Step4Success />;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout>
      <div className="max-w-3xl mx-auto">
        <Stepper steps={steps} currentStep={currentStep} />
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          {renderStep()}
        </motion.div>
      </div>
    </OnboardingLayout>
  );
};

export default VendorOnboarding;
