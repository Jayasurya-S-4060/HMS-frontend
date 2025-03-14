import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../pages/CheckoutForm";
import { Card, Typography } from "antd";

const { Title } = Typography;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // Replace with your key

const PaymentPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientSecret = queryParams.get("clientSecret");
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (clientSecret) {
      setOptions({ clientSecret });
    }
  }, [clientSecret]);

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
        <Card className="w-full" bodyStyle={{ padding: "32px" }}>
          <Title level={4} style={{ textAlign: "center", color: "red" }}>
            Error: Missing payment details.
          </Title>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center  p-4 bg-gray-100">
      <Card
        className="w-full"
        bodyStyle={{ padding: "32px" }}
        style={{
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          borderRadius: "12px",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: "32px" }}>
          Complete Your Payment
        </Title>
        {options && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        )}
      </Card>
    </div>
  );
};

export default PaymentPage;
