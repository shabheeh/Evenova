import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation, NavLink as Link } from "react-router-dom";
import { toast } from "sonner";
import type { VerifyOtpData } from "@/types/auth.types";
import { verifyOtp } from "@/services/authService";

interface LocationState {
  email?: string;
}

export const OTPForm = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = (location.state as LocationState)?.email || "";

  useEffect(() => {
    if (!email) {
      toast.error("Email is required. Please register again.");
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: VerifyOtpData) => {
      return await verifyOtp(data);
    },
    onSuccess: () => {
      toast.success("OTP verified successfully!");
      navigate("/login");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Invalid OTP. Please try again."
      );

      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      //   return await resendOtp({ email });
    },
    onSuccess: () => {
      toast.success("OTP sent successfully!");
      setCanResend(false);
      setTimeLeft(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to resend OTP. Please try again."
      );
      setCanResend(true);
    },
  });

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1 || (value && !/^\d$/.test(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6).split("");
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
      });
    }

    if (
      !/^\d$/.test(e.key) &&
      !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    if (!email) {
      toast.error("Email is missing. Please register again.");
      navigate("/register");
      return;
    }

    verifyOtpMutation.mutate({
      otp: otpString,
      email: email,
    });
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is missing. Please register again.");
      navigate("/register");
      return;
    }

    resendOtpMutation.mutate();
  };

  const isComplete = otp.every((digit) => digit !== "");

  if (!email) {
    return null;
  }

  return (
    <Card className="shadow-lg border-0 bg-card">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold text-center">
          Enter Verification Code
        </CardTitle>
        <p className="text-sm text-center text-muted-foreground">
          We've sent a code to{" "}
          <span className="font-medium">
            {email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
          </span>
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" value={email} name="email" />

          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-emerald-500"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            disabled={!isComplete || verifyOtpMutation.isPending}
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
          </Button>
        </form>

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>

          {canResend ? (
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={resendOtpMutation.isPending}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              {resendOtpMutation.isPending ? "Sending..." : "Resend Code"}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Resend code in{" "}
              <span className="font-medium text-emerald-600">{timeLeft}s</span>
            </p>
          )}

          <div className="pt-4">
            <Link
              to="/register"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to registration
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
