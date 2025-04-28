import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const Step4Success: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const nextSteps = [
    "Our team will review your application",
    "You'll receive an email notification within 3-5 business days",
    "Once approved, you can set up your products and start selling",
  ];

  return (
    <motion.div
      className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-green-600" />
        </div>
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
      >
        Application Submitted!
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="text-gray-600 mb-8 max-w-md mx-auto"
      >
        Your vendor application has been successfully submitted. We&apos;re
        excited to have you join our marketplace!
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="bg-gray-50 p-6 rounded-lg mb-8 text-left max-w-md mx-auto"
      >
        <h3 className="font-medium text-gray-900 mb-4">What happens next?</h3>
        <ul className="space-y-3">
          {nextSteps.map((step, index) => (
            <li key={index} className="flex items-start">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-medium mr-3 mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-700">{step}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Link href="/dashboard">
          <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white flex items-center justify-center mx-auto transition-colors shadow-md hover:shadow-lg focus:ring-2 focus:ring-indigo-200 focus:outline-none">
            Go to Dashboard
            <ArrowRight size={16} className="ml-2" />
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Step4Success;
