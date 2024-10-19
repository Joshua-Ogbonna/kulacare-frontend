"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Header from "@/components/header/header";

const AIDietitianLandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Take Back Control of Your Health
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Reverse type 2 diabetes and lose weight sustainably with your
                personal AI coach on WhatsApp.
              </p>
              <div className="flex text-sm flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-teal-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Tailored Meal Plans</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-teal-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Blood Sugar Tracking</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-teal-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Expert Consultations</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8"
                  onClick={() => router.push("/chat")}
                >
                  Start Your Journey
                </Button>
                <Button
                  variant="outline"
                  className="text-teal-600 border-teal-600 hover:bg-teal-50"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <img
                src="https://images.unsplash.com/photo-1578496780896-7081cc23c111?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Smartphone with WhatsApp and glucose meter"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center grayscale opacity-50">
              {[...Array(7)].map((_, index) => (
                <div
                  key={index}
                  className="w-24 h-12 bg-gray-300 rounded"
                ></div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block px-3 py-1 bg-gray-100 text-sm text-gray-600 rounded-full mb-4">
            Powered by LLAMA 3.2
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Experience Personalized Diabetes Management
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI adapts to your blood glucose levels, weight goals, and food
            preferences to provide customized guidance for better health
            outcomes.
          </p>
        </section>
      </main>
    </div>
  );
};

export default AIDietitianLandingPage;
