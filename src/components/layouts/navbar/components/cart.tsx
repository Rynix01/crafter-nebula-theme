"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, ShoppingCart, Plus, Minus, CreditCard } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/lib/context/AuthContext";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);
  const {
    state: cartState,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getTotal,
    purchaseItems,
    clearCart
  } = useCart();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    await applyCoupon(couponCode);
    setIsApplyingCoupon(false);
  };

  const handlePurchase = async () => {
    if (!user) return;

    // Mock user balance - replace with actual user balance from context
    const userBalance = 100; // This should come from user context

    const result = await purchaseItems(userBalance);
    if (result.type === "success") {
      onClose();
      clearCart();
      router.push("/chest");
      // Show success message
    } else if (result.type === "insufficient_balance") {
      router.push("/wallet");
    }
  };

  const getPaymentButtonText = () => {
    if (!user) return "Giriş Yap";

    // Mock user balance - replace with actual user balance from context
    const userBalance = 100; // This should come from user context
    const total = getTotal();

    if (userBalance >= total) {
      return "Satın Al";
    } else {
      return "Kredi Yükle";
    }
  };

  const getPaymentButtonAction = () => {
    if (!isAuthenticated && !isLoading) {
      return () => router.push("/auth/sign-in");
    }

    // Mock user balance - replace with actual user balance from context
    const userBalance = 100; // This should come from user context
    const total = getTotal();

    if (userBalance >= total) {
      return handlePurchase;
    } else {
      return () => (window.location.href = "/wallet"); // Navigate to wallet/recharge page
    }
  };

  return (
    <>
      {/* Cart Overlay - Soldan sağa doğru açılır */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 overflow-hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />

        {/* Cart Panel - Soldan sağa */}
        <div
          className={`absolute left-0 top-0 h-full w-96 bg-background border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Sepetim</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Cart Items - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartState.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Sepetiniz boş</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartState.items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{item.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price Display */}
                    <div className="mb-2">
                      {item.hasProductDiscount ? (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="line-through text-muted-foreground">
                            {item.price}₺
                          </span>
                          <span className="font-medium text-primary">
                            {item.discountedPrice}₺
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            {item.productDiscountType === "percentage"
                              ? `%${item.productDiscountValue}`
                              : `${item.productDiscountValue}₺`}
                          </Badge>
                        </div>
                      ) : (
                        <span className="font-medium">{item.price}₺</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-medium">
                        {item.discountedPrice * item.quantity}₺
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coupon Section */}
          {cartState.items.length > 0 && (
            <div className="flex-shrink-0 border-t border-border p-6">
              <div className="space-y-3">
                <h3 className="font-medium">İndirimler</h3>

                {/* Bulk Discount Display */}
                {cartState.bulkDiscount && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        🎯 Toplu İndirim
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {cartState.bulkDiscount.type === "percentage"
                          ? `%${cartState.bulkDiscount.amount} indirim`
                          : `${cartState.bulkDiscount.amount}₺ indirim`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Coupon Input */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">İndirim Kuponu</h4>
                  {cartState.coupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          {cartState.coupon.code}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {cartState.coupon.discountType === "percentage"
                            ? `%${cartState.coupon.discountValue} indirim`
                            : `${cartState.coupon.discountValue}₺ indirim`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Kupon kodu girin"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                      >
                        {isApplyingCoupon ? "..." : "Uygula"}
                      </Button>
                    </div>
                  )}
                  {cartState.error && (
                    <p className="text-sm text-destructive">
                      {cartState.error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Cart Footer */}
          {cartState.items.length > 0 && (
            <div className="flex-shrink-0 border-t border-border p-6">
              <div className="space-y-3 mb-4">
                {/* Original Total */}
                <div className="flex items-center justify-between text-sm">
                  <span>Orijinal Toplam:</span>
                  <span>
                    {cartState.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )}
                    ₺
                  </span>
                </div>

                {/* Product Discounts */}
                {cartState.items.some((item) => item.hasProductDiscount) && (
                  <div className="flex items-center justify-between text-sm text-orange-600 dark:text-orange-400">
                    <span>🛍️ Ürün İndirimleri:</span>
                    <span>
                      -
                      {cartState.items
                        .reduce((sum, item) => {
                          if (item.hasProductDiscount) {
                            return (
                              sum +
                              (item.price - item.discountedPrice) *
                                item.quantity
                            );
                          }
                          return sum;
                        }, 0)
                        .toFixed(2)}
                      ₺
                    </span>
                  </div>
                )}

                {/* Bulk Discount */}
                {cartState.bulkDiscount && (
                  <div className="flex items-center justify-between text-sm text-blue-600 dark:text-blue-400">
                    <span>🎯 Toplu İndirim:</span>
                    <span>
                      -
                      {cartState.bulkDiscount.type === "percentage"
                        ? `${(
                            (getSubtotal() * cartState.bulkDiscount.amount) /
                            100
                          ).toFixed(2)}₺`
                        : `${cartState.bulkDiscount.amount}₺`}
                    </span>
                  </div>
                )}

                {/* Coupon Discount */}
                {cartState.coupon && (
                  <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400">
                    <span>🎫 Kupon İndirimi:</span>
                    <span>
                      -
                      {cartState.coupon.discountType === "percentage"
                        ? `${(
                            (getSubtotal() * cartState.coupon.discountValue) /
                            100
                          ).toFixed(2)}₺`
                        : `${cartState.coupon.discountValue}₺`}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-lg font-semibold border-t border-border pt-2">
                  <span>Final Toplam:</span>
                  <span>{getTotal()}₺</span>
                </div>

                {/* Total Savings */}
                {getDiscount() > 0 && (
                  <div className="text-sm text-green-600 dark:text-green-400 text-center pt-2 border-t border-border">
                    🎉 Toplam {getDiscount().toFixed(2)}₺ tasarruf ettiniz!
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={getPaymentButtonAction()}
                disabled={cartState.isLoading}
              >
                {cartState.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>İşleniyor...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>{getPaymentButtonText()}</span>
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
