import {Link} from "react-router-dom"
import paymentSuccess from "../../assets/images/paymentSuccess.png"
const CheckoutSuccess = () => {
  return (
    <div className="bg-gray-50 h-screen">
        <div className="bg-white p-6 md:mx-auto">
            <div className="mx-auto my-6 w-20 h-20">
                <img src={paymentSuccess} alt="" />
            </div>
            <div className="text-center">
                <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                    Payment Done
                </h3>
                <p className="text-gray-600 my-2">
                    Thank you for completing your secure online payment
                </p>
                <p>Have a greate day!</p>
                <div className="py-10 text-center">
                    <Link to="/home" className="px-12 bg-buttonBgColor text-white font-semibold py-3">
                    Go Back To Home</Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CheckoutSuccess