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

export default function SignIn() {
  const form = useForm<z.infer<typeof magicLinkFormSchema>>({
    resolver: zodResolver(magicLinkFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof magicLinkFormSchema>) {
    const { email } = values;
    const { data, error } = await authClient.signIn.magicLink(
      {
        email: email,
        callbackURL: "/dashboard",
      },

      {
        onRequest: (ctx) => {
          //show loading
          toast({
            title: "Please wait....",
          });
        },
        onSuccess: (ctx) => {
          form.reset();
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      }
    );
    console.log(values);
  }
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In Magic Link</CardTitle>
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
  );
}
