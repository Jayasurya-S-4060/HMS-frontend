import { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Typography, Collapse, Tag, Button, Modal, Select } from "antd";
import getMaintenanceRequest from "../services/getRequest";
import editMaintenanceRequest from "../services/editMaintenanceRequest";
import getUsers from "../services/getUsers";

const { Title } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const statusColors = {
  Pending: "red",
  Assigned: "orange",
  "In Progress": "blue",
  Completed: "green",
};

const MaintenanceRequests = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getMaintenanceRequest("");
        setMaintenanceRequests(response);
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const resp = await getUsers("?type=Staff");
        setStaffList(resp);
      } catch (err) {
        console.error("Error while fetching staff", err.message);
      }
    };
    fetchStaff();
  }, []);

  const handleAssign = (request) => {
    setSelectedRequest(request);
    setIsModalVisible(true);
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <Card style={{ maxWidth: "100%", padding: 20 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
          Maintenance Requests
        </Title>
        {maintenanceRequests.length > 0 ? (
          <Collapse accordion>
            {maintenanceRequests.map((request) => (
              <Panel
                header={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      Room No: <Tag>{request.roomId.roomNumber}</Tag> | Date:{" "}
                      <Tag>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </Tag>{" "}
                      | Category: <Tag>{request.category}</Tag> | Status:{" "}
                      <Tag color={statusColors[request.status]}>
                        {request.status}
                      </Tag>
                      {request.assignedStaff && (
                        <>
                          {" "}
                          | Assigned to:{" "}
                          <Tag color="#108ee9">
                            {request.assignedStaff.name}
                          </Tag>
                        </>
                      )}
                    </span>
                    {request.status !== "Completed" && (
                      <Button
                        type="primary"
                        onClick={() => handleAssign(request)}
                      >
                        Assign
                      </Button>
                    )}
                  </div>
                }
                key={request._id}
              >
                <p>
                  <strong>Description:</strong> {request.description}
                </p>
              </Panel>
            ))}
          </Collapse>
        ) : (
          <p>No pending maintenance requests.</p>
        )}
      </Card>

      <Modal
        title="Assign Staff"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedRequest && (
          <Formik
            initialValues={{
              assignedStaff: "",
              status: "Assigned",
            }}
            validationSchema={Yup.object({
              assignedStaff: Yup.string().required("Staff is required"),
              status: Yup.string().required("Status is required"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await editMaintenanceRequest(selectedRequest._id, {
                  assignedStaff: values.assignedStaff,
                  status: values.status,
                });

                setMaintenanceRequests((prev) =>
                  prev.map((req) =>
                    req._id === selectedRequest._id
                      ? {
                          ...req,
                          status: values.status,
                          assignedTo: values.assignedStaff,
                        }
                      : req
                  )
                );

                setIsModalVisible(false);
              } catch (error) {
                console.error("Error updating maintenance request:", error);
              }
              setSubmitting(false);
            }}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form>
                <div style={{ marginBottom: "10px" }}>
                  <label>Assign to Staff</label>
                  <Select
                    style={{ width: "100%" }}
                    onChange={(value) => setFieldValue("assignedStaff", value)}
                    placeholder="Select staff"
                  >
                    {staffList.map((staff) => (
                      <Option key={staff._id} value={staff._id}>
                        {staff.name}
                      </Option>
                    ))}
                  </Select>
                  <ErrorMessage
                    name="assignedStaff"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label>Status</label>
                  <Select
                    style={{ width: "100%" }}
                    onChange={(value) => setFieldValue("status", value)}
                    defaultValue="Assigned"
                  >
                    <Option value="Assigned">Assigned</Option>
                    <Option value="In Progress">In Progress</Option>
                    <Option value="Completed">Completed</Option>
                  </Select>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  style={{ width: "100%" }}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Modal>
    </div>
  );
};

export default MaintenanceRequests;
