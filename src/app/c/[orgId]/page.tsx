"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";

export default function PublicCataloguePage() {
  const { orgId } = useParams<{ orgId: string }>();
  const { data, isLoading } = api.public.getCatalogue.useQuery({ orgId });
  const submitRequest = api.public.submitQuoteRequest.useMutation({
    onSuccess: () => {
      toast.success("Quote request submitted successfully!");
      setCart({});
      setCheckoutOpen(false);
    },
    onError: (err) => {
      toast.error(`Error: ${err.message}`);
    }
  });

  const [cart, setCart] = useState<Record<string, { product: any, quantity: number }>>({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  if (isLoading) return <div className="p-12 text-center text-muted-foreground">Loading Catalogue...</div>;
  if (!data) return <div className="p-12 text-center text-destructive">Catalogue not found.</div>;

  const handleAddToCart = (product: any) => {
    setCart(prev => ({
      ...prev,
      [product.id]: {
        product,
        quantity: (prev[product.id]?.quantity || 0) + 1
      }
    }));
    toast.success(`${product.name} added to cart`);
  };

  const cartItems = Object.values(cart);
  const totalItems = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error("Cart is empty");
    
    submitRequest.mutate({
      orgId,
      name,
      email,
      phone,
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.unitPrice,
      }))
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl">{data.organization.name}</h1>
            <p className="text-sm text-muted-foreground">Product Catalogue</p>
          </div>
          
          <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
            <DialogTrigger asChild>
              <Button className="relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Request Quote
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Quote Request</DialogTitle>
              </DialogHeader>
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Your cart is empty.</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Your Name</Label>
                    <Input required value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone (Optional)</Label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  
                  <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                    {cartItems.map(item => (
                      <div key={item.product.id} className="flex justify-between items-center text-sm">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span className="font-medium">${((item.product.unitPrice * item.quantity) / 100).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={submitRequest.isPending}>
                    {submitRequest.isPending ? "Submitting..." : "Send Request"}
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {data.products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <p className="text-muted-foreground">No products available in this catalogue currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.products.map(product => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.sku || "No SKU"}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {product.description || "No description provided."}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t pt-4">
                  <span className="font-bold">${(product.unitPrice / 100).toFixed(2)}</span>
                  <Button size="sm" onClick={() => handleAddToCart(product)}>
                    Add
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
