import { Layout, Menu, Dropdown, Avatar, Badge } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getUnreadNotificationCount } from "../services/notificationService";

const { Header: AntdHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotificationCount = async () => {
    try {
      const { count } = await getUnreadNotificationCount(user?._id, user?.role);
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch notification count:", error);
    }
  };

  useEffect(() => {
    if (user?._id && user?.role) {
      fetchNotificationCount();
      const interval = setInterval(fetchNotificationCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const userMenu = (
    <Menu
      style={{
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        minWidth: "160px",
        padding: "8px 0",
        backgroundColor: "#fff",
      }}
    >
      <Menu.Item
        key="profile"
        icon={<UserOutlined style={{ color: "#4A5568" }} />}
        onClick={() => navigate("/app/myProfile")}
        style={{ fontWeight: "500", padding: "10px 16px" }}
      >
        My Profile
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined style={{ color: "#E53E3E" }} />}
        onClick={handleLogout}
        style={{ fontWeight: "500", padding: "10px 16px" }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <AntdHeader
      className="flex items-center justify-between px-6 py-3 shadow-sm"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #E2E8F0",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        className="text-xl font-semibold tracking-wide cursor-pointer select-none"
        onClick={() => navigate("/app/dashboard")}
        style={{ color: "#2D3748" }}
      >
        Hostel Management
      </div>

      <div className="flex items-center space-x-6">
        <Badge count={unreadCount} overflowCount={99}>
          <BellOutlined
            className="text-2xl cursor-pointer text-gray-600 hover:text-blue-500 transition-colors"
            onClick={() => navigate("/app/notifications")}
          />
        </Badge>

        <Dropdown
          overlay={userMenu}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="flex items-center space-x-2 cursor-pointer group">
            <Avatar
              size={40}
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#CBD5E0",
                color: "#2D3748",
                border: "2px solid #EDF2F7",
              }}
            />
            <span className="hidden md:block text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
              {user?.name || "User"}
            </span>

            <CaretDownOutlined className="text-gray-500 group-hover:text-blue-600 transition-colors" />
          </div>
        </Dropdown>
      </div>
    </AntdHeader>
  );
};

export default Header;
