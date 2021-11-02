import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartList from "./CartList";
import { useSelector } from "react-redux";

function Cart() {
  const [openCart, setOpenCart] = useState(false);
  const [total, setTotal] = useState(0);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    setTotal(() => {
      let count = 0;
      cart.forEach((s) => {
        count += s.price;
      });
      return count;
    });
  }, [cart]);

  const handleCart = () => {
    setOpenCart((prev) => !prev);
  };

  return (
    <Box>
      <IconButton onClick={handleCart}>
        <Badge color="secondary" badgeContent={cart.length}>
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <Drawer anchor="right" open={openCart}>
        <CartList cart={cart} />
        <Divider sx={{ marginTop: "auto", width: "370px" }} />
        <Typography
          variant="h4"
          component="div"
          gutterBottom
          sx={{ ml: "auto", mr: "auto" }}
        >
          {`Total $${total ? total : 0}`}
        </Typography>
      </Drawer>
    </Box>
  );
}

export default Cart;
