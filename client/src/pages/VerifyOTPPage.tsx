import { Footer } from "@/components/layout/Footer";
import { OTPForm } from "@/components/forms/OTPForm";
import { AuthHeader } from "@/components/layout/AuthHeader";

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Verify Your Email
            </h1>
            <p className="text-muted-foreground">
              We've sent a 6-digit verification code to your email address.
              Please enter it below to complete your registration.
            </p>
          </div>
          <OTPForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
