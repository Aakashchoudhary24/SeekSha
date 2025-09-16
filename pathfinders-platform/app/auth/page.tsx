"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/firebase";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { user, token } = await signInWithGoogle();

      // Store user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          token: token,
        })
      );

      // Redirect to accounts page
      router.push("/account");
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed. Make sure authorized domains include localhost:3000");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <GraduationCap className="w-10 h-10 mx-auto text-primary mb-2" />
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in with Google to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
              {isLoading ? "Loading..." : "Continue with Google"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
