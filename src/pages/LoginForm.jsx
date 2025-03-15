import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, notification } from "antd";
import { useState } from "react";
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
  const [isQuickLogging, setIsQuickLogging] = useState(false);

  const quickLogins = [
    { role: "Admin", email: "sjjjsurya@gmail.com", password: "5e47e187ac92" },
    { role: "Resident", email: "Raja@gmail.com", password: "5e47e187ac92" },
    {
      role: "Staff",
      email: "vipersojo@gmail.com",
      password: "5e47e187ac92",
    },
  ];

  const handleQuickLogin = async (email, password) => {
    setIsQuickLogging(true);
    try {
      await login({ email, password });
      notification.success({
        message: "Login Successful",
        description: `Logged in as ${email}`,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong.";
      notification.error({
        message: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setIsQuickLogging(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700">Login</h2>

      <div className="flex space-x-2 mb-4">
        {quickLogins.map((item) => (
          <button
            key={item.role}
            onClick={() => handleQuickLogin(item.email, item.password)}
            className="px-3 py-1 border rounded-full bg-gray-200 hover:bg-gray-300 transition"
            disabled={isQuickLogging}
          >
            {item.role}
          </button>
        ))}
      </div>

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
    </div>
  );
};

const InputField = (props) => (
  <Field {...props} className="w-full p-2 mt-2 border rounded-lg" />
);

const FieldWrapper = ({ children }) => <div className="h-16">{children}</div>;

export default LoginForm;
