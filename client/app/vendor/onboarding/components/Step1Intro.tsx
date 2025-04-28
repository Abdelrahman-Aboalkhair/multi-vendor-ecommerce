import React from "react";
import { motion } from "framer-motion";
import { Store, Package, DollarSign } from "lucide-react";

interface Step1IntroProps {
  onNext: () => void;
}

const Step1Intro: React.FC<Step1IntroProps> = ({ onNext }) => {
  const benefits = [
    {
      icon: <Store className="text-indigo-600" />,
      title: "Your Own Store",
      description: "Create a unique storefront to showcase your products.",
    },
    {
      icon: <Package className="text-indigo-600" />,
      title: "Manage Inventory",
      description: "Easily add, update, and track your product inventory.",
    },
    {
      icon: <DollarSign className="text-indigo-600" />,
      title: "Earn Money",
      description: "Reach a wide audience and grow your revenue.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
        Become a Vendor
      </h2>
      <p className="text-gray-600 mb-8">
        Join our marketplace to start selling your products to customers
        worldwide. Complete this simple process to launch your store in minutes.
      </p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            variants={item}
            className="flex flex-col items-center p-4 text-center rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors"
          >
            <div className="p-3 bg-indigo-100 rounded-full mb-4">
              {benefit.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {benefit.title}
            </h3>
            <p className="text-sm text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg focus:ring-2 focus:ring-indigo-200 focus:outline-none"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Step1Intro;
