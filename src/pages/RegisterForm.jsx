import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, notification, Radio } from "antd";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import registerUser from "../services/userRegistration";

const registerValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  role: Yup.string()
    .oneOf(["Resident", "Staff"], "Invalid role")
    .required("Role is required"),
});

const RegisterForm = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700">Register</h2>
      <Formik
        className=" text-start"
        initialValues={{
          name: "",
          email: "",
          phone: "",
          role: "",
        }}
        validationSchema={registerValidationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            const userData = { ...values };
            await registerUser(userData);

            notification.success({
              message: "Registration Successful",
              description: "User has been added successfully.",
            });

            resetForm();
          } catch (err) {
            const errorMessage =
              err.response?.data?.message || "Something went wrong.";
            notification.error({
              message: "Registration Failed",
              description: errorMessage,
            });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="mt-4 text-left">
            <FieldWrapper>
              <InputField
                type="text"
                name="name"
                placeholder="Enter your name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </FieldWrapper>

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
                type="text"
                name="phone"
                placeholder="Enter your phone number"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 text-sm"
              />
            </FieldWrapper>

            <FieldWrapper>
              <Radio.Group
                className="mt-2"
                onChange={(e) => setFieldValue("role", e.target.value)}
                value={values.role}
              >
                <Radio value="Resident">Resident</Radio>
                <Radio value="Staff">Staff</Radio>
              </Radio.Group>
              <ErrorMessage
                name="role"
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
              Register
            </Button>
          </Form>
        )}
      </Formik>

      <div className="flex justify-between">
        <Link
          to="/auth/forgot-password"
          className="mt-4 text-blue-500 hover:underline block"
        >
          Forgot password
        </Link>

        <Link
          to="/auth/login"
          className="mt-4 text-blue-500 hover:underline block"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

const InputField = (props) => (
  <Field {...props} className="w-full p-2 mt-2 border rounded-lg" />
);
const FieldWrapper = ({ children }) => <div className="h-16">{children}</div>;

export default RegisterForm;
