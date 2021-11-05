import "../../card.css";
import { loadStripe } from "@stripe/stripe-js";
import { createSignal, createEffect } from "solid-js";
import axios from "axios";

function CardPayment() {
  const [StripeLoad, setStripeLoad] = createSignal(null);
  const [CardElement, setCardElement] = createSignal(null);

  async function loadStripeElements() {
    const stripe = await loadStripe(import.meta.env.VITE_PUBLIC_KEY_STRIPE);
    setStripeLoad(stripe);

    const elements = StripeLoad().elements();

    const createElementsCard = elements.create("card");

    setCardElement(createElementsCard);

    CardElement().mount("#card-id");
  }

  createEffect(() => {
    loadStripeElements();
  });

  const createPaymentIntent = async (e) => {
    e.preventDefault();
    const payload = await StripeLoad().createPaymentMethod({
      type: "card",
      card: CardElement(),
    });

    if (payload.error) {
      console.log(payload.error);
    } else {
      try {
        const response = await axios({
          url: "http://localhost:5000/create-payment-intent",
          method: "POST",
          data: {
            id: "",
            description: "Monitor Gaming",
            amount: 150 * 100,
          },
        });
        confirmPayment(response.data["client_secret"]);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const confirmPayment = (PAYMENT_INTENT_CLIENT_SECRET) => {
    const confirm = window.confirm();
    if (confirm) {
      StripeLoad( )
        .confirmCardPayment(PAYMENT_INTENT_CLIENT_SECRET, {
          payment_method: {
            card: CardElement(),
            billing_details: {
              name: "Nelson Hernandez",
            },
          },
        })
        .then(function (result) {
          if (result.paymentIntent.status) {
            console.log("Pago exitoso");
          }
        });
    }
  };
  return (
    <div>
      <div className="center-card">
        <form>
          <div className="card">
            <img
              src="https://www.monederosmart.com/wp-content/uploads/2019/11/Monitor-gaming-0-AlexandruaceaTMkrN9QZERw.jpg"
              alt=""
              className="img-card"
            />
            <h3>Monitor Gaming</h3>
            <p>$150 USD</p>
            <br />
            <div className="margin-card">
              <div id="card-id" />
              <br />
              <button className="btn-payment" onClick={createPaymentIntent}>
                Comprar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CardPayment;
