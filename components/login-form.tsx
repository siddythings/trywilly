"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation"
import { googleLogin, userLogin } from "@/fetcher/user-login";
import { useState } from "react"
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
    try {
      const token = await googleLogin(credentialResponse);
      localStorage.setItem("access_token", token.data.access_token);
      localStorage.setItem("user", JSON.stringify(token));
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Google login error:', error);
      toast("Google login failed", {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        style: { background: 'var(--destructive)', color: 'var(--destructive-foreground)' },
      });
    }
  };

  const loginHandler = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!email || !password) {
      toast("Please fill all the fields", {
        style: { background: 'var(--destructive)', color: 'var(--destructive-foreground)' },
      });
      return;
    }

    try {
      const token = await userLogin(email, password);
      localStorage.setItem("access_token", token.data.access_token);
      localStorage.setItem("user", JSON.stringify(token));
      router.push("/dashboard");
    } catch (error: unknown) {
      toast("Oops! Something went wrong", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
        style: { background: 'var(--destructive)', color: 'var(--destructive-foreground)' },
      });
    }
    return;
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input id="password" type="password" required placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" onClick={loginHandler}>
                  Login
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
                <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log("Login Failed");
                  toast("Login Failed", {
                    description: "Google login failed. Please try again.",
                    style: { background: 'var(--destructive)', color: 'var(--destructive-foreground)' },
                  });
                }}
              />
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
