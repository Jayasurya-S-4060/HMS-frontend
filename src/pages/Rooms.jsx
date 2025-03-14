import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Card,
  Modal,
  message,
  Input,
  InputNumber,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, HistoryOutlined } from "@ant-design/icons";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import getRooms from "../services/getRooms";
import createRoom from "../services/createRoom";
import editRoom from "../services/editRoom";
import deleteRoom from "../services/deleteRoom";
import RoomHistory from "./RoomHistory";

const { Title } = Typography;
const { Option } = Select;

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewHistory, setViewHistory] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await getRooms();
      setRooms(response);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setModalVisible(true);
  };

  const handleDeleteRoom = async (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this room?",
      content: `Room No: ${record.roomNumber}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteRoom(record._id);
          message.success("Room deleted successfully!");
          fetchRooms();
        } catch (error) {
          message.error("Failed to delete room.");
        }
      },
    });
  };

  const handleView = (record) => {
    navigate(`/app/room/${record._id}`, { state: { room: record } });
  };

  const toggleView = () => setViewHistory(!viewHistory);

  const validationSchema = Yup.object({
    roomNumber: Yup.string().required("Room Number is required"),
    floor: Yup.number().required("Floor is required"),
    type: Yup.string().required("Type is required"),
    capacity: Yup.number().required("Capacity is required"),
  });

  const initialValues = editingRoom
    ? { ...editingRoom }
    : {
        roomNumber: "",
        floor: "",
        type: "",
        capacity: "",
        status: "Available",
      };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (editingRoom) {
        await editRoom(editingRoom._id, values);
        message.success("Room updated successfully!");
      } else {
        await createRoom({ ...values, status: "Available" });
        message.success("Room created successfully!");
      }
      fetchRooms();
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error("Error saving room:", error);
      message.error("Failed to save room.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Room No.",
      dataIndex: "roomNumber",
      key: "roomNumber",
      render: (text) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      render: (capacity) => <Tag color="orange">{capacity}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Occupied" ? "red" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleView(record)}>
            View
          </Button>
          {record.status === "Available" && (
            <>
              {/* <Button
                icon={<EditOutlined />}
                size="small"
                style={{
                  background: "#1890ff",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => handleEditRoom(record)}
              >
                Edit
              </Button> */}
              <Button
                type="link"
                size="small"
                danger
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => handleDeleteRoom(record)}
              >
                Delete
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  if (viewHistory) return <RoomHistory toggleView={toggleView} />;

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!m-0">
          Room Management
        </Title>
        <div className="space-x-3">
          <Button icon={<HistoryOutlined />} onClick={toggleView}>
            Room History
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRoom}
          >
            Add Room
          </Button>
        </div>
      </div>

      <Table
        dataSource={rooms}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 8 }}
      />

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        title={editingRoom ? "Edit Room" : "Add Room"}
        destroyOnClose
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            setFieldValue,
            errors,
            touched,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Room Number</label>
                <Input
                  name="roomNumber"
                  value={values.roomNumber}
                  onChange={handleChange}
                  placeholder="Enter Room Number"
                />
                {errors.roomNumber && touched.roomNumber && (
                  <div className="text-red-500 text-xs">
                    {errors.roomNumber}
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1">Floor</label>
                <InputNumber
                  name="floor"
                  value={values.floor}
                  onChange={(val) => setFieldValue("floor", val)}
                  placeholder="Enter Floor"
                  style={{ width: "100%" }}
                />
                {errors.floor && touched.floor && (
                  <div className="text-red-500 text-xs">{errors.floor}</div>
                )}
              </div>

              <div>
                <label className="block mb-1">Type</label>
                <Select
                  value={values.type}
                  onChange={(val) => setFieldValue("type", val)}
                  placeholder="Select Room Type"
                  style={{ width: "100%" }}
                >
                  <Option value="single">Single</Option>
                  <Option value="double">Double</Option>
                  <Option value="shared">Shared</Option>
                </Select>
                {errors.type && touched.type && (
                  <div className="text-red-500 text-xs">{errors.type}</div>
                )}
              </div>

              <div>
                <label className="block mb-1">Capacity</label>
                <InputNumber
                  name="capacity"
                  value={values.capacity}
                  onChange={(val) => setFieldValue("capacity", val)}
                  placeholder="Enter Capacity"
                  style={{ width: "100%" }}
                />
                {errors.capacity && touched.capacity && (
                  <div className="text-red-500 text-xs">{errors.capacity}</div>
                )}
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isSubmitting}
              >
                {editingRoom ? "Update Room" : "Add Room"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </Card>
  );
};

export default Rooms;
