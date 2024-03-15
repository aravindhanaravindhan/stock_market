import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Outlet, Link } from 'react-router-dom';
import Footer from './Footer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid } from '@mui/x-data-grid';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import axios from "axios";
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ApprovalIcon from '@mui/icons-material/Approval';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [currentUserData, setcurrenUser] = useState("");
  const [minimumQty, setMinimumQty] = useState("");
  const [rows, setRows] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [rewardsTotal, setrewardsTotal] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const currentUser = localStorage.getItem('userData');

  const userData = JSON.parse(currentUser);

  const data = userData.email;
  const role = userData.role;
  console.log(role);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };


  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'productName', headerName: 'Product Name', width: 240 },
    { field: 'quantity', headerName: 'Qty', width: 130 },

  ];




  useEffect(() => {
    axios
      .get("http://localhost:3000/minimumStock")
      .then((response) => {
        const formattedRows = response.data.map((row, index) => ({
          id: index + 1,
          ...row,
        }));

        setRows(formattedRows);
        setMinimumQty(formattedRows.length);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
        setError(error);
      });
  }, []);


  useEffect(() => {
    axios
  
      .get(`http://localhost:3000/getrewards/${data}`)
      .then((response) => {
      
        setRewards(response.data);
        console.log(response.data);
        setrewardsTotal(response.data[0].rewards_Total);
     
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
        setError(error);
      });
  }, []);

 
// console.log(rewards[0].rewards_Total);
  // const  = rewardss.email;
  // const role = userData.role;

//const rewards_point=(rewards[0].rewards_Total,"hdgvsy");

  const drawer = (
    <div  style={{
      backgroundColor:"rgb(2,155,245)",
 
    }}>
      <Toolbar  sx={{
          backgroundColor:"rgb(2,155,245)",
     
        }} />
      <Divider   />
      <nav aria-label="main mailbox folders">
        <List>
          {role === "1" && (
            <>
             <ListItem  className='menu-item'disablePadding>
                <ListItemButton component={Link} to="/admin/addProduct" className='menu-item' >
                <ListItemIcon>
                <InventoryIcon  />
              </ListItemIcon>
                  <ListItemText primary="Add Product" />
                </ListItemButton>
              </ListItem>
               <ListItem  className='menu-item'disablePadding>
                <ListItemButton component={Link} to="/admin/viewProduct"  className='menu-item' >
                <ListItemIcon>
                <ProductionQuantityLimitsIcon   />
              </ListItemIcon>
                  <ListItemText primary="View Product" />
                </ListItemButton>
              </ListItem>
               <ListItem  className='menu-item'disablePadding>
                <ListItemButton component={Link} to="/admin/approval"  className='menu-item' >
                <ListItemIcon>
                <ApprovalIcon   />
              </ListItemIcon>
                  <ListItemText primary="User Approval" />
                </ListItemButton>
              </ListItem>
            </>
          )}
          {role === "3" && (
            <>
               <ListItem  className='menu-item'disablePadding>
                <ListItemButton component={Link} to="/admin/purchaseDetails"  className='menu-item' >
                <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
                  <ListItemText primary="Purchase Details" />
                </ListItemButton>
              </ListItem>
               <ListItem  className='menu-item'disablePadding>
                <ListItemButton component={Link} to="/admin/addRewards"  className='menu-item' >
                   <ListItemIcon>
                <MilitaryTechIcon  />
              </ListItemIcon>
                  <ListItemText primary="Claim Rewards" />
                </ListItemButton>
              </ListItem>
            
            </>

          )}
           {role === "2" && (
            <>
              {/*  <ListItem  className='menu-item'disablePadding>
                <ListItemButton component={Link} to="/admin/purchaseDetails">
                  <ListItemText primary="Purchase Details" />
                </ListItemButton>
              </ListItem> */}
               <ListItem  className='menu-item'disablePadding>
                <ListItemButton component={Link} to="/admin/addRewards"  className='menu-item' >
                <ListItemIcon>
                <BookmarkAddIcon  />
              </ListItemIcon>
                  <ListItemText primary="Add Rewards" />
                </ListItemButton>
              </ListItem>
            </>

          )}
           <ListItem  className='menu-item'disablePadding>
            <ListItemButton component={Link} to="/"  className='menu-item' >
              <ListItemIcon>
                <LogoutIcon/>
              </ListItemIcon>
              <ListItemText primary="Log Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </div>
  )
  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          backgroundColor:"rgb(2,155,245)",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Stock Management
          </Typography>
          <h5>{data}</h5>
          {role === "1" && (
            <MenuItem>
              <IconButton
                size="large"
                aria-label="show notifications"
                color="inherit"
                onClick={handleClickOpen}
              >
                <Badge badgeContent={minimumQty} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </MenuItem>
          )}
            {role === "3" && (
            <MenuItem>
              <IconButton
                size="large"
                aria-label="show notifications"
                color="inherit"
                // onClick={handleClickOpen1}
              >
               
                  <EmojiEventsIcon />
              <h5>{rewardsTotal}</h5>
              </IconButton>
            </MenuItem>
         )} 
        </Toolbar>
      </AppBar>

      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Out of Stock Details"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}


              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>

          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block',},
           
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth   , backgroundColor:"rgb(2,155,245)", color:"white" ,},
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
        {/* <Footer /> */}
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
