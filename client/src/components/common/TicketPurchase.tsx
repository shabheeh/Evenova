"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, CreditCard, Shield, Loader2 } from "lucide-react";
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { api } from "@/lib/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface Ticket {
  name: string;
  price: number;
  quantity: number;
  available: number;
  foodIncluded: boolean;
}

export interface SelectedTicket {
  name: string;
  price: number;
  quantity: number;
  foodIncluded: boolean;
}

interface Event {
  id: string;
  title: string;
  tickets: Ticket[];
}

interface TicketPurchaseProps {
  event: Event;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '14px',
      color: '#374151',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '::placeholder': {
        color: '#9CA3AF',
      },
      padding: '12px',
    },
    invalid: {
      color: '#EF4444',
      iconColor: '#EF4444',
    },
  },
  hidePostalCode: true,
};

function CheckoutForm({ 
  event, 
  selectedTickets, 
  getTotalPrice, 
  getTotalTickets, 
  onBack 
}: {
  event: Event;
  selectedTickets: SelectedTicket[];
  getTotalPrice: () => number;
  getTotalTickets: () => number;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!email || !name) {
      setError('Please fill in all required fields');
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
  
      const response = await api.post('/payments/create-payment-intent', {
        
          eventId: event.id,
          tickets: selectedTickets,
          amount: Math.round(getTotalPrice() * 100),
          currency: 'usd',
          customerEmail: email,
          customerName: name,
        })


      const { clientSecret } = response.data.data;
      console.log(response.data.data, "hello")

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: name,
              email: email,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        alert('Payment successful! You will receive a confirmation email shortly.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-emerald-600" />
          Checkout
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium">Order Summary</h3>
            {selectedTickets.map((selectedTicket) => (
              <div key={selectedTicket.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>
                    {selectedTicket.name} × {selectedTicket.quantity}
                  </span>
                  <span>${(selectedTicket.price * selectedTicket.quantity).toFixed(2)}</span>
                </div>
                {selectedTicket.foodIncluded && (
                  <div className="text-xs text-emerald-600 pl-2">
                    🍽️ Food included
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-between text-sm">
              <span>Service Fee (5%)</span>
              <span>${(getTotalPrice() * 0.05).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${(getTotalPrice() * 1.05).toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input 
                id="name" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Card Information *</Label>
              <div className="border rounded-md p-3 bg-background">
                <CardElement options={cardElementOptions} />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              size="lg"
              disabled={!stripe || processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Complete Purchase - $${(getTotalPrice() * 1.05).toFixed(2)}`
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={onBack}
              disabled={processing}
            >
              Back to Tickets
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function TicketPurchase({ event }: TicketPurchaseProps) {
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const updateTicketQuantity = (ticketName: string, quantity: number) => {
    if (quantity <= 0) {
      
      setSelectedTickets(prev => prev.filter(t => t.name !== ticketName));
    } else {
      const ticket = event.tickets.find((t) => t.name === ticketName);
      if (ticket) {
        setSelectedTickets(prev => {
          const existingIndex = prev.findIndex(t => t.name === ticketName);
          const newSelectedTicket: SelectedTicket = {
            name: ticket.name,
            price: ticket.price,
            quantity: quantity,
            foodIncluded: ticket.foodIncluded
          };

          if (existingIndex >= 0) {
            
            const updated = [...prev];
            updated[existingIndex] = newSelectedTicket;
            return updated;
          } else {
           
            return [...prev, newSelectedTicket];
          }
        });
      }
    }
  };

  const getTotalPrice = () => {
    return selectedTickets.reduce(
      (total, selectedTicket) => {
        return total + (selectedTicket.price * selectedTicket.quantity);
      },
      0
    );
  };

  const getTotalTickets = () => {
    return selectedTickets.reduce(
      (total, selectedTicket) => total + selectedTicket.quantity,
      0
    );
  };

  const getSelectedTicketQuantity = (ticketName: string): number => {
    const selectedTicket = selectedTickets.find(t => t.name === ticketName);
    return selectedTicket?.quantity || 0;
  };

  const handlePurchase = () => {
    if (getTotalTickets() > 0) {
      setShowCheckout(true);
    }
  };

  if (showCheckout) {
    return (
      <Elements stripe={stripePromise}>
        <CheckoutForm
          event={event}
          selectedTickets={selectedTickets}
          getTotalPrice={getTotalPrice}
          getTotalTickets={getTotalTickets}
          onBack={() => setShowCheckout(false)}
        />
      </Elements>
    );
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-emerald-600" />
          Select Tickets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {event.tickets.map((ticket) => (
            <div key={ticket.name} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{ticket.name}</h3>
                  {ticket.foodIncluded && (
                    <p className="text-xs text-emerald-600 mb-1">🍽️ Food included</p>
                  )}
                  <p className="text-2xl font-bold text-emerald-600">
                    ${ticket.price}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {ticket.available} left
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateTicketQuantity(
                        ticket.name,
                        getSelectedTicketQuantity(ticket.name) - 1
                      )
                    }
                    disabled={getSelectedTicketQuantity(ticket.name) === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">
                    {getSelectedTicketQuantity(ticket.name)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateTicketQuantity(
                        ticket.name,
                        getSelectedTicketQuantity(ticket.name) + 1
                      )
                    }
                    disabled={
                      getSelectedTicketQuantity(ticket.name) >= ticket.available
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {getTotalTickets() > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>Tickets ({getTotalTickets()})</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service Fee (5%)</span>
              <span>${(getTotalPrice() * 0.05).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${(getTotalPrice() * 1.05).toFixed(2)}</span>
            </div>
          </div>
        )}

        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          size="lg"
          onClick={handlePurchase}
          disabled={getTotalTickets() === 0}
        >
          {getTotalTickets() > 0
            ? `Get ${getTotalTickets()} Ticket${
                getTotalTickets() > 1 ? "s" : ""
              }`
            : "Select Tickets"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Free cancellation up to 24 hours before the event
        </p>
      </CardContent>
    </Card>
  );
}