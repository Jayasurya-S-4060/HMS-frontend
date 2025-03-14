import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Select,
  Input,
  Button,
  message as AntMessage,
  Empty,
  Avatar,
  Divider,
} from "antd";
import { BellOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  sendNotification,
  getNotifications,
} from "../services/notificationService";
import { useAuth } from "../context/AuthContext";

const { Option } = Select;

const AdminNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const adminId = user._id;
  const adminRole = "Admin";

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications(adminId, adminRole);
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const validationSchema = Yup.object().shape({
    recipientType: Yup.string().required("Recipient type is required"),
    recipientId: Yup.string().when("recipientType", {
      is: "User",
      then: Yup.string().required("User ID is required"),
    }),
    message: Yup.string().required("Message is required"),
  });

  const handleSendNotification = async (values, { resetForm }) => {
    try {
      const payload = {
        senderId: adminId,
        recipientRole:
          values.recipientType !== "User" ? values.recipientType : undefined,
        recipientId:
          values.recipientType === "User" ? values.recipientId : undefined,
        message: values.message,
      };
      await sendNotification(payload);
      AntMessage.success("Notification sent successfully!");
      resetForm();
      fetchNotifications();
    } catch (error) {
      console.error("Error sending notification:", error);
      AntMessage.error("Failed to send notification.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg space-y-8">
      <h2 className="text-3xl font-bold text-center">📢 Admin Notifications</h2>

      <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
        <Formik
          initialValues={{
            recipientType: "Staff",
            recipientId: "",
            message: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSendNotification}
        >
          {({ values, handleChange, errors, touched }) => (
            <Form className="space-y-5">
              <div>
                <label className="font-semibold block mb-2">
                  Recipient Type
                </label>
                <Select
                  name="recipientType"
                  value={values.recipientType}
                  onChange={(value) =>
                    handleChange({ target: { name: "recipientType", value } })
                  }
                  className="w-full"
                >
                  <Option value="Staff">All Staff</Option>
                  <Option value="Resident">All Residents</Option>
                  {/* <Option value="User">Specific User</Option> */}
                </Select>
                {errors.recipientType && touched.recipientType && (
                  <div className="text-red-500">{errors.recipientType}</div>
                )}
              </div>

              {values.recipientType === "User" && (
                <div>
                  <label className="font-semibold block mb-2">User ID</label>
                  <Input
                    name="recipientId"
                    placeholder="Enter User ID"
                    value={values.recipientId}
                    onChange={handleChange}
                  />
                  {errors.recipientId && touched.recipientId && (
                    <div className="text-red-500">{errors.recipientId}</div>
                  )}
                </div>
              )}

              <div>
                <label className="font-semibold block mb-2">Message</label>
                <Field
                  as={Input.TextArea}
                  name="message"
                  placeholder="Enter notification message"
                  rows={4}
                />
                {errors.message && touched.message && (
                  <div className="text-red-500">{errors.message}</div>
                )}
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                className="rounded-lg text-lg h-12"
              >
                Send Notification
              </Button>
            </Form>
          )}
        </Formik>
      </div>

      <Divider orientation="center">
        <span className="text-lg font-semibold">Sent Notifications</span>
      </Divider>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {notifications.length === 0 ? (
          <Empty description="No notifications sent yet." />
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className="p-4 bg-gray-50 rounded-xl shadow-sm flex items-start gap-4 border"
            >
              <Avatar
                size="large"
                icon={<BellOutlined />}
                className="bg-blue-500"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-semibold text-gray-800">{notif.message}</p>
                  <span className="text-xs text-gray-500">
                    {dayjs(notif.createdAt).format("DD MMM, YYYY - hh:mm A")}
                  </span>
                </div>
                {notif.recipientRole && (
                  <p className="text-sm text-gray-600 mt-1">
                    To:{" "}
                    {notif.recipientRole === "Staff"
                      ? "All Staff"
                      : notif.recipientRole === "Resident"
                      ? "All Residents"
                      : `User ID: ${notif.recipientId}`}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
