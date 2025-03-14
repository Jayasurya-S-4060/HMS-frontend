import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      message.error("Stripe is not loaded.");
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      message.error(error.message);
      navigate("/app/userPayments/failure");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      message.success("Payment successful!");
      navigate("/app/userPayments/success");
    } else {
      message.error("Payment failed. Please try again.");
      navigate("/app/userPayments/failure");
    }

    setLoading(false);
  };

  return (
    <div style={{ margin: "0 auto", width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <PaymentElement options={{ layout: "tabs" }} className="w-full" />
        <Button
          type="primary"
          htmlType="submit"
          disabled={!stripe || !elements || loading}
          className="mt-6 w-full"
          size="large"
        >
          {loading ? <Spin size="small" /> : "Pay Now"}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
