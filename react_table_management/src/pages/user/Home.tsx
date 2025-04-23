import React, { useState } from 'react';
import { Booking, BookingRequest } from '../../type/booking.type';
import BookingForm from '../../components/user/BookingForm';
import bookingService from '../../services/booking.service';

const Home: React.FC = () => {
    const [, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string | null>(null);

    const addBooking = async (booking: BookingRequest) => {
        try {
            const response = await bookingService.createBooking(booking);
            console.log(response);
            if (response.success === true) {
                setBookings((prev) => [...prev, response.result]);
                setError(null);
            } else {
                setError('Failed to create booking. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while creating the booking.');
            console.error('Booking error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section
                id="home"
                className="relative py-24 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4)' }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
                <div className="relative max-w-7xl mx-auto text-center px-4">
                    <h2 className="text-5xl font-extrabold text-white mb-4 tracking-tight animate-fade-in">
                        Welcome to Our Restaurant
                    </h2>
                    <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                        Savor exquisite cuisine in an elegant and cozy atmosphere.
                    </p>
                    <a
                        href="#booking"
                        className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-transform transform hover:scale-105"
                    >
                        Book a Table
                    </a>
                </div>
            </section>

            {/* Menu Section */}
            <section id="menu" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold text-gray-800 mb-12">Our Menu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Appetizers',
                                description: 'Fresh salad, mushroom soup, seafood spring rolls.',
                                image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b',
                            },
                            {
                                title: 'Main Courses',
                                description: 'Beef steak, pan-seared salmon, spaghetti.',
                                image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
                            },
                            {
                                title: 'Desserts',
                                description: 'Flan, ice cream, fresh fruit.',
                                image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Booking Section */}
            <section id="booking" className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className=" mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8">Reserve Your Table</h2>
                    {error && (
                        <p className="text-red-500 mb-6 bg-red-50 py-2 px-4 rounded-md">{error}</p>
                    )}
                    <div className="max-w-lg mx-auto bg-white  rounded-xl shadow-md">
                        <BookingForm addBooking={addBooking} />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;