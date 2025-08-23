import { Footer } from "@/components/layout/Footer";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { AuthHeader } from "@/components/layout/AuthHeader";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Join Evenova
            </h1>
            <p className="text-muted-foreground">
              Create your account to start discovering amazing events
            </p>
          </div>
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
