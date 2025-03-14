import { useNavigate } from "react-router-dom";
import { Button, Card, Result } from "antd";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="shadow-lg w-full max-w-md rounded-2xl">
        <Result
          status="success"
          title="Payment Successful!"
          subTitle="Thank you for your payment. Your transaction has been completed successfully."
          extra={[
            <Button
              type="primary"
              key="payments"
              onClick={() => navigate("/my-payments")}
              size="large"
              className="rounded-full"
            >
              Go to My Payments
            </Button>,
          ]}
        />
      </Card>
    </div>
  );
};

export default PaymentSuccess;
