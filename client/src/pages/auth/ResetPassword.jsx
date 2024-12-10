import { Button, ErrorMessage, Input } from "../../components/ui";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useActionState } from "react";
import apiFetch from "../../utils/apiFetch";
import logger from "../../utils/logger";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const navigate = useNavigate();

  const formState = async (prevState, formData) => {
    try {
      const data = {
        password: formData.get("password"),
        passwordConfirm: formData.get("passwordConfirm"),
        token,
      };

      const response = await apiFetch("/api/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return result;
      }

      logger.info("Password reset successful:", result);

      navigate("/auth/login");

      alert(
        "Password reset successful. You can now log in with your new password."
      );

      return null;
    } catch (error) {
      logger.error("Error resetting password:", error);

      return { errorMessage: "An error occurred. Please try again." };
    }
  };

  const [errors, formAction, isPending] = useActionState(formState, null);

  return (
    <div className="container container-sm">
      <h1>Reset Password</h1>

      <form action={formAction} className="panel" style={{ padding: "2rem" }}>
        <ErrorMessage message={errors?.errorMessage} />

        <div className="stack">
          <Input
            autoComplete="new-password"
            errors={errors}
            fullWidth
            label="New Password"
            maxLength={255}
            name="password"
            required
            type="password"
          />

          <Input
            autoComplete="new-password"
            errors={errors}
            fullWidth
            label="Confirm Password"
            maxLength={255}
            name="passwordConfirm"
            required
            type="password"
          />
        </div>

        <Button
          className="w-full"
          loading={isPending}
          size="lg"
          style={{ marginTop: "1.5rem" }}
          type="submit"
        >
          Reset Password
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
