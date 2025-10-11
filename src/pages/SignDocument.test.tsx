import React from "react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SignDocument from "./SignDocument";

const { toastSpy, invokeMock } = vi.hoisted(() => ({
  toastSpy: vi.fn(),
  invokeMock: vi.fn(),
}));

vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: toastSpy }),
  toast: toastSpy,
}));

vi.mock("@/components/esignatures/SignaturePadCanvas", () => ({
  SignaturePadCanvas: ({ onChange }: { onChange?: (value: string | null) => void }) => {
    React.useEffect(() => {
      onChange?.("mock-signature");
    }, [onChange]);
    return <div data-testid="signature-pad">Signature Pad</div>;
  },
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: {
      invoke: (...args: unknown[]) => invokeMock(...args),
    },
  },
}));

describe("SignDocument", () => {
  beforeEach(() => {
    toastSpy.mockReset();
    invokeMock.mockReset();
  });

  const renderWithRoute = () => {
    return render(
      <MemoryRouter initialEntries={["/sign/secure-token"]}>
        <Routes>
          <Route path="/sign/:token" element={<SignDocument />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("verifies OTP and completes signing flow", async () => {
    const session = {
      requestId: "request-1",
      documentName: "Agreement.pdf",
      documentPath: "documents/request-1.pdf",
      signer: "signer@example.com",
      status: "pending",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      signedAt: null,
      otpVerified: false,
      completed: false,
    };

  invokeMock.mockImplementation(async (name: string, options: { body?: Record<string, unknown> }) => {
      switch (name) {
        case "get-signing-session":
          expect(options?.body?.token).toBe("secure-token");
          return { data: session, error: null };
        case "verify-signing-otp":
          expect(options?.body).toEqual({ token: "secure-token", code: "123456" });
          return { data: { accessToken: "access-token" }, error: null };
        case "complete-signature":
          expect(options?.body?.accessToken).toBe("access-token");
          expect(options?.body?.signatureData).toBe("mock-signature");
          expect(options?.body?.signerName).toBe("Ada Lovelace");
          return { data: { success: true }, error: null };
        default:
          return { data: null, error: null };
      }
    });

  renderWithRoute();

  await screen.findByRole("heading", { name: /sign document/i });

    const verifyButton = screen.getByRole("button", { name: /verify code/i });
    expect(verifyButton).toBeDisabled();

    const otpInput = screen.getByPlaceholderText("123456");
    await userEvent.type(otpInput, "123456");
    expect(verifyButton).toBeEnabled();

    await userEvent.click(verifyButton);

    await waitFor(() => expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({ title: "Verified" })));

    const nameInput = screen.getByPlaceholderText("Full legal name");
    await userEvent.type(nameInput, "Ada Lovelace");

    const signButton = screen.getByRole("button", { name: /sign document/i });
    await waitFor(() => expect(signButton).toBeEnabled());

    await userEvent.click(signButton);

    await waitFor(() => expect(invokeMock).toHaveBeenCalledWith(
      "complete-signature",
      expect.objectContaining({ body: expect.objectContaining({ signerName: "Ada Lovelace" }) })
    ));

    expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({ title: "Document signed" }));
  });

  it("notifies user when OTP verification fails", async () => {
    const session = {
      requestId: "request-1",
      documentName: "Agreement.pdf",
      documentPath: "documents/request-1.pdf",
      signer: "signer@example.com",
      status: "pending",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      signedAt: null,
      otpVerified: false,
      completed: false,
    };

  invokeMock.mockImplementation(async (name: string, options: { body?: Record<string, unknown> }) => {
      switch (name) {
        case "get-signing-session":
          return { data: session, error: null };
        case "verify-signing-otp":
          return { data: null, error: { message: "Invalid code" } };
        default:
          return { data: null, error: null };
      }
    });

  renderWithRoute();

  await screen.findByRole("heading", { name: /sign document/i });

    const otpInput = screen.getByPlaceholderText("123456");
    await userEvent.type(otpInput, "000000");

    const verifyButton = screen.getByRole("button", { name: /verify code/i });
    await userEvent.click(verifyButton);

    await waitFor(() => expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({ title: "Verification failed" })));
    expect(invokeMock).not.toHaveBeenCalledWith("complete-signature", expect.anything());
  });
});
