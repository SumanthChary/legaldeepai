import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, Circle, Info, Loader2, Lock, ShieldCheck, Smile } from "lucide-react";
import { SignaturePadCanvas } from "@/components/esignatures/SignaturePadCanvas";

interface SessionInfo {
  requestId: string;
  documentName: string;
  documentPath: string;
  signer: string;
  status: string;
  expiresAt: string;
  signedAt: string | null;
  otpVerified: boolean;
  completed: boolean;
}

export default function SignDocument() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signerName, setSignerName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("get-signing-session", {
        body: { token },
      });

      if (error) {
        toast({ title: "Session error", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      if (!data) {
        toast({ title: "Session not found", variant: "destructive" });
        setLoading(false);
        return;
      }

      setSession(data as SessionInfo);
      setLoading(false);
    };

    fetchSession();
  }, [token, toast]);

  const sessionExpired = useMemo(() => {
    if (!session?.expiresAt) return false;
    return new Date(session.expiresAt) < new Date();
  }, [session]);

  const alreadyCompleted = session?.completed || session?.status === "completed";
  const nameIsValid = Boolean(signerName.trim());
  const signatureReady = Boolean(signatureData);
  const canSign = Boolean(session?.otpVerified) && !sessionExpired && !alreadyCompleted && nameIsValid && signatureReady;

  const requirements = [
    {
      id: "otp",
      label: "Enter the 6-digit verification code",
      met: Boolean(session?.otpVerified),
    },
    {
      id: "name",
      label: "Type your full legal name",
      met: nameIsValid,
    },
    {
      id: "signature",
      label: "Draw your signature in the box",
      met: signatureReady,
    },
    {
      id: "session",
      label: "Signing link is still valid",
      met: !sessionExpired,
    },
    {
      id: "completed",
      label: "Document still requires your signature",
      met: !alreadyCompleted,
    },
  ];

  const handleOtpSubmit = async () => {
    if (!token || otp.length !== 6) {
      toast({ title: "Enter the 6 digit code", variant: "destructive" });
      return;
    }
    setVerifyingOtp(true);
    const { data, error } = await supabase.functions.invoke("verify-signing-otp", {
      body: { token, code: otp },
    });
    setVerifyingOtp(false);

    if (error) {
      toast({ title: "Verification failed", description: error.message, variant: "destructive" });
      return;
    }

    setAccessToken((data as { accessToken?: string })?.accessToken ?? null);
    toast({ title: "Verified", description: "Identity confirmed. You can now sign." });
    setSession((prev) => (prev ? { ...prev, otpVerified: true } : prev));
  };

  const handleComplete = async () => {
    if (!token || !signatureData || !signerName.trim()) {
      toast({ title: "Missing details", description: "Add your name and signature before submitting", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("complete-signature", {
      body: {
        token,
        accessToken,
        signatureData,
        signerName: signerName.trim(),
        userAgent: navigator.userAgent,
        consentAccepted: true,
      },
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Signing failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Document signed", description: "Thank you! A confirmation email will arrive shortly." });
    setSession((prev) => (prev ? { ...prev, completed: true, status: "completed" } : prev));
    setSignatureData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!session || !token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Smile className="w-10 h-10 text-purple-500" />
        <p className="text-lg text-muted-foreground">We couldn't find that signing request.</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50 py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="p-8 shadow-xl border-purple-100 bg-white/90">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-purple-900">Sign document</h1>
              <p className="text-sm text-muted-foreground">{session.documentName}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-700">
              <ShieldCheck className="w-5 h-5" />
              <span>Secure signing powered by LegalDeep AI</span>
            </div>
          </div>

          <div className="grid gap-6">
            {sessionExpired && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4">
                <p className="text-sm font-medium">This signing session has expired. Ask the sender to resend a new link.</p>
              </div>
            )}

            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
              <p className="text-sm text-purple-800">
                We emailed a 6-digit code to <strong>{session.signer}</strong>. Enter it below to verify your identity.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-purple-900 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Verification code
              </label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                disabled={session.otpVerified || sessionExpired || verifyingOtp || alreadyCompleted}
                className="text-center text-lg tracking-widest"
              />
              {!session.otpVerified && !alreadyCompleted && (
                <Button
                  onClick={handleOtpSubmit}
                  disabled={otp.length !== 6 || verifyingOtp || sessionExpired}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {verifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify code"}
                </Button>
              )}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-purple-900">
                Printed name <span className="text-xs font-normal text-muted-foreground">(for the audit trail)</span>
              </label>
              <Input
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Full legal name"
                disabled={!session.otpVerified || submitting || sessionExpired || alreadyCompleted}
              />
              <p className="text-xs text-muted-foreground">
                This is the readable name that shows on the certificate. Your drawn signature can be any mark—it doesn’t have to match these letters.
              </p>
            </div>

            <SignaturePadCanvas
              onChange={setSignatureData}
              disabled={!session.otpVerified || submitting || sessionExpired || alreadyCompleted}
            />

            <div className="rounded-xl border border-purple-100 bg-purple-50/80 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-purple-900">
                <Info className="h-4 w-4" />
                <span>Complete the steps below to enable signing:</span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-purple-900/80">
                {requirements.map(({ id, label, met }) => (
                  <li
                    key={id}
                    data-testid={`requirement-${id}`}
                    data-state={met ? "met" : "pending"}
                    className="flex items-center gap-3 rounded-lg bg-white/60 px-3 py-2"
                  >
                    {met ? <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden /> : <Circle className="h-4 w-4 text-purple-300" aria-hidden />}
                    <span className="flex-1">{label}</span>
                    <span className="text-xs font-medium text-purple-500">{met ? "Done" : "Pending"}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-muted-foreground bg-purple-50 border border-purple-100 rounded-lg p-4">
              By clicking <strong>Sign document</strong> you agree that this electronic signature is the legal equivalent of your handwritten signature and you consent to receive documents electronically.
            </p>

            <Button
              onClick={handleComplete}
              disabled={!canSign || submitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign document"}
            </Button>
          </div>
        </Card>

        {(alreadyCompleted || session.completed) && (
          <Card className="p-6 border-green-200 bg-green-50 text-green-900">
            <h2 className="font-semibold text-lg mb-2">All done!</h2>
            <p className="text-sm">
              We've recorded your signature and notified the document owner. You can close this window now.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
