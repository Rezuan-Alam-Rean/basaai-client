import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useLoginMutation, useGoogleAuthMutation } from "../redux/features/auth/authApi";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

export function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [googleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector((state) => state.auth);
  const isLoading = isLoginLoading || isGoogleLoading || loading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      const result = await login(formData).unwrap();
      const user = result.user || result;
      toast.success("Successfully logged in!");
      if (user.role === 'LISTER') {
        router.push("/lister");
      } else {
        router.push("/seeker");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to log in");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const result = await googleAuth({ idToken: credentialResponse.credential }).unwrap();
        const user = result.user || result;
        toast.success("Successfully logged in with Google!");
        if (user.role === 'LISTER') {
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
          <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
          {/* Google Login */}
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
              <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
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

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Password</label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type={showPass ? "text" : "password"} 
                placeholder="••••••••" 
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
          </div>

          {mounted && (
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          )}
          {!mounted && (
            <Button type="submit" disabled className="w-full bg-primary hover:bg-primary/90">
              Sign In
            </Button>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-semibold transition-all">Get Started</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
