import {
  Alert,
  AlertDescription,
  AlertTitle,
  iconVariants,
} from "@/components/ui_/alert";

type Props = {
  result: {
    data?: {
      [key: string]: string | undefined;
    };
    validationErrors?: Record<string, string[] | undefined> | undefined;
    fetchError?: string;
    serverError?: string;
  };
  className?: string;
};

export const FormDetailedAlert = ({ result, className }: Props) => {
  return (
    <>
      {result.data?.message && (
        <Alert variant="success" className={className}>
          {iconVariants.success}
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{result.data?.message}</AlertDescription>
        </Alert>
      )}
      {result.validationErrors && (
        <Alert variant="error" className={className}>
          {iconVariants.error}
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>
            {Object.values(result.validationErrors).map((error, i) => (
              <div key={i} className="text-sm">
                {error}
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}
      {result.fetchError && (
        <Alert variant="error" className={className}>
          {iconVariants.error}
          <AlertTitle>Fetch Error</AlertTitle>
          <AlertDescription>{result.fetchError}</AlertDescription>
        </Alert>
      )}
      {result.serverError && (
        <Alert variant="error" className={className}>
          {iconVariants.error}
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{result.serverError}</AlertDescription>
        </Alert>
      )}
    </>
  );
};
