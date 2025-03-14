import { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Typography,
  Collapse,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Empty,
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import createMaintenance from "../services/createMaintenance";
import getMaintenanceRequest from "../services/getRequest";
import updateMaintenanceStatus from "../services/editMaintenanceRequest";
import { useAuth } from "../context/AuthContext";

const { Title } = Typography;
const { Panel } = Collapse;

const MaintenanceRequestSchema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
  category: Yup.string()
    .oneOf(["Plumbing", "Electrical", "Other"], "Invalid category")
    .required("Category is required"),
  urgency: Yup.string()
    .oneOf(["Low", "Medium", "High"], "Invalid urgency level")
    .required("Urgency is required"),
});

const MyProfile = () => {
  const { user } = useAuth();
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    let query =
      user?.role === "Resident"
        ? `?residentId=${user._id}`
        : user?.role === "Staff"
        ? `?assignedStaff=${user._id}`
        : "";
    try {
      const response = await getMaintenanceRequest(query);
      setMaintenanceRequests(response);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    }
  };

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const formik = useFormik({
    initialValues: {
      roomId: user?.roomId,
      residentId: user?._id,
      description: "",
      category: "Plumbing",
      urgency: "Low",
    },
    validationSchema: MaintenanceRequestSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createMaintenance(values);
        message.success("Request created successfully!");
        setModalVisible(false);
        resetForm();
        fetchRequests();
      } catch (error) {
        console.error("Error creating maintenance request:", error);
        message.error("Failed to create request");
      }
    },
  });

  const updateFormik = useFormik({
    initialValues: {
      status: "In Progress",
      staffComment: "",
    },
    onSubmit: async (values) => {
      try {
        if (selectedRequest) {
          await updateMaintenanceStatus(selectedRequest._id, values);
          message.success("Request updated successfully!");
          setUpdateModalVisible(false);
          fetchRequests();
        }
      } catch (error) {
        console.error("Error updating maintenance request:", error);
        message.error("Failed to update request");
      }
    },
  });

  return (
    <div className="p-4 space-y-6">
      <Card className="shadow-md rounded-lg" bordered={false}>
        <Title level={3} className="text-center">
          My Profile
        </Title>
        {user ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
            {user.role === "Resident" && (
              <Descriptions.Item label="Assigned Room">
                {user.roomId ? user.roomId.roomNumber : "Not Assigned"}
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : (
          <Empty description="No user data available." />
        )}
      </Card>

      <Card className="shadow-md rounded-lg" bordered={false}>
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="m-0">
            Maintenance Requests
          </Title>
          {user?.role === "Resident" && (
            <Button type="primary" onClick={() => setModalVisible(true)}>
              New Request
            </Button>
          )}
        </div>

        {maintenanceRequests.length > 0 ? (
          <Collapse accordion>
            {maintenanceRequests.map((request) => (
              <Panel
                header={
                  <div className="flex justify-between w-full items-center">
                    <span>
                      {request.category} —{" "}
                      {new Date(request.createdAt).toLocaleDateString()}
                      <Tag
                        color={
                          request.urgency === "High"
                            ? "red"
                            : request.urgency === "Medium"
                            ? "orange"
                            : "green"
                        }
                        className="ml-2"
                      >
                        {request.urgency}
                      </Tag>
                      <Tag
                        color={
                          request.status === "In Progress" ? "orange" : "green"
                        }
                        className="ml-2"
                      >
                        {request.status}
                      </Tag>
                    </span>
                    {user?.role === "Staff" &&
                      request.status !== "Completed" && (
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => {
                            setSelectedRequest(request);
                            setUpdateModalVisible(true);
                          }}
                        >
                          Update
                        </Button>
                      )}
                  </div>
                }
                key={request._id}
              >
                <p>
                  <strong>Description:</strong> {request.description}
                </p>
                {request.staffComment && (
                  <p>
                    <strong>Staff Comment:</strong> {request.staffComment}
                  </p>
                )}
              </Panel>
            ))}
          </Collapse>
        ) : (
          <Empty description="No maintenance requests found." />
        )}
      </Card>

      <Modal
        title="New Maintenance Request"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={formik.handleSubmit}
        okText="Submit"
      >
        <Form layout="vertical">
          <Form.Item
            label="Description"
            validateStatus={formik.errors.description && "error"}
            help={formik.errors.description}
          >
            <Input.TextArea
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
            />
          </Form.Item>
          <Form.Item label="Category">
            <Select
              name="category"
              value={formik.values.category}
              onChange={(val) => formik.setFieldValue("category", val)}
            >
              <Select.Option value="Plumbing">Plumbing</Select.Option>
              <Select.Option value="Electrical">Electrical</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Urgency">
            <Select
              name="urgency"
              value={formik.values.urgency}
              onChange={(val) => formik.setFieldValue("urgency", val)}
            >
              <Select.Option value="Low">Low</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="High">High</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update Maintenance Request"
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        onOk={updateFormik.handleSubmit}
        okText="Update"
      >
        <Form layout="vertical">
          <Form.Item label="Status">
            <Select
              name="status"
              value={updateFormik.values.status}
              onChange={(val) => updateFormik.setFieldValue("status", val)}
            >
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Staff Comment">
            <Input.TextArea
              name="staffComment"
              onChange={updateFormik.handleChange}
              value={updateFormik.values.staffComment}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyProfile;
