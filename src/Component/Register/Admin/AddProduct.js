import React, { useState,useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { Button, Dialog, DialogActions } from '@mui/material';
import Divider from '@mui/material/Divider';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

import './admin.css'
function AddProduct() {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState("");
    const [formData, setFormData] = useState({
        productName: '',
        quantity: '',
        price: '',
        url: '',
        des:'',
        productid: ''
      });
      const [errors, setErrors] = useState({});

      
  const handleClose = () => {
    setOpen(false);
    setErrors({}); // Reset errors when dialog is closed
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Custom validation logic
        const newErrors = {};
        if (!formData.productName) {
          newErrors.productName = 'Product name is required';
        }
        if (!formData.quantity) {
          newErrors.quantity = 'Quantity is required';
        }
        if (!formData.price) {
          newErrors.price = 'Price is required';
        }
        if (!formData.url) {
          newErrors.url = 'URL is required';
        }
        if (!formData.des) {
          newErrors.des = 'Description is required';
        }
        if (!formData.productid) {
          newErrors.productid = 'Product Id required';
        }
        if (Object.keys(newErrors).length > 0) {
          // If there are errors, update state and stop submission
          setErrors(newErrors);
          return;
        }
    
        try {
          const response = await fetch('http://localhost:3000/Addproduce', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          if (!response.ok) {
            toast.error('Failed to submit form');
          }
    
          const responseData = await response.json();
          console.log('Response from backend:', responseData);
          toast("Product Added Sucessfully")
          handleClose(); 
          window.location.reload();
          // Close the dialog after successful submission
        } catch (error) {
          console.error('Error:', error.message);
          // Handle errors here
        }
      };


      useEffect(() => {
        const url = `http://localhost:3000/viewProduct`
               // const url = `http://localhost:3000/api/Statement`;
           
               axios
                 .get(url)
                 .then((response) => {
                   console.log(response.data[0].productName)
                    setProducts(response.data);
                //  const username=response.data[0].name;
                //  const useremail=response.data[0].email;
           
                //  const MobileNum =response.data[0].mobilenumber;
                  
                //  setUserEmail(useremail);
                //  setUserName(username);
                //  setUseremail(MobileNum);
           
                 })
                 .catch((error) => {
                   console.log("Error fetching data:", error);
                   // setError(error);
                 });
      
      
      }, [])
      
  return (
    <div>
         <Button color="primary"  variant="contained" onClick={handleClickOpen} startIcon={<AddIcon />}>Add Product</Button> 
         <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Product</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="productName"
              name="productName"
              label="Product Name"
              fullWidth
              variant="standard"
              value={formData.productName}
              onChange={handleChange}
              error={!!errors.productName}
              helperText={errors.productName}
            />
               <TextField
              autoFocus
              required
              margin="dense"
              id="des"
              name="des"
              label="Description"
              fullWidth
              variant="standard"
              value={formData.des}
              onChange={handleChange}
              error={!!errors.des}
              helperText={errors.des}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="quantity"
              name="quantity"
              label="Quantity"
              fullWidth
              variant="standard"
              value={formData.quantity}
              onChange={handleChange}
              error={!!errors.quantity}
              helperText={errors.quantity}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="price"
              name="price"
              label="Price"
              fullWidth
              variant="standard"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="url"
              name="url"
              label="URL"
              fullWidth
              variant="standard"
              value={formData.url}
              onChange={handleChange}
              error={!!errors.url}
              helperText={errors.url}
            />
              <TextField
              autoFocus
              required
              margin="dense"
              id="productid"
              name="productid"
              label="Product id"
              fullWidth
              variant="standard"
              value={formData.productid}
              onChange={handleChange}
              error={!!errors.productid}
              helperText={errors.productid}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
      <div className="product-container" >
      {Array.isArray(products) && products.length > 0 ? (
      products.map((product) => (
        <Card key={product.id} sx={{ maxWidth: 300 ,}} >
          <CardMedia
            component="img"
            alt="Product Image"
            height="200"
            
            style={{ width: '100%'}} 
            image={product.url }  // Assuming imageUrl is a property of product
          />
          <CardContent>

            <Typography gutterBottom variant="h5" component="div" color="text.primary">
              {product.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.des}
            </Typography>
            
            <Divider />  
          
           
      
          </CardContent>

          <CardActions>
          <Stack direction="row" spacing={3}>
            <Typography variant="body2" color="" fontSize="18px">
            Qty : {product.quantity}
            </Typography>
            <Typography variant="body2" color="" fontSize="18px">
            Price : &#x20B9;{product.price}
            </Typography>
          
        </Stack>
            {/* <Button size="small">Cancel</Button>
            <Button size="small">Add Product</Button> */}
          </CardActions>
        </Card>
      ))

    ) : (
      <Typography variant="body1">No products available</Typography>
    )}
      <ToastContainer />
      </div>


    </div>
  )
}

export default AddProduct