"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Header from "@/components/header/header";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  name: string;
  phoneNumber: string;
  age: string;
  weight: string;
  feet: string;
  inches: string;
  healthCategory: string;
  dietaryRestrictions: string[];
  customRestriction: string;
}

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    age: "",
    weight: "",
    feet: "",
    inches: "",
    healthCategory: "",
    dietaryRestrictions: [],
    customRestriction: "",
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const predefinedRestrictions = [
    "Gluten-free",
    "Dairy-free",
    "Vegan",
    "Vegetarian",
    "Keto",
    "Other",
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRestrictionChange = (restriction: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter((r) => r !== restriction)
        : [...prev.dietaryRestrictions, restriction],
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const height = `${formData.feet}.${formData.inches}`;
      const restrictions = [
        ...formData.dietaryRestrictions,
        formData.customRestriction,
      ]
        .filter(Boolean)
        .join(", ");

      const payload = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        healthInfo: {
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          height: parseFloat(height),
          dietaryRestrictions: restrictions,
        },
        healthCategory: formData.healthCategory,
      };

      const response = await axios.post(
        "http://localhost:30299/api/create-user",
        payload
      );
      toast({ title: "Success", description: response.data.message, variant: "default" });

      localStorage.setItem("phoneNumber", formData.phoneNumber);
      router.push("/chat");
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

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber");
    if (storedPhoneNumber) {
      router.push("/chat");
    }
  }, [router]);

  return (
    <>
      <Header />
      <div className="min-h-screen w-full md:w-7/12 mx-auto bg-white p-8">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <div className="space-y-4">
          <Input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleFormChange}
          />
          <Input
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleFormChange}
          />

          <div className="flex space-x-4">
            <Input
              name="age"
              placeholder="Age"
              type="number"
              value={formData.age}
              onChange={handleFormChange}
              className="flex-1"
            />
            <Input
              name="weight"
              placeholder="Weight (in kg)"
              type="number"
              value={formData.weight}
              onChange={handleFormChange}
              className="flex-1"
            />
          </div>

          <div className="flex space-x-4">
            <Input
              name="feet"
              placeholder="Feet"
              type="number"
              value={formData.feet}
              onChange={handleFormChange}
              min="0"
              max="8"
              className="flex-1"
            />
            <Input
              name="inches"
              placeholder="Inches"
              type="number"
              value={formData.inches}
              onChange={handleFormChange}
              min="0"
              max="11"
              className="flex-1"
            />
          </div>

          <Select
            value={formData.healthCategory}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, healthCategory: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Health Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="type 2 diabetes">
                Yes, I have Diabetes type 2
              </SelectItem>
              <SelectItem value="type 1 diabetes">
                Yes, I have Diabetes type 1
              </SelectItem>
              <SelectItem value="pre diabetes">
                Yes, I have Pre Diabetes
              </SelectItem>
              <SelectItem value="no diabetes">
                No, I {"don't"} have Diabetes
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold">Dietary Restrictions</h2>
            {predefinedRestrictions.map((restriction) => (
              <div key={restriction} className="flex items-center space-x-2">
                <Checkbox
                  id={restriction}
                  checked={formData.dietaryRestrictions.includes(restriction)}
                  onCheckedChange={() => handleRestrictionChange(restriction)}
                />
                <Label htmlFor={restriction}>{restriction}</Label>
              </div>
            ))}
            {formData.dietaryRestrictions.includes("Other") && (
              <Input
                name="customRestriction"
                placeholder="Other dietary restriction"
                value={formData.customRestriction}
                onChange={handleFormChange}
              />
            )}
          </div>

          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </Button>

          <div className="text-center mt-4">
            <Link href="/signin" className="text-teal-600 hover:underline">
              Already a user? Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
