'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "Sign Up Failed",
            description: "Password must be at least 6 characters long.",
        });
        setIsLoading(false);
        return;
    }
    if (!agreedToTerms) {
        toast({
            variant: "destructive",
            title: "Sign Up Failed",
            description: "You must agree to the Terms of Use.",
        });
        setIsLoading(false);
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const displayName = `${firstName} ${lastName}`.trim();

      await updateProfile(user, {
        displayName: displayName,
      });

      await sendEmailVerification(user);

      // This data will now be created by the useUser hook automatically
      // We just need to create the doc to trigger the hook.
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL,
      }, { merge: true });
      
      router.push('/login');
      toast({
        title: "Account Created! Please Verify Your Email",
        description: "We've sent a verification link to your email address. Please check your inbox.",
        duration: 10000,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'Could not create an account. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input 
                    id="first-name" 
                    placeholder="Max" 
                    required 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input 
                    id="last-name" 
                    placeholder="Robinson" 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
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
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'}
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button 
                    variant="ghost" 
                    size="icon" 
                    type="button"
                    className="absolute inset-y-0 right-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                    I agree to the{' '}
                    <Link href="/terms" className="underline hover:text-primary">
                        Terms of Use
                    </Link>
                </Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !agreedToTerms}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create an account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
            Already have an account?{' '}
            <Button variant="link" asChild>
                <Link href="/login">
                    Login
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
