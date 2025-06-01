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
import { googleLogin } from "@/fetcher/user-login";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
    try {
      const token = await googleLogin(credentialResponse);
      localStorage.setItem("access_token", token.data.access_token);
      localStorage.setItem("user", JSON.stringify(token));
      // Check for redirect parameter
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Google login error:', error);
      // toast({
      //   variant: "destructive",
      //   title: "Google login failed",
      //   description: error instanceof Error ? error.message : 'An unknown error occurred',
      // });
    }
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
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
                <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log("Login Failed");
                //   toast({
                //     variant: "destructive",
                //     title: "Login Failed",
                //     description: "Google login failed. Please try again.",
                //   });
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
