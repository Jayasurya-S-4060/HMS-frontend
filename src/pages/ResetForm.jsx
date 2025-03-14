import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, notification } from "antd";
import * as Yup from "yup";
import { Link, useNavigate, useLocation } from "react-router-dom";

import resetPasswordRequest from "../services/resetPasswordRequest";
import resetPassword from "../services/resetPassword";

const ForgotPassword = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700">Forgot Password</h2>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={Yup.object({
          email: Yup.string().email("Invalid email").required("Required"),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            await resetPasswordRequest(values).then(() => {
              navigate("/");
              notification
                .success({
                  message: "verification link sent to the given email",
                  description: "Verify to reset password",
                })
                .catch((err) => {
                  notification.error({
                    message: err.message,
                  });
                });
            });
          } catch (err) {
            console.log(err);
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
              Reset Password
            </Button>
          </Form>
        )}
      </Formik>
      {/* <Link
        to="/auth/register"
        className="mt-4 text-blue-500 hover:underline block"
      >
        Back to Register
      </Link> */}
    </div>
  );
};

const ResetPassword = () => {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");
  const navigate = useNavigate();

  return (
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
            .min(6, "Must be at least 6 characters")
            .required("Required"),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            await resetPassword({ password: values.password }, token);
            notification.success({
              message: "Successful changed password",
              description: "please login",
            });

            navigate("/");
          } catch (err) {
            notification.error({
              message: err.message,
              description: "try again later",
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
          </Form>
        )}
      </Formik>
    </div>
  );
};

const InputField = (props) => (
  <Field {...props} className="w-full p-2 mt-2 border rounded-lg" />
);
const FieldWrapper = ({ children }) => <div className="h-16">{children}</div>;

export { ResetPassword, ForgotPassword };
