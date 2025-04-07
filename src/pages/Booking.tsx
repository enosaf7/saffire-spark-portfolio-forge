
import BookingForm from "@/components/booking/BookingForm";
import Navbar from "@/components/ui/layout/Navbar";
import Footer from "@/components/ui/layout/Footer";

const Booking = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
              Book Our <span className="text-saffire-blue">Services</span>
            </h1>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Fill out the form below with your details and requirements, and we'll get back to you within 24 hours.
            </p>
            <BookingForm />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Booking;
