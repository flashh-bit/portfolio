"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<FormStatus>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => {
                    setStatus('idle');
                    onClose();
                }, 2000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-[500px] z-50 bg-[#0f0f1a] border-t md:border border-indigo-900/50 rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-indigo-900/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-full">
                                    <Send className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Quick Contact</h2>
                                    <p className="text-indigo-400/70 text-sm">Let's build something together</p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 bg-indigo-900/30 rounded-full hover:bg-indigo-800/50 transition-colors"
                            >
                                <X className="w-5 h-5 text-indigo-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm text-indigo-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#1a1a2e] border border-indigo-900/50 rounded-xl px-4 py-3 text-white placeholder-indigo-500/50 focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm text-indigo-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#1a1a2e] border border-indigo-900/50 rounded-xl px-4 py-3 text-white placeholder-indigo-500/50 focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm text-indigo-300 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full bg-[#1a1a2e] border border-indigo-900/50 rounded-xl px-4 py-3 text-white placeholder-indigo-500/50 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${status === 'success'
                                        ? 'bg-green-500 text-white'
                                        : status === 'error'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                    }`}
                            >
                                {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
                                {status === 'success' && <CheckCircle className="w-5 h-5" />}
                                {status === 'error' && <AlertCircle className="w-5 h-5" />}
                                {status === 'idle' && <Send className="w-5 h-5" />}
                                {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent!' : status === 'error' ? 'Failed to send' : 'Send Message'}
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ContactModal;
