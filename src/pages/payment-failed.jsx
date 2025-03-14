// src/pages/PaymentFailure.jsx
import React from "react";
import { Card, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { CloseCircleTwoTone } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Card style={{ maxWidth: 500, textAlign: "center", width: "100%" }}>
        <CloseCircleTwoTone
          twoToneColor="#ff4d4f"
          style={{ fontSize: "64px" }}
        />
        <Title level={2} style={{ marginTop: 20 }}>
          Payment Failed!
        </Title>
        <Paragraph>
          Unfortunately, your payment could not be processed. Please try again.
        </Paragraph>
        <Button
          type="primary"
          onClick={() => navigate("/app/userPayments")}
          style={{ marginTop: 20 }}
        >
          Back to Payments
        </Button>
      </Card>
    </div>
  );
};

export default PaymentFailure;
