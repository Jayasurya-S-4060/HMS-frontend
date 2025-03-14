import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Tag,
  Descriptions,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message as AntMessage,
} from "antd";
import { Formik, Field, Form as FormikForm } from "formik";
import * as Yup from "yup";
import getUserById from "../services/getUserById";
import editUserById from "../services/editUserById";

const { Option } = Select;

const UserDetails = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!state?.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  const fetchUser = async () => {
    try {
      const response = await getUserById(id);
      setUser(response);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const openModal = (type) => {
    setActionType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      let payload = { ...values };
      if (actionType === "Activate" || actionType === "Deactivate") {
        payload.status = actionType === "Activate" ? "Active" : "Inactive";
      }

      const res = await editUserById(id, payload);
      if (res.error) throw new Error(res.error);

      AntMessage.success(`User ${actionType.toLowerCase()}d successfully!`);
      closeModal();
      resetForm();
      fetchUser();
    } catch (error) {
      console.error("Error updating user:", error);
      AntMessage.error("Failed to update user.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  if (!user) return <p className="text-center text-red-600">User not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
      <Card
        title={
          <span className="text-xl font-semibold capitalize">{user.name}</span>
        }
        bordered={false}
        className="shadow-md rounded-xl"
        extra={
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/app/users")}
              className="font-semibold"
            >
              Back to Users
            </Button>
            <Button
              type="link"
              onClick={() => openModal("Edit")}
              className="font-semibold"
            >
              Edit
            </Button>
          </div>
        }
      >
        <Descriptions bordered column={1} labelStyle={{ fontWeight: "600" }}>
          <Descriptions.Item label="Email">
            <span className="text-blue-600">{user.email}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {user.phone || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag
              color={
                user.role === "Admin"
                  ? "red"
                  : user.role === "Staff"
                  ? "green"
                  : user.role === "Resident"
                  ? "blue"
                  : "gray"
              }
              className="text-base px-3 py-1 rounded-lg"
            >
              {user.role}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Room Assigned">
            {user?.roomId?.roomNumber || "No room assigned"}
          </Descriptions.Item>
          {user.status && (
            <Descriptions.Item label="Status">
              <Tag
                color={user.status === "Active" ? "green" : "volcano"}
                className="text-base px-3 py-1 rounded-lg"
              >
                {user.status}
              </Tag>
            </Descriptions.Item>
          )}
        </Descriptions>

        {user.status && (
          <div className="mt-6 flex justify-end gap-4">
            {user.status === "Inactive" && (
              <Button
                type="primary"
                onClick={() => openModal("Activate")}
                className="font-semibold"
              >
                Activate
              </Button>
            )}
            {user.status === "Active" && (
              <Button
                danger
                onClick={() => openModal("Deactivate")}
                className="font-semibold"
              >
                Deactivate
              </Button>
            )}
          </div>
        )}
      </Card>

      <Modal
        title={`${
          actionType.charAt(0).toUpperCase() + actionType.slice(1)
        } User`}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Formik
          enableReinitialize
          initialValues={
            actionType === "Edit"
              ? { name: user.name, email: user.email, phone: user.phone || "" }
              : { reason: "" }
          }
          validationSchema={
            actionType === "Edit"
              ? Yup.object({
                  name: Yup.string().required("Name is required"),
                  email: Yup.string()
                    .email("Invalid email")
                    .required("Email is required"),
                  phone: Yup.string(),
                })
              : Yup.object({
                  reason: Yup.string().required("Reason is required"),
                })
          }
          onSubmit={handleFormSubmit}
        >
          {({ errors, touched, setFieldValue }) => (
            <FormikForm>
              {actionType === "Edit" ? (
                <>
                  <Form.Item
                    label="Name"
                    validateStatus={errors.name && touched.name ? "error" : ""}
                    help={errors.name && touched.name ? errors.name : null}
                  >
                    <Field name="name" as={Input} placeholder="Name" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    validateStatus={
                      errors.email && touched.email ? "error" : ""
                    }
                    help={errors.email && touched.email ? errors.email : null}
                  >
                    <Field name="email" as={Input} placeholder="Email" />
                  </Form.Item>
                  <Form.Item label="Phone">
                    <Field
                      name="phone"
                      as={Input}
                      placeholder="Phone (Optional)"
                    />
                  </Form.Item>
                </>
              ) : (
                <Form.Item
                  label="Reason"
                  validateStatus={
                    errors.reason && touched.reason ? "error" : ""
                  }
                  help={errors.reason && touched.reason ? errors.reason : null}
                >
                  <Field name="reason">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select reason"
                        onChange={(value) => setFieldValue("reason", value)}
                      >
                        <Option value="Policy Violation">
                          Policy Violation
                        </Option>
                        <Option value="User Request">User Request</Option>
                        <Option value="Other">Other</Option>
                      </Select>
                    )}
                  </Field>
                </Form.Item>
              )}

              <Button
                type="primary"
                htmlType="submit"
                block
                className="font-semibold mt-4"
              >
                {actionType === "Edit" ? "Save Changes" : actionType}
              </Button>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default UserDetails;
