"use client";
import { useRef } from "react";

import Input from "../shared/Input";
import { Button } from "../ui";

interface Props {
  userEmail: string | undefined;
}

export default function PasswordResetForm({ userEmail }: Props) {
  const logoutFormRef = useRef(null);
  const isProcessing = false;
  return (
    <div>
      <form method="post" className="border-t py-8">
        <div>
          <p>
            Use the link to send yourself a password reset email. You will be
            logged out 3 seconds after clicking the link.
          </p>
          <Button
            type="submit"
            disabled={isProcessing}
            name="intent"
            value="resetPassword"
            variant="link"
          >
            {isProcessing
              ? "Sending link and logging you out..."
              : "Send password reset email."}
          </Button>
          <Input
            label="email"
            hideLabel={true}
            data-test-id="email"
            name="email"
            type="hidden"
            disabled={isProcessing}
            value={userEmail}
          />
        </div>
        <div className="mt-4 text-right"></div>
      </form>
      <div className="hidden">
        <form action="/logout" method="post" ref={logoutFormRef}>
          <button data-test-id="logout" type="submit" />
        </form>
      </div>
    </div>
  );
}
