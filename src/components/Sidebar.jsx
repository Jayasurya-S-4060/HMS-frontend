import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  DollarSign,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginIcon from "../assets/login";

// Menu Items Definition
const menuItems = [
  {
    name: "Hostel Management",
    icon: Home,
    compName: "hostel-management",
    children: [
      { name: "Rooms", path: "/app/rooms", compName: "hostel-management" },
      {
        name: "Maintenance Requests",
        path: "/app/maintenanceRequests",
        compName: "hostel-management",
      },
    ],
  },
  {
    name: "User Management",
    icon: Users,
    compName: "user-management",
    children: [
      { name: "Users", path: "/app/users", compName: "user-management" },
    ],
  },
  {
    name: "Payments",
    icon: DollarSign,
    compName: "payment-management",
    children: [
      {
        name: "Financial Reports",
        path: "/app/financialManagement",
        compName: "financial-management",
      },
      {
        name: "Generate Payment",
        path: "/app/paymentManagement/generatePayment",
        compName: "payment-management",
      },
      {
        name: "Payment List",
        path: "/app/paymentManagement/paymentList",
        compName: "payment-management",
      },
    ],
  },
  {
    name: "Notifications",
    path: "/app/admin-notifications",
    icon: Bell,
    compName: "notification-management",
  },
  {
    name: "My Payments",
    path: "/app/userPayments",
    icon: CreditCard,
    compName: "user-payments",
  },
  {
    name: "My profile",
    path: "/app/myProfile",
    icon: Settings,
    compName: "profile",
  },
];

// Permissions Filter
const filterMenuItems = (items, userPermissions) =>
  items
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

// Sidebar Component
const Sidebar = () => {
  const { user, permissions } = useAuth();
  const role = user?.role;
  const userPermissions = permissions[role] || [];

  const filteredMenuItems = filterMenuItems(menuItems, userPermissions);

  const navigate = useNavigate();
  const location = useLocation();
  const [openSections, setOpenSections] = useState({});

  const handleNavigation = (path) => navigate(path);
  const toggleSection = (sectionName) =>
    setOpenSections((prev) => ({ ...prev, [sectionName]: !prev[sectionName] }));
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="h-screen w-64 bg-white border-r shadow-md flex flex-col">
      {/* Logo */}
      <div className="py-6 flex justify-center border-b">
        <LoginIcon width={130} height={90} />
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            const isOpen = openSections[item.name];
            return (
              <div key={item.name} className="space-y-1">
                {/* Parent */}
                <div
                  onClick={() => toggleSection(item.name)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-3 text-gray-700 font-semibold">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <span>{item.name}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>

                {/* Sub Items */}
                {isOpen && (
                  <div className="ml-5 mt-2 space-y-1">
                    {item.children.map((subItem) => (
                      <div
                        key={subItem.path}
                        onClick={() => handleNavigation(subItem.path)}
                        className={`flex items-center px-3 py-2 rounded-md cursor-pointer text-sm transition-all ${
                          isActive(subItem.path)
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <span className="truncate">{subItem.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                isActive(item.path)
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5 text-blue-600" />
              <span className="truncate font-medium">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
