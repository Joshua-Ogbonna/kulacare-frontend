"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RefreshCw,
  Phone,
  User,
  Scale,
  Ruler,
  CalendarDays,
  Target,
  KeyRound,
  Copy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { IUSer } from "@/interfaces";
import Header from "@/components/header/header";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function UserProfile() {
  const [user, setUser] = useState<IUSer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber");

    if (!storedPhoneNumber) {
      router.push("/signin");
      return;
    }

    fetchUserData(storedPhoneNumber);
  }, []);

  const fetchUserData = async (phoneNumber: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/${phoneNumber}`
      );
      const data = await response.json();

      if (!data.success) {
        localStorage.removeItem("phoneNumber");
        router.push("/signin");
        return;
      }
      setUser(data.user as IUSer);
      setError(null);
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
      setError("Failed to load user data");
      localStorage.removeItem("phoneNumber");
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/generate-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user?.id }),
        }
      );
      const data = await response.json();

      if (data.code) {
        setSuccessMessage(`Your activation code is: ${data.code}`);
        fetchUserData(user?.phoneNumber as string);
      }
    } catch (error: unknown) {
      setError("Failed to generate code");
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
    }
  };
  /**catch (error: unknown) {
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
    } 
      setError("Failed to generate code",);*/

  const copyCode = async () => {
    if (user?.code) {
      await navigator.clipboard.writeText(user.code);
      setSuccessMessage("Code copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="container max-w-4xl mx-auto p-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-4">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button onClick={generateCode}>Generate Activation Code</Button>
        </div>

        <div className="space-y-6">
          {/* Activation Code Section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                Activation Status
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant={user.isActivated ? "default" : "secondary"}>
                    {user.isActivated ? "Activated" : "Not Activated"}
                  </Badge>
                </div>
              </div>
              {user.code && (
                <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Your Code:</span>
                    <span className="font-mono">{user.code}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyCode}
                    className="flex gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Basic Information */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Name:</span>
                  <span>{user?.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="font-medium">Phone:</span>
                <span>{user?.phoneNumber}</span>
              </div>
            </CardContent>
          </Card>

          {/* Health Information */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Health Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <span className="font-medium">Age:</span>
                  <span>{user?.healthInfo?.age} years</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  <span className="font-medium">Weight:</span>
                  <span>{user?.healthInfo?.weight} kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  <span className="font-medium">Height:</span>
                  <span>{user?.healthInfo?.height} cm</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Dietary Restrictions:</h3>
                <div className="flex flex-wrap gap-2">
                  {user?.healthInfo?.dietaryRestrictions?.map(
                    (restriction: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {restriction}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Health Category:</h3>
                <Badge variant="outline" className="text-base">
                  {user?.healthCategory}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
