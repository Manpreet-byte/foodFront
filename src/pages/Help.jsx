import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse the menu, add items to your cart, proceed to checkout, enter your delivery details, and confirm your order. You can pay via cash on delivery or online payment.'
    },
    {
      question: 'How can I track my order?',
      answer: 'After placing an order, you can track it from your Profile > Orders section. You\'ll also receive SMS and email notifications for order status updates.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept Cash on Delivery (COD), Credit/Debit Cards, and UPI payments through our secure Razorpay payment gateway.'
    },
    {
      question: 'How do I cancel my order?',
      answer: 'You can cancel your order within 5 minutes of placing it by going to Profile > Orders and clicking the cancel button. After 5 minutes, please contact customer support.'
    },
    {
      question: 'What are the delivery charges?',
      answer: 'Delivery is free for orders above ₹299. For orders below ₹299, a delivery charge of ₹30 applies.'
    },
    {
      question: 'How do I apply a promo code?',
      answer: 'Enter your promo code in the coupon field at checkout before placing your order. The discount will be applied automatically.'
    },
    {
      question: 'Can I change my delivery address?',
      answer: 'You can change your delivery address before the order is confirmed. Once the restaurant starts preparing, the address cannot be changed.'
    },
    {
      question: 'How do I rate my order?',
      answer: 'After your order is delivered, you\'ll receive a notification to rate your experience. You can also rate from Profile > Orders > Rate Order.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How can we help you?
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Link to="/profile?tab=orders" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition text-center group">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition">Track Order</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your order status</p>
          </Link>
          <Link to="/profile?tab=addresses" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition text-center group">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition">Manage Addresses</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add or edit addresses</p>
          </Link>
          <Link to="/profile?tab=settings" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition text-center group">
            <div className="text-4xl mb-3">⚙️</div>
            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition">Account Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update your preferences</p>
          </Link>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>❓</span> Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 text-gray-600 dark:text-gray-400 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>✉️</span> Contact Us
          </h2>
          
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-600 mb-2">Message Sent!</h3>
              <p className="text-gray-600 dark:text-gray-400">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="How can we help you?"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white text-center">
            <div className="text-3xl mb-2">📞</div>
            <h3 className="font-bold mb-1">Call Us</h3>
            <p className="text-orange-100">+91 98765 43210</p>
            <p className="text-xs text-orange-200 mt-1">9 AM - 10 PM IST</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-6 text-white text-center">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-bold mb-1">Live Chat</h3>
            <p className="text-blue-100">Chat with support</p>
            <p className="text-xs text-blue-200 mt-1">Available 24/7</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white text-center">
            <div className="text-3xl mb-2">📧</div>
            <h3 className="font-bold mb-1">Email</h3>
            <p className="text-green-100">support@foodorder.com</p>
            <p className="text-xs text-green-200 mt-1">Response within 24h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
