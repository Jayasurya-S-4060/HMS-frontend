import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, notification } from "antd";
import * as Yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";

import resetPasswordRequest from "../services/resetPasswordRequest";
import resetPassword from "../services/resetPassword";
import FormLayout from "../components/LayoutWrapper";

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <FormLayout>
      <div>
        <h2 className="text-2xl font-semibold text-gray-700">
          Forgot Password
        </h2>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={Yup.object({
            email: Yup.string().email("Invalid email").required("Required"),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            try {
              await resetPasswordRequest(values);
              notification.success({
                message: "Verification link sent!",
                description: "Check your email to reset your password.",
              });
              navigate("/");
            } catch (err) {
              notification.error({
                message: "Error",
                description:
                  err.response?.data?.message || "Something went wrong.",
              });
            } finally {
              setSubmitting(false);
              resetForm();
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="mt-4">
              <FieldWrapper>
                <InputField
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </FieldWrapper>

              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="mt-4 w-full"
              >
                Send Reset Link
              </Button>

              <div className="mt-4 text-center">
                <Link
                  to="/auth/login"
                  className="text-blue-500 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </FormLayout>
  );
};

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  return (
    <FormLayout>
      <div>
        <h2 className="text-2xl font-semibold text-gray-700">Reset Password</h2>
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={Yup.object({
            password: Yup.string()
              .min(6, "Must be at least 6 characters")
              .required("Required"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password")], "Passwords must match")
              .required("Required"),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            try {
              await resetPassword({ password: values.password }, token);
              notification.success({
                message: "Password changed successfully!",
                description: "You can now log in with your new password.",
              });
              navigate("/auth/login");
            } catch (err) {
              notification.error({
                message: "Error",
                description:
                  err.response?.data?.message || "Something went wrong.",
              });
            } finally {
              setSubmitting(false);
              resetForm();
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="mt-4">
              <FieldWrapper>
                <InputField
                  type="password"
                  name="password"
                  placeholder="Enter new Password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </FieldWrapper>
              <FieldWrapper>
                <InputField
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </FieldWrapper>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="mt-4 w-full"
              >
                Reset Password
              </Button>

              <div className="mt-4 text-center">
                <Link
                  to="/auth/login"
                  className="text-blue-500 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </FormLayout>
  );
};

const InputField = (props) => (
  <Field {...props} className="w-full p-2 mt-2 border rounded-lg" />
);
const FieldWrapper = ({ children }) => <div className="h-16">{children}</div>;

export { ResetPassword, ForgotPassword };
