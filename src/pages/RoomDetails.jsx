import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Card,
  Tag,
  Descriptions,
  Spin,
  Button,
  Modal,
  Select,
  DatePicker,
  Form,
  message,
  Tooltip,
} from "antd";
import { Formik, Field, Form as FormikForm } from "formik";
import getRoomById from "../services/getRoomById";
import getUsers from "../services/getUsers";
import editRoom from "../services/editRoom";

const { Option } = Select;

const RoomDetails = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(state?.room || null);
  const [loading, setLoading] = useState(!state?.room);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    if (!room) fetchRoom();
    fetchResidents();
  }, []);

  const fetchRoom = async () => {
    try {
      const response = await getRoomById(id);
      setRoom(response);
    } catch (error) {
      console.error("Error fetching room:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await getUsers("?type=Resident");
      if (!response.error) {
        setResidents(response);
      }
    } catch (error) {
      console.error("Error fetching residents:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = (resetForm) => {
    setIsModalOpen(false);
    resetForm && resetForm();
  };

  const handleRoomUpdate = async (values, { resetForm }) => {
    event.preventDefault();

    let updatedRoomData = {};

    if (room.status === "Under Maintenance") {
      updatedRoomData = {
        status: values.status,
        currentOccupant: { residentId: null, residentName: null },
        checkInTime: null,
        checkOutTime: null,
      };
    } else if (room.status === "Available") {
      updatedRoomData = {
        status: "Occupied",
        currentOccupant: {
          residentId: values.residentId,
          residentName: values.residentName,
        },
        checkInTime: values.dateTime,
        checkOutTime: null,
      };
    } else if (room.status === "Occupied") {
      updatedRoomData = {
        status: "Available",
        currentOccupant: { residentId: null, residentName: null },
        checkInTime: room.checkInTime,
        checkOutTime: values.dateTime,
      };
    }

    try {
      const response = await editRoom(id, updatedRoomData);
      fetchRoom();
      if (response.error) {
        message.error("Failed to update room.");
      } else {
        message.success("Room status updated successfully.");
        setRoom(response);
        closeModal(resetForm);
      }
    } catch (error) {
      console.error("Error updating room:", error);
      message.error("An error occurred while updating the room.");
    }
  };

  if (loading) return <Spin size="large" />;
  if (!room) return <p>Room not found</p>;

  return (
    <>
      <Button
        onClick={() => navigate("/app/rooms")}
        style={{ marginBottom: 20 }}
      >
        Back to Rooms
      </Button>

      <Card title={`Room ${room.roomNumber}`} bordered={false}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Room Type">{room.type}</Descriptions.Item>

          <Descriptions.Item label="Occupant">
            {room.currentOccupant?.residentName
              ? `${room.currentOccupant.residentName} (ID: ${room.currentOccupant.residentId})`
              : "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag
              color={
                room.status === "Occupied"
                  ? "green"
                  : room.status === "Under Maintenance"
                  ? "orange"
                  : "blue"
              }
            >
              {room.status}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Rent">{room.rent}</Descriptions.Item>

          <Descriptions.Item label="Check-in Time">
            {room.currentOccupant?.checkInTime
              ? dayjs(room.currentOccupant.checkInTime).format(
                  "DD-MM-YYYY HH:mm"
                )
              : "Not checked in"}
          </Descriptions.Item>

          <Descriptions.Item label="Check-out Time">
            {room.currentOccupant?.checkOutTime
              ? dayjs(room.currentOccupant.checkOutTime).format(
                  "DD-MM-YYYY HH:mm"
                )
              : "Not checked out"}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 20 }}>
          <Tooltip title="Update room status">
            <Button type="primary" onClick={openModal}>
              {room.status === "Occupied"
                ? "Check-out"
                : room.status === "Under Maintenance"
                ? "Update Status"
                : "Check-in"}
            </Button>
          </Tooltip>
        </div>
      </Card>

      <Modal
        title={
          room.status === "Under Maintenance"
            ? "Update Room Status"
            : `${room.checkInTime ? "Check-out" : "Check-in"} Room`
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Formik
          initialValues={{
            residentId: room.currentOccupant?.residentId || "",
            residentName: room.currentOccupant?.residentName || "",
            dateTime: null,
            status: room.status,
          }}
          onSubmit={handleRoomUpdate}
        >
          {({ setFieldValue, resetForm, values }) => (
            <FormikForm>
              <Form layout="vertical">
                {room.status === "Available" && (
                  <Form.Item label="Resident">
                    <Field name="residentId">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select resident"
                          onChange={(value, option) => {
                            setFieldValue("residentId", option.key);
                            setFieldValue("residentName", option.children);
                          }}
                        >
                          {residents.map((resident) => (
                            <Option key={resident._id} value={resident._id}>
                              {resident.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                  </Form.Item>
                )}

                <Form.Item label="Date & Time">
                  <Field name="dateTime">
                    {({ field }) => (
                      <DatePicker
                        {...field}
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        style={{ width: "100%" }}
                        onChange={(value) => setFieldValue("dateTime", value)}
                      />
                    )}
                  </Field>
                </Form.Item>

                {room.status === "Under Maintenance" && (
                  <Form.Item label="Room Status">
                    <Field name="status">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select status"
                          onChange={(value) => setFieldValue("status", value)}
                        >
                          <Option value="Available">Available</Option>
                          <Option value="Under Maintenance">
                            Under Maintenance
                          </Option>
                        </Select>
                      )}
                    </Field>
                  </Form.Item>
                )}

                <Form.Item>
                  <Button
                    type="primary"
                    onClick={() => handleRoomUpdate(values, { resetForm })}
                  >
                    {room.status === "Occupied"
                      ? "Check-out"
                      : room.status === "Under Maintenance"
                      ? "Update Status"
                      : "Check-in"}
                  </Button>
                  <Button
                    style={{ marginLeft: 10 }}
                    onClick={() => closeModal(resetForm)}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default RoomDetails;
