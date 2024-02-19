import { useState } from "react";

import EmailVerification from "./email-verification";
import { UserAuthForm } from "./signup-form";

export default function Index() {
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {showEmailVerification ? (
          <EmailVerification />
        ) : (
          <UserAuthForm setShowEmailVerification={setShowEmailVerification} />
        )}
      </div>
    </div>
  );
}
