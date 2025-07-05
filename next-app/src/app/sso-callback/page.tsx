import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  );
} 