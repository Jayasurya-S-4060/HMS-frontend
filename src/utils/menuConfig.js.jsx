import {
  DollarOutlined,
  HomeOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const rawMenuItems = [
  {
    key: "/app/myProfile",
    label: "My Profile",
    compName: "profile",
  },
  {
    key: "/app/users",
    label: "User Management",
    compName: "user-management",
    icon: <UserOutlined />,
  },
  {
    key: "rooms",
    label: "Hostel Management",
    icon: <HomeOutlined />,
    compName: "hostel-management",
    children: [
      {
        key: "/app/rooms",
        label: "Hostel Management",
        compName: "hostel-management",
      },
      {
        key: "/app/maintenanceRequests",
        label: "Maintenance Requests",
        compName: "hostel-management",
      },
    ],
  },

  {
    key: "paymentManagement",
    label: "Financial & Payment Management",
    icon: <DollarOutlined />,
    compName: "payment-management",
    children: [
      {
        key: "/app/financialManagement",
        label: "Financial Management",
        compName: "financial-management",
      },
      {
        key: "/app/paymentManagement/generatePayment",
        label: "Generate Payment",
        compName: "payment-management",
      },
      {
        key: "/app/paymentManagement/paymentList",
        label: "Payment List",
        compName: "payment-management",
      },
    ],
  },
  {
    key: "/app/admin-notifications",
    label: "Notifications",
    compName: "notification-management",
  },
  {
    key: "/app/userPayments",
    label: "My Payments",
    compName: "user-payments",
  },
];

export const filterMenuItems = (items, userPermissions) => {
  return items
    .map((item) => {
      if (item.children) {
        const filteredChildren = filterMenuItems(
          item.children,
          userPermissions
        );
        if (filteredChildren.length)
          return { ...item, children: filteredChildren };
        return null;
      } else if (item.compName) {
        return userPermissions.includes(item.compName) ? item : null;
      }
      return item;
    })
    .filter(Boolean);
};
