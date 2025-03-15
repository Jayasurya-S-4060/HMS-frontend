import { useEffect, useState } from "react";
import { Table, Tag, message, Card, Typography, Select, Input } from "antd";
import dayjs from "dayjs";
import { getAllPayments } from "../services/handlePayment";

const { Title } = Typography;

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter based on status
  const filteredPayments = payments.filter((payment) =>
    filterStatus === "all" ? true : payment.status === filterStatus
  );

  // Search based on room number or resident name
  const searchedPayments = filteredPayments.filter(
    (payment) =>
      payment.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.residentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      render: (amount, record) => `$${amount} ${record.currency || "USD"}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "succeeded"
              ? "green"
              : status === "pending"
              ? "orange"
              : "red"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY h:mm A"),
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
          All Generated Payments
        </Title>
        <div className="space-x-3 flex">
          <Select
            defaultValue="all"
            onChange={(value) => setFilterStatus(value)}
            options={[
              { value: "all", label: "All Payments" },
              { value: "succeeded", label: "Succeeded" },
              { value: "pending", label: "Pending" },
              { value: "failed", label: "Failed" },
            ]}
            style={{ width: 160 }}
          />
          <Input.Search
            placeholder="Search Room or Resident"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={searchedPayments}
        rowKey="_id"
        bordered
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: "No payments found" }}
      />
    </Card>
  );
};

export default PaymentList;
