"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Header from "@/components/header/header";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignInForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber");
    if (storedPhoneNumber) {
      router.push("/chat");
    }
  }, [router]);

  useEffect(() => {
    // Simple validation: Check if phoneNumber is not empty and contains only digits
    setIsPhoneNumberValid(
      phoneNumber.trim() !== "" && /^\d+$/.test(phoneNumber)
    );
  }, [phoneNumber]);

  const handleSubmit = async () => {
    if (!isPhoneNumberValid) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);

      // Replace this with your actual sign-in API endpoint
      const response = await axios.post("http://localhost:30299/api/signin", {
        phoneNumber,
      });

      if (response.data.success) {
        toast({ title: "Success", description: "Signed in successfully" });
        localStorage.setItem("phoneNumber", phoneNumber);
        router.push("/chat");
      } else {
        toast({
          title: "Error",
          description: "Invalid phone number",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to sign in",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen w-full md:w-7/12 mx-auto bg-white p-8">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <div className="space-y-4">
          <Input
            name="phoneNumber"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center mt-4">
            <Link href="/signup" className="text-teal-600 hover:underline">
              New user? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInForm;
