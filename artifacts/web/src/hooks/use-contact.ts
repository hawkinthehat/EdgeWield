import { useMutation } from "@tanstack/react-query";

export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

// Simulated API call since this is a frontend-only mockup
const submitContactForm = async (data: ContactFormInput) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!data.email.includes("@")) {
        reject(new Error("Invalid email address"));
      }
      resolve({ success: true, message: "Message sent successfully!" });
    }, 1500); // Simulate network delay
  });
};

export function useSubmitContact() {
  return useMutation({
    mutationFn: submitContactForm,
  });
}
