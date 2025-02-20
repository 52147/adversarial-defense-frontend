import { useState } from "react";

const ContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Contact Me Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        Contact Me
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center border border-gray-300">
            <h2 className="text-xl font-bold mb-4">Contact Me</h2>

            <p className="text-gray-700">
              Email:{" "}
              <a href="mailto:debrah@bu.edu" className="text-blue-600">
                debrah@bu.edu
              </a>
            </p>

            {/* Leave a message */}
            <p className="mt-4 text-gray-700">
              💬 If you have any feedback, suggestions, or questions, feel free
              to leave me a message via email.
            </p>

            {/* GitHub Star Link */}
            <div className="mt-4 text-gray-700 border-t pt-4 flex flex-col items-center">
              <p className="mt-4 text-gray-700">
                ⭐ If you like this project, please give a star on GitHub!
              </p>
              <a
                href="https://github.com/52147/adversarial-defense-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
              >
                ⭐ Give a Star
              </a>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactButton;
