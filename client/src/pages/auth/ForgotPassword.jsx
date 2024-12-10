import { Button, ErrorMessage, Input } from "../../components/ui";
import { Link } from "react-router";
import { useActionState } from "react";
import apiFetch from "../../utils/apiFetch";
import logger from "../../utils/logger";

export default function ForgotPassword() {
  const formState = async (prevState, formData) => {
    try {
      const data = {
        email: formData.get("email"),
      };

      const response = await apiFetch("/api/forgot-password", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return result;
      }

      logger.info("Forgot password email sent:", result);

      alert("Email sent. Please check your inbox.");

      return null;
    } catch (error) {
      logger.error("Error sending forgot password email:", error);

      return { errorMessage: "An error occurred. Please try again." };
    }
  };

  const [errors, formAction, isPending] = useActionState(formState, null);

  return (
    <div className="container container-sm">
      <h1>Forgot Password</h1>

      <form action={formAction} className="panel" style={{ padding: "2rem" }}>
        <ErrorMessage message={errors?.errorMessage} />

        <Input
          autoComplete="email"
          errors={errors}
          fullWidth
          label="Email"
          maxLength={255}
          name="email"
          required
          type="email"
        />

        <Button
          className="w-full"
          loading={isPending}
          size="lg"
          style={{ marginTop: "1.5rem" }}
          type="submit"
        >
          Send Email
        </Button>

        <p className="text-center" style={{ marginBottom: 0 }}>
          or,{" "}
          <Link className="link" to="/auth/login">
            login
          </Link>
        </p>
      </form>
    </div>
  );
}
