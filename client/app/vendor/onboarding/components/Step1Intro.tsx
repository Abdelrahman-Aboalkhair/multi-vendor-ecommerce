import React from "react";
import { motion } from "framer-motion";
import { Store, Package, DollarSign } from "lucide-react";

interface Step1IntroProps {
  onNext: () => void;
}

const Step1Intro: React.FC<Step1IntroProps> = ({ onNext }) => {
  const benefits = [
    {
      icon: <Store size={24} className="text-teal-500" />,
      title: "Your Own Store",
      description: "Create a unique storefront to showcase your products.",
    },
    {
      icon: <Package size={24} className="text-teal-500" />,
      title: "Manage Inventory",
      description: "Easily add, update, and track your product inventory.",
    },
    {
      icon: <DollarSign size={24} className="text-teal-500" />,
      title: "Earn Money",
      description: "Reach a wide audience and grow your revenue.",
    },
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Become a Vendor</h2>
      <p className="text-gray-600 mb-6">
        Join our platform to start selling your products to a global audience.
        Set up your store in just a few steps!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-2">{benefit.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">
              {benefit.title}
            </h3>
            <p className="text-sm text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Step1Intro;
