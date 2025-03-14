import { useEffect, useState } from "react";
import { Table, Tag, Button, Space, Typography, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import getUsers from "../services/getUsers";

const { Title } = Typography;

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (record) => {
    navigate(`/app/users/${record._id}`, { state: { user: record } });
  };

  const handleRegisterUser = () => {
    navigate("/auth/register");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={
            role === "Admin"
              ? "red"
              : role === "Staff"
              ? "green"
              : role === "Resident"
              ? "blue"
              : "gray"
          }
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
          >
            View
          </Button>
        </Space>
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
          User Management
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleRegisterUser}
        >
          Register User
        </Button>
      </div>

      <Table
        dataSource={users}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 8 }}
      />
    </Card>
  );
};

export default Users;
