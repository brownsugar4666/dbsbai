import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, Calendar, Phone, ArrowRight, Check } from 'lucide-react';
import { Button, Card, Input, Alert, StepTimeline } from '../components';
import { useVoterStore } from '../lib/store';
import { generateZKToken, hashData } from '../lib/crypto';

interface FormData {
    name: string;
    idNumber: string;
    dob: string;
    phone: string;
}

interface FormErrors {
    name?: string;
    idNumber?: string;
    dob?: string;
    phone?: string;
}

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const { setVoter, voter } = useVoterStore();

    const [step, setStep] = useState<'form' | 'otp' | 'success'>(voter ? 'success' : 'form');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        idNumber: '',
        dob: '',
        phone: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const timelineSteps = [
        { id: '1', title: 'Details', status: step === 'form' ? 'current' as const : 'completed' as const },
        { id: '2', title: 'Verify', status: step === 'otp' ? 'current' as const : step === 'success' ? 'completed' as const : 'upcoming' as const },
        { id: '3', title: 'Complete', status: step === 'success' ? 'current' as const : 'upcoming' as const },
    ];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
        else if (formData.idNumber.length < 6) newErrors.idNumber = 'Minimum 6 characters';

        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        else {
            const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
            if (age < 18) newErrors.dob = 'Must be 18 years or older';
        }

        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Enter valid 10-digit number';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStep('otp');
        setIsLoading(false);
    };

    const handleVerifyOTP = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const secret = Math.random().toString(36).substring(2);
        const zkToken = generateZKToken(formData.idNumber, secret);
        const voterId = hashData(formData.idNumber + formData.dob);

        setVoter({
            id: voterId,
            name: formData.name,
            zkToken,
            isVerified: true,
            registeredAt: Date.now(),
        });

        setStep('success');
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-surface-light py-12 animate-fade-in">
            <div className="max-w-lg mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gov-navy">Voter Registration</h1>
                    <p className="text-secondary mt-2">Secure identity verification with e-KYC</p>
                </div>

                {/* Timeline */}
                <div className="mb-10">
                    <StepTimeline steps={timelineSteps} />
                </div>

                {/* Form Step */}
                {step === 'form' && (
                    <Card elevated padding="lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Alert
                                type="info"
                                title="Demo Mode"
                                message="This is a prototype. No real data is collected or stored."
                            />

                            <Input
                                label="Full Name"
                                placeholder="As per government ID"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                error={errors.name}
                                leftIcon={<User className="w-4 h-4" />}
                                required
                            />

                            <Input
                                label="Aadhaar / Voter ID Number"
                                placeholder="Enter 12-digit number"
                                value={formData.idNumber}
                                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                                error={errors.idNumber}
                                leftIcon={<CreditCard className="w-4 h-4" />}
                                required
                            />

                            <Input
                                label="Date of Birth"
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                error={errors.dob}
                                leftIcon={<Calendar className="w-4 h-4" />}
                                required
                            />

                            <Input
                                label="Mobile Number"
                                placeholder="10-digit mobile number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                error={errors.phone}
                                leftIcon={<Phone className="w-4 h-4" />}
                                required
                            />

                            <div className="flex items-start gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    className="mt-1 rounded border-border-default text-gov-saffron focus:ring-gov-saffron"
                                    required
                                />
                                <label htmlFor="consent" className="text-sm text-secondary">
                                    I consent to identity verification for voter registration as per the Election Commission guidelines.
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                Continue to Verification
                            </Button>
                        </form>
                    </Card>
                )}

                {/* OTP Step */}
                {step === 'otp' && (
                    <Card elevated padding="lg">
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 rounded-full bg-gov-navy/10 flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-6 h-6 text-gov-navy" />
                            </div>
                            <h2 className="text-xl font-semibold text-gov-navy">Verify Your Phone</h2>
                            <p className="text-sm text-secondary mt-2">
                                OTP sent to +91 ****{formData.phone.slice(-4)}
                            </p>
                        </div>

                        <Alert
                            type="info"
                            title="Demo"
                            message="Enter any 6-digit code to continue"
                            className="mb-6"
                        />

                        <Input
                            label="Enter OTP"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            className="text-center text-xl tracking-[0.5em] font-mono"
                        />

                        <div className="mt-6 space-y-3">
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleVerifyOTP}
                                isLoading={isLoading}
                                disabled={otp.length !== 6}
                            >
                                Verify & Complete
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => setStep('form')}
                            >
                                Go Back
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Success Step */}
                {step === 'success' && (
                    <Card elevated padding="lg" className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gov-saffron flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-gov-navy" strokeWidth={2.5} />
                        </div>

                        <h2 className="text-2xl font-semibold text-gov-navy">Registration Complete</h2>
                        <p className="text-secondary mt-2">You are now registered to vote</p>

                        <div className="mt-6 p-4 bg-surface-subtle rounded-lg border border-border-light">
                            <p className="text-xs text-muted mb-2 uppercase tracking-wide">Your ZK Token</p>
                            <code className="text-sm text-gov-navy break-all font-mono block">
                                {voter?.zkToken}
                            </code>
                        </div>

                        <div className="mt-8 space-y-3">
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => navigate('/vote')}
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                Proceed to Vote
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => navigate('/')}
                            >
                                Return Home
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Register;
