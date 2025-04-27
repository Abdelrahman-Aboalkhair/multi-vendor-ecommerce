import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const Step4Success: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-6"
      >
        <CheckCircle2 size={64} className="text-indigo-500" />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Application Submitted!
      </h2>
      <p className="text-gray-600 mb-6">
        Your vendor application has been submitted successfully. Our team will
        review it and get back to you within 3-5 business days.
      </p>
      <Link href="/">
        <button className="bg-indigo-500 hover:bg-indigo-600 px-4 py-3 rounded-lg text-white">
          Go to Home
        </button>
      </Link>
    </div>
  );
};

export default Step4Success;
