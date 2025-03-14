import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Spin,
  Empty,
  message,
  Tag,
  Modal,
  Input,
  Form,
  Row,
  Col,
  Card,
  Typography,
} from "antd";
import {
  DollarCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import getRoomHistory from "../services/getRoomHistory";
import { createPaymentIntent } from "../services/handlePayment";
const { Title } = Typography;

const GeneratePayment = () => {
  const [roomHistory, setRoomHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [costItems, setCostItems] = useState([{ name: "", amount: "" }]);
  const [form] = Form.useForm();

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

  const handleGeneratePayment = (room) => {
    setSelectedRoom(room);
    setIsModalVisible(true);
    setCostItems([{ name: "", amount: "" }]);
  };

  const handleAddCostItem = () =>
    setCostItems([...costItems, { name: "", amount: "" }]);

  const handleRemoveCostItem = (index) => {
    if (costItems.length > 1) {
      const updatedItems = [...costItems];
      updatedItems.splice(index, 1);
      setCostItems(updatedItems);
    }
  };

  const handleCostChange = (index, field, value) => {
    const updatedItems = [...costItems];
    updatedItems[index][field] = value;
    setCostItems(updatedItems);
  };

  const calculateTotal = () =>
    costItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const handlePaymentSubmit = async () => {
    try {
      if (costItems.some((item) => !item.name || !item.amount)) {
        message.error("Please fill in all cost item fields.");
        return;
      }

      await createPaymentIntent({
        costItems,
        currency: "usd",
        roomHistoryId: selectedRoom._id,
      });

      message.success("Payment successfully created!");
      setIsModalVisible(false);

      const updatedHistory = await getRoomHistory();
      setRoomHistory(updatedHistory);
    } catch (error) {
      console.error("Error creating payment:", error);
      message.error(error.error || "Failed to create payment.");
    }
  };

  const columns = [
    {
      title: "Room Number",
      dataIndex: "roomNumber",
      key: "roomNumber",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Resident Name",
      dataIndex: "residentName",
      key: "residentName",
    },
    {
      title: "Check-in Time",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (text) => dayjs(text).format("DD/MM/YYYY h:mm A"),
    },
    {
      title: "Check-out Time",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      render: (text) =>
        text ? (
          dayjs(text).format("DD/MM/YYYY h:mm A")
        ) : (
          <Tag color="red">Still Occupied</Tag>
        ),
    },

    {
      title: "Payment",
      key: "payment",
      render: (_, record) =>
        record.paymentIntentId ? (
          <Tag color="green">
            <DollarCircleOutlined /> Payment Generated
          </Tag>
        ) : (
          <Button
            type="primary"
            icon={<DollarCircleOutlined />}
            onClick={() => handleGeneratePayment(record)}
          >
            Generate Payment
          </Button>
        ),
    },
  ];

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
          Generated Payment
        </Title>
        <div className="space-x-3"></div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : roomHistory.length === 0 ? (
        <Empty description="No room history available" />
      ) : (
        <Table
          columns={columns}
          dataSource={roomHistory}
          rowKey="_id"
          pagination={{ pageSize: 6 }}
          bordered
        />
      )}

      <Modal
        title={`Generate Payment for Room ${selectedRoom?.roomNumber}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        okText="Submit Payment"
        onOk={handlePaymentSubmit}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          {costItems.map((item, index) => (
            <Row gutter={8} key={index} className="mb-2">
              <Col span={10}>
                <Input
                  placeholder="Cost Name"
                  value={item.name}
                  onChange={(e) =>
                    handleCostChange(index, "name", e.target.value)
                  }
                />
              </Col>
              <Col span={10}>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) =>
                    handleCostChange(index, "amount", e.target.value)
                  }
                />
              </Col>
              <Col span={4}>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveCostItem(index)}
                  disabled={costItems.length === 1}
                />
              </Col>
            </Row>
          ))}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddCostItem}
            block
          >
            Add Cost Item
          </Button>

          <h3 className="text-right mt-4">Total: ${calculateTotal()}</h3>
        </Form>
      </Modal>
    </Card>
  );
};

export default GeneratePayment;
