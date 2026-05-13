"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Mail, Lock, Eye, EyeOff, User, Phone, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useRegisterMutation, useGoogleAuthMutation } from "../redux/features/auth/authApi";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

export function SignupPage() {
  const searchParams = useSearchParams();
  // console.log("Current search params:", searchParams.get("role"));
  const [mounted, setMounted] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "SEEKER",
  });

  // console.log("Form data state:", formData.role);

  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [googleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const roleParam = (searchParams.get("role") || "").toString().trim().toUpperCase();
    // console.log("Role param:", roleParam);

    setFormData((prev) => ({
      ...prev,
      role: roleParam
    }));
  }, []);

  // console.log("Form data:", formData);

  // No extra role-sync needed: initial role is read from URL on mount

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const isLoading = isRegisterLoading || isGoogleLoading || loading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (value: string) => {

    // console.log("Role changed to:", value);

    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await register(formData).unwrap();
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create account");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const result = await googleAuth({ idToken: credentialResponse.credential }).unwrap();
        const user = result.user || result;
        toast.success("Successfully logged in with Google!");
        if (user.role === "LISTER") {
          router.push("/lister");
        } else {
          router.push("/seeker");
        }
      } catch (err: any) {
        toast.error(err?.data?.message || "Google login failed");
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-7 h-7 text-primary" />
            <span className="text-2xl font-bold">BashaAI</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground">Join thousands of seekers and listers in Bangladesh</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
          {/* Google Signup */}
          {mounted && (
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error("Google Login Failed");
                }}
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">or sign up with email</span>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Your full name" 
                className="pl-9" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type="email"
                placeholder="you@example.com" 
                className="pl-9" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type="tel" 
                placeholder="01XXXXXXXXX" 
                className="pl-9" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type={showPass ? "text" : "password"} 
                placeholder="Create a strong password" 
                className="pl-9 pr-9" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Must be at least 8 characters</p>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">I am a</label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LISTER">Lister (Renting out a home)</SelectItem>
                <SelectItem value="SEEKER">Seeker (Looking for a home)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mounted && (
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          )}
          {!mounted && (
            <Button type="submit" disabled className="w-full bg-primary hover:bg-primary/90">
              Create Account
            </Button>
          )}

          <p className="text-[10px] text-center text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold transition-all">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
