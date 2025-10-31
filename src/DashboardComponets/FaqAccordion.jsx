import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const faqData = [
  {
    question: "Lorem ipsum dolor sit amet, consectetur",
    answer:
      "Ut enim ad minim veniam, quis exercitation ullamco laboris commodo consequat. Duis aute irure dolor in reprehenderit in.",
  },
  {
    question: "Lorem ipsum dolor sit amet, consectetur",
    answer: "Answer content for the second FAQ item.",
  },
  {
    question: "Lorem ipsum dolor sit amet, consectetur",
    answer: "Answer content for the third FAQ item.",
  },
  {
    question: "Lorem ipsum dolor sit amet, consectetur",
    answer: "Answer content for the fourth FAQ item.",
  },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0); // default: first one open

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">FAQ</h2>
      <div className="space-y-3">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-lg overflow-hidden transition-all border ${
                isOpen ? "bg-blue-600 text-white" : "bg-white text-black"
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-5 py-4 flex justify-between items-center focus:outline-none"
              >
                <span
                  className={`text-sm font-medium ${
                    isOpen ? "text-white" : "text-gray-800"
                  }`}
                >
                  {item.question}
                </span>
                <FiChevronDown
                  className={`text-lg transform transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-white" : "rotate-0 text-gray-500"
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm text-white">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqAccordion;
