import { useEffect, useState } from "react";
import { Table, Tag, Spin, message, Card, Typography } from "antd";
import dayjs from "dayjs";
import { getAllPayments } from "../services/handlePayment";
const { Title } = Typography;

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await getAllPayments();
        setPayments(data || []);
      } catch (error) {
        console.error("Error fetching payments:", error);
        message.error("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const columns = [
    {
      title: "Room",
      dataIndex: "roomNumber",
      key: "roomNumber",
    },
    {
      title: "Resident",
      dataIndex: "residentName",
      key: "residentName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => `$${amount} ${record.currency}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "succeeded" ? "green" : "blue"}>{status}</Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY h:mm A"),
    },
  ];

  return loading ? (
    <Spin size="large" />
  ) : (
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
          All Generated Payments
        </Title>
        <div className="space-x-3"></div>
      </div>
      <Table
        columns={columns}
        dataSource={payments}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default PaymentList;
