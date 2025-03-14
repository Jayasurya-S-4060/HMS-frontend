import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spin,
  Empty,
  message,
  Tag,
  Modal,
  Input,
  Form,
} from "antd";
import {
  ClockCircleOutlined,
  HomeOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import getRoomHistory from "../services/getRoomHistory";
import { createPaymentIntent } from "../services/handlePayment";

const RoomHistory = ({ toggleView }) => {
  const [roomHistory, setRoomHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form] = Form.useForm();
  const [costItems, setCostItems] = useState([{ name: "", amount: 0 }]);

  useEffect(() => {
    const fetchRoomHistory = async () => {
      try {
        setLoading(true);
        const response = await getRoomHistory();
        if (Array.isArray(response)) {
          setRoomHistory(response);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching room history:", error);
        message.error("Failed to load room history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomHistory();
  }, []);

  const handleAddCostItem = () => {
    setCostItems([...costItems, { name: "", amount: 0 }]);
  };

  const handleRemoveCostItem = (index) => {
    const updatedItems = [...costItems];
    updatedItems.splice(index, 1);
    setCostItems(updatedItems);
  };

  const handleChangeCostItem = (index, field, value) => {
    const updatedItems = [...costItems];
    updatedItems[index][field] = field === "amount" ? Number(value) : value;
    setCostItems(updatedItems);
  };

  const handlePaymentSubmit = async (values) => {
    try {
      if (
        costItems.length === 0 ||
        costItems.some((item) => !item.name || item.amount <= 0)
      ) {
        return message.error("Please add valid cost items.");
      }

      const payload = {
        costItems,
        currency: values.currency,
        roomHistoryId: selectedRoom._id,
      };

      const response = await createPaymentIntent(payload);
      message.success("Payment successfully created!");
      setIsModalVisible(false);

      const updatedRoomHistory = await getRoomHistory();
      setRoomHistory(updatedRoomHistory);
    } catch (error) {
      console.error("Error creating payment:", error);
      message.error("Failed to create payment.");
    }
  };

  return (
    <>
      <Button type="default" onClick={toggleView} style={{ marginBottom: 16 }}>
        Show Rooms
      </Button>

      {loading ? (
        <Spin size="large" />
      ) : roomHistory.length === 0 ? (
        <Empty description="No room history available" />
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {roomHistory.map((room, index) => {
            const isOccupied = !room.checkOutTime;
            return (
              <Card
                key={room._id}
                title={
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    <HomeOutlined /> Room {room.roomNumber}
                  </span>
                }
                bordered={false}
                style={{
                  borderRadius: 8,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                  borderLeft: isOccupied
                    ? "5px solid #ff4d4f"
                    : "5px solid #1890ff",
                }}
              >
                <p>
                  <UserOutlined /> <strong>Resident:</strong>{" "}
                  {room.residentName}
                </p>
                <p>
                  <ClockCircleOutlined style={{ color: "#52c41a" }} />{" "}
                  <strong>Check-in:</strong>{" "}
                  <span style={{ color: "#52c41a", fontWeight: "bold" }}>
                    {dayjs(room.checkInTime).format("DD/MM/YYYY h:mm A")}
                  </span>
                </p>
                <p>
                  <ClockCircleOutlined
                    style={{ color: isOccupied ? "#ff4d4f" : "#1890ff" }}
                  />{" "}
                  <strong>Check-out:</strong>{" "}
                  {room.checkOutTime ? (
                    <span style={{ color: "#1890ff", fontWeight: "bold" }}>
                      {dayjs(room.checkOutTime).format("DD/MM/YYYY h:mm A")}
                    </span>
                  ) : (
                    <Tag color="red">Still Occupied</Tag>
                  )}
                </p>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        title="Generate Payment"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handlePaymentSubmit}>
          {costItems.map((item, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
            >
              <Input
                placeholder="Cost Description"
                value={item.name}
                onChange={(e) =>
                  handleChangeCostItem(index, "name", e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Amount"
                value={item.amount}
                onChange={(e) =>
                  handleChangeCostItem(index, "amount", e.target.value)
                }
              />
              <Button type="danger" onClick={() => handleRemoveCostItem(index)}>
                -
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={handleAddCostItem} block>
            <PlusOutlined /> Add Another Cost
          </Button>

          <Form.Item label="Currency" name="currency" initialValue="usd">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Payment
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RoomHistory;
