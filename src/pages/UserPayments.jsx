import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import {
  Table,
  Button,
  Spin,
  message,
  Tag,
  Card,
  Empty,
  List,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { DollarCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const UserPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/payments/user-payments/${user._id}`
      );
      setPayments(response.data);
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (payment) => {
    try {
      setLoading(true);
      const clientSecret = payment.client_secret;

      navigate(`/app/userPayments/payment?clientSecret=${clientSecret}`);
    } catch (error) {
      message.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Room No",
      dataIndex: "roomNumber",
      key: "roomNumber",
    },
    {
      title: "Amount ($)",
      dataIndex: "amount",
      key: "amount",
      render: (amt) => `$${(amt / 100).toFixed(2)}`,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      render: (cur) => cur?.toUpperCase(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "succeeded" ? (
          <Tag color="green">Paid</Tag>
        ) : (
          <Tag color="red">Pending</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, payment) =>
        payment.status !== "succeeded" ? (
          <Button
            type="primary"
            icon={<DollarCircleOutlined />}
            onClick={() => handlePayNow(payment)}
            loading={loading}
          >
            Pay Now
          </Button>
        ) : (
          <Tag color="green">Completed</Tag>
        ),
    },
  ];

  const expandedRowRender = (record) => {
    if (!record.costBreakdown || record.costBreakdown.length === 0) {
      return <Text type="secondary">No cost breakdown available.</Text>;
    }

    return (
      <List
        size="small"
        header={<Text strong>Cost Breakdown</Text>}
        dataSource={record.costBreakdown}
        renderItem={(item) => (
          <List.Item>
            <span>{item.name}</span>
            <span>
              <Text strong>${(item.amount / 100).toFixed(2)}</Text>
            </span>
          </List.Item>
        )}
      />
    );
  };

  return (
    <Card
      title={<h2 className="text-xl font-semibold">My Payments</h2>}
      bordered
      className="shadow-lg"
    >
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : payments.length === 0 ? (
        <Empty description="No payments found" />
      ) : (
        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
          expandable={{
            expandedRowRender,
            rowExpandable: (record) =>
              record.costBreakdown && record.costBreakdown.length > 0,
          }}
        />
      )}
    </Card>
  );
};

export default UserPayments;
