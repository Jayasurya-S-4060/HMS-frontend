import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, notification } from "antd";

import { Link } from "react-router-dom";
import * as Yup from "yup";

import { useAuth } from "../context/AuthContext";

const loginValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

const LoginForm = () => {
  const { login } = useAuth();
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700">Login</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginValidationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            await login(values);
          } catch (err) {
            const errorMessage =
              err.response?.data?.message || "Something went wrong.";
            notification.error({
              message: "Login Failed",
              description: errorMessage,
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

            <FieldWrapper>
              <InputField
                type="password"
                name="password"
                placeholder="Enter your password"
              />
              <ErrorMessage
                name="password"
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
              Login
            </Button>
          </Form>
        )}
      </Formik>
      {/* 
      <Link
        to="/auth/forgot-password"
        className="mt-2 text-blue-500 hover:underline block"
      >
        {" "}
        Forgot Password?
      </Link> */}
    </div>
  );
};

const InputField = (props) => (
  <Field {...props} className="w-full p-2 mt-2 border rounded-lg" />
);
const FieldWrapper = ({ children }) => <div className="h-16">{children}</div>;

export default LoginForm;
