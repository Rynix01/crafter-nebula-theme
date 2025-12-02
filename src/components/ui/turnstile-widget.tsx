import Turnstile from "react-turnstile";
import { useState, useCallback, useEffect } from "react";

export default function TurnstileWidget({
  sitekey,
  onVerify,
  onError,
  hasError = false,
}: {
  sitekey: string;
  onVerify: (token: string) => void;
  onError: (error: Error) => void;
  hasError?: boolean;
}) {
  const [key, setKey] = useState(0);

  // Reset widget when external error state changes
  useEffect(() => {
    if (hasError) {
      setKey(prev => prev + 1);
    }
  }, [hasError]);

  const handleError = useCallback((error: Error) => {
    onError(error);
  }, [onError]);

  const handleVerify = useCallback((token: string) => {
    onVerify(token);
  }, [onVerify]);

  return (
    <Turnstile
      key={key}
      sitekey={sitekey}
      onVerify={handleVerify}
      onError={handleError}
    />
  );
}