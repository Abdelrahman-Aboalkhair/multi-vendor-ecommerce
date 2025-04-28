"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Stepper from "./components/Stepper";
import Step1Intro from "./components/Step1Intro";
import Step2StoreDetails from "./components/Step2StoreDetails";
import Step3Confirmation from "./components/Step3Confirmation";
import Step4Success from "./components/Step4Success";
import OnboardingLayout from "./components/OnboardingLayout";
import useToast from "@/app/hooks/ui/useToast";
import { useApplyForVendorMutation } from "@/app/store/apis/AuthApi";

const steps = [
  { label: "Introduction", id: 1 },
  { label: "Store Details", id: 2 },
  { label: "Confirmation", id: 3 },
  { label: "Success", id: 4 },
];

const VendorOnboarding = () => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    contact: "",
    businessDetails: {
      taxId: "",
      businessLicense: "",
      otherDocuments: [],
    },
    logoFiles: [],
  });
  const [applyForVendor, { isLoading }] = useApplyForVendorMutation();

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

  const handleFormChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      businessDetails: {
        ...prev.businessDetails,
        ...(data.businessDetails || {}),
      },
    }));
  };

  const handleSubmit = async () => {
    const submissionData = new FormData();
    submissionData.append("storeName", formData.storeName);
    submissionData.append("description", formData.description || "");
    submissionData.append("contact", formData.contact || "");
    submissionData.append(
      "businessDetails",
      JSON.stringify(formData.businessDetails)
    );
    formData.logoFiles.forEach((file) => {
      submissionData.append(`logoFiles`, file);
    });

    try {
      await applyForVendor(submissionData).unwrap();
      setCurrentStep(4);
      showToast("Application submitted successfully", "success");
    } catch (err) {
      showToast("Failed to submit application", "error");
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
      <div className="max-w-4xl mx-auto w-full px-4">
        <Stepper steps={steps} currentStep={currentStep} />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </OnboardingLayout>
  );
};

export default VendorOnboarding;
