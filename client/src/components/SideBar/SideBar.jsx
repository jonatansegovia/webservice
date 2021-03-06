import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";

import SideBarNested from "./SideBarNested/SideBarNested";
import SideBarOrderPrice from "./SideBarOrderPrice/SideBarOrderPrice";
import SideBarRangePrice from "./SideBarRangePrice/SideBarRangePrice";
import SideBarRangeDate from "./SideBarRangeDate/SideBarRangeDate";
import SideBarOrderRating from "./SideBarOrderRating/SideBarOrderRating";
import SideBarFilterLocaltion from "./SideBarFilterLocation/SideBarFilterLocation";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SortIcon from "@material-ui/icons/Sort";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";

import { setObjGlobal } from "../../redux/actions/index";
import { useDispatch } from "react-redux";

//maneja el ancho de la expansión al tocar el hamburguer button
const drawerWidth = 350;

export default function SideBar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const handleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const handleReset = () => {
    const obj = {
      startRange: "",
      endRange: "",
      category: [],
      page: "0",
      pageSize: "20",
      order: "",
      type: "",
      province: "",
      city: "",
      title: "",
    };
    dispatch(setObjGlobal(obj));
  };

  return (
    <Box>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleDrawer}
      >
        <SortIcon />
      </IconButton>
      <Drawer
        open={open}
        sx={{ width: drawerWidth, opacity: 0.96 }}
        onClose={handleDrawer}
      >
        <SideBarNested openFromFather={open} />
        <Divider />
        <SideBarFilterLocaltion text={"Location filter"} />
        <Divider />
        <SideBarOrderRating text={"Rating order"} />
        <Divider />
        <SideBarOrderPrice text={"Price order"} />
        <Divider />
        <SideBarRangeDate text={"Date order"} />
        <Divider />
        <SideBarRangePrice />
        <Divider />
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{ width: "20%", margin: "10px auto 10px auto" }}
          color="secondary"
        >
          Reset
        </Button>
        <Divider />
        <List>
          {["About"].map((text, index) => (
            <Button key={"about_1"} onClick={() => history.push("/about")}>
              <ListItemText primary={text} />
            </Button>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
