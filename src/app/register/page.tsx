'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useGetGovIdTypesQuery, useRegisterCandidateMutation, useGetCollegesQuery } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, EyeOff } from 'lucide-react';

const registrationSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters.'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number.'),
  timezone: z.string().min(2, 'Timezone is required.'),
  role: z.string(), // Role will be set programmatically
  college: z.string().min(2, 'Organization name is required.'),
  govIdType: z.string().min(1, 'Please select an ID type.'),
  govIdNumber: z.string().min(4, 'ID number must be at least 4 characters.'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ['confirmPassword'],
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // RTK Query Hooks
  const { data: idTypes = [], isLoading: isLoadingIdTypes } = useGetGovIdTypesQuery({});
  const { data: colleges = [], isLoading: isLoadingColleges } = useGetCollegesQuery({});
  const [registerCandidate, { isLoading: isRegistering }] = useRegisterCandidateMutation();


  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      role: 'candidate', // Default role for test-takers
      college: '',
      govIdType: '',
      govIdNumber: '',
    },
  });

  async function onSubmit(data: RegistrationFormValues) {
    try {
        await registerCandidate(data).unwrap();
        toast({
            title: 'Registration Successful',
            description: 'Your account has been created.',
        });
        router.push('/');
    } catch (err: any) {
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: err.data?.message || "An unexpected error occurred.",
        });
    }
  }
  
  const collegeOptions = colleges.map((c: any) => ({ label: c.name, value: c.name }));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold">
            <Icons.Logo className="h-8 w-8 text-primary" />
            <span>ProctorLock</span>
        </div>
        <p className="text-muted-foreground text-sm mt-1">Secure Online Examination Platform</p>
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create a Candidate Account</CardTitle>
          <CardDescription>
            Register to get started with your secure online exams. To register as an Examiner or Admin, please contact support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                              onClick={() => setShowPassword((prev) => !prev)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              <span className="sr-only">Toggle password visibility</span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                              <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              {...field}
                              />
                               <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  <span className="sr-only">Toggle password visibility</span>
                                </Button>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="(123) 456-7890"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. America/New_York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="college"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Organization / Institute</FormLabel>
                      {isLoadingColleges ? <Skeleton className="h-10 w-full" /> : (
                         <FormControl>
                            <Combobox
                              options={collegeOptions}
                              value={field.value}
                              onChange={(value) => form.setValue('college', value)}
                              placeholder="Select or search..."
                              searchPlaceholder="Search colleges..."
                              notFoundMessage="No college found."
                            />
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="govIdType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>ID Type</FormLabel>
                        {isLoadingIdTypes ? <Skeleton className="h-10 w-full" /> : (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="ID Type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {idTypes.map((idType: any) => (
                                    <SelectItem key={idType.value} value={idType.value}>
                                    {idType.label}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        )}
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="govIdNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>ID Number</FormLabel>
                        <FormControl>
                            <Input placeholder="ID Number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isRegistering}>
                {isRegistering ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          <p>
            Already have an account?{' '}
            <Link
              href="/"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
