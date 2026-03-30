import {
  createContext,
  useContext,
  useState,
} from "react";

const StoreContext = createContext(null);

const getDefaultCart = () => ({
  cartItems: [],
  shippingAddress: {},
  paymentMethod: "COD",
});

const normalizeCartItem = (item = {}) => ({
  product: item.product || item._id || "",
  name: item.name || "",
  image: item.image || item.imageUrl || item.imageUrls?.[0] || "",
  price: Number(item.price) || 0,
  size: Number(item.size ?? item.selectedSize) || 0,
  quantity: Math.max(Number(item.quantity ?? item.qty) || 1, 1),
  stock: Math.max(Number(item.stock) || 0, 0),
});

const normalizeCart = (cart = {}) => ({
  ...getDefaultCart(),
  ...cart,
  cartItems: Array.isArray(cart.cartItems)
    ? cart.cartItems
        .map(normalizeCartItem)
        .filter((item) => item.product && item.name && item.size)
    : [],
  shippingAddress: cart.shippingAddress || {},
  paymentMethod: cart.paymentMethod || "COD",
});

const persistCart = (nextCart) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(nextCart));
  }
};

const getStoredCart = () => {
  if (typeof window === "undefined") {
    return getDefaultCart();
  }

  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? normalizeCart(JSON.parse(storedCart)) : getDefaultCart();
  } catch (_error) {
    localStorage.removeItem("cart");
    return getDefaultCart();
  }
};

function StoreProvider({ children }) {
  const [cart, setCartState] = useState(getStoredCart);

  const updateCart = (nextCartOrUpdater) => {
    setCartState((prevCart) => {
      const nextCart = normalizeCart(
        typeof nextCartOrUpdater === "function"
          ? nextCartOrUpdater(prevCart)
          : nextCartOrUpdater
      );

      persistCart(nextCart);
      return nextCart;
    });
  };

  const addToCart = (item) => {
    const nextItem = normalizeCartItem(item);

    updateCart((prevCart) => {
      const existingItem = prevCart.cartItems.find(
        (cartItem) =>
          cartItem.product === nextItem.product && cartItem.size === nextItem.size
      );

      const cartItems = existingItem
        ? prevCart.cartItems.map((cartItem) => {
            if (
              cartItem.product !== nextItem.product ||
              cartItem.size !== nextItem.size
            ) {
              return cartItem;
            }

            const mergedQuantity = cartItem.quantity + nextItem.quantity;
            const cappedQuantity = nextItem.stock
              ? Math.min(mergedQuantity, nextItem.stock)
              : mergedQuantity;

            return {
              ...cartItem,
              ...nextItem,
              quantity: cappedQuantity,
            };
          })
        : [
            ...prevCart.cartItems,
            nextItem.stock
              ? {
                  ...nextItem,
                  quantity: Math.min(nextItem.quantity, nextItem.stock),
                }
              : nextItem,
          ];

      return {
        ...prevCart,
        cartItems,
      };
    });
  };

  const removeCartItem = (productId, size) => {
    updateCart((prevCart) => ({
      ...prevCart,
      cartItems: prevCart.cartItems.filter(
        (item) => !(item.product === productId && item.size === Number(size))
      ),
    }));
  };

  const updateCartItemQuantity = (productId, size, quantity) => {
    const normalizedQuantity = Number(quantity);

    if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) {
      removeCartItem(productId, size);
      return;
    }

    updateCart((prevCart) => ({
      ...prevCart,
      cartItems: prevCart.cartItems.map((item) => {
        if (item.product !== productId || item.size !== Number(size)) {
          return item;
        }

        const cappedQuantity = item.stock
          ? Math.min(normalizedQuantity, item.stock)
          : normalizedQuantity;

        return {
          ...item,
          quantity: cappedQuantity,
        };
      }),
    }));
  };

  const saveShippingAddress = (shippingAddress) => {
    updateCart((prevCart) => ({
      ...prevCart,
      shippingAddress,
    }));
  };

  const savePaymentMethod = (paymentMethod) => {
    updateCart((prevCart) => ({
      ...prevCart,
      paymentMethod,
    }));
  };

  const clearCartItems = () => {
    updateCart((prevCart) => ({
      ...prevCart,
      cartItems: [],
    }));
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        updateCart,
        addToCart,
        removeCartItem,
        updateCartItemQuantity,
        saveShippingAddress,
        savePaymentMethod,
        clearCartItems,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return context;
};

export { StoreProvider, useStore };
