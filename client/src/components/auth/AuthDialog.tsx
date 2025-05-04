import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { emailSignIn, emailSignUp, googleSignIn } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login schema
  const loginSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
  });

  // Registration schema
  const registerSchema = loginSchema.extend({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters",
    }),
    name: z.string().optional(),
  });

  // Create form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      name: "",
    },
  });

  const handleSignIn = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    
    try {
      await emailSignIn(values.email, values.password);
      toast({
        title: "Sign in successful",
        description: "Welcome back to Wakili AI",
      });
      onClose();
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    
    try {
      await emailSignUp(values.email, values.password, values.username, values.name);
      toast({
        title: "Registration successful",
        description: "Welcome to Wakili AI",
      });
      onClose();
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      await googleSignIn();
      toast({
        title: "Sign in successful",
        description: "Welcome to Wakili AI",
      });
      onClose();
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isSignUp ? t("auth.signUp") : t("auth.signIn")}
          </DialogTitle>
        </DialogHeader>
        
        <div>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 mb-4"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="h-5 w-5"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t("auth.continueWithGoogle")}
          </Button>
          
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">{t("auth.or")}</span>
            </div>
          </div>
          
          {isSignUp ? (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(handleSignUp)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@example.com"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.username")}</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.name")}</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.password")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("common.loading") : t("auth.createAccount")}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleSignIn)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@example.com"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.password")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("common.loading") : t("auth.signIn")}
                </Button>
              </form>
            </Form>
          )}
          
          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <p>
                {t("auth.hasAccount")}{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setIsSignUp(false)}
                  disabled={isLoading}
                >
                  {t("auth.signIn")}
                </Button>
              </p>
            ) : (
              <p>
                {t("auth.noAccount")}{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setIsSignUp(true)}
                  disabled={isLoading}
                >
                  {t("auth.signUp")}
                </Button>
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
