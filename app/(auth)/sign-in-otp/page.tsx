"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { magicLinkFormSchema } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { redirect } from "next/navigation";
const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function SignIn() {
  const [value, setValue] = React.useState(false);
  const [emailUser, setEmailUser] = React.useState("");
  const form = useForm<z.infer<typeof magicLinkFormSchema>>({
    resolver: zodResolver(magicLinkFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const formOTP = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(values: z.infer<typeof magicLinkFormSchema>) {
    const { email } = values;
    toast({
      title: "Sending OTP code",
    });
    await authClient.emailOtp.sendVerificationOtp({
      email: email,
      type: "sign-in", // or "email-verification"
    });
    setValue(true);
    setEmailUser(email);
  }

  async function onSubmitOTP(valor: z.infer<typeof FormSchema>) {
    const { pin } = valor;
    toast({
      title: "Checking OTP",
    });
    const user = await authClient.signIn.emailOtp({
      email: emailUser,
      otp: pin,
      fetchOptions: {
        onRequest: (ctx) => {
          //show loading
          toast({
            title: "Please wait....",
          });
        },
        onSuccess: (ctx) => {
          formOTP.reset();
          redirect("/dashboard");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    });
  }
  return (
    <>
      {value && (
        <div className="flex flex-col items-center justify-center bg-black/80 fixed text-white top-0 h-full w-full">
          <Form {...formOTP}>
            <form
              onSubmit={formOTP.handleSubmit(onSubmitOTP)}
              className="w-2/3 space-y-6 flex flex-col items-center justify-center"
            >
              <FormField
                control={formOTP.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-center">
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription className="text-center text-white">
                      Please enter the one-time password sent to your phone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      )}

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sign In OTP</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-up" className="hover:underline text-primary">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
