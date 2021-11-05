import CardPayment from "./components/CardPayment";
import stripeImage from "./assets/stripe.svg";
function App() {
  return (
    <div>
      <CardPayment />
      <img src={stripeImage} alt="Stripe" width="200px" height="200px" />
    </div>
  );
}

export default App;
