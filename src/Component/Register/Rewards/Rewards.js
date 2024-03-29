import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ToastContainer, toast } from 'react-toastify';
 import '../Admin/admin.css';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AddRewards( ) {
  const [open1, setOpen1] = React.useState(false);
  const [rewards, setRewards] = useState([]);
  const [open3, setOpen3] = React.useState(false);
  const [error, setError] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);
  const [reamount,  setReAmount] = useState('');
  const [rewardsTotal,  setRewardsTotal] = useState('');



// Storing in local storage


// console.log(rew,"in");
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    rewardAmount: '',
    totalReward: '',
    imageUrl: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    const { companyName, description, rewardAmount, totalReward, imageUrl } = formData;

    if (!companyName || !description || !rewardAmount || !totalReward || !imageUrl) {
      alert('Please fill in all fields before submitting.', 'error');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:3000/rewardadd',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        handleClose1();
        toast('Form data submitted successfully', 'success');
        window.location.reload();
      } else {
        toast.error('Failed to submit form data', 'error');
      }
    } catch (error) {
      toast.error('Error submitting form data: ' + error.message, 'error');
    }
  };

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };
  const handleClose3 = () => {
    setOpen3(false);
  };
  const handleClickOpen3 = () => {
    setOpen3(true);
  };

  
  useEffect(() => {
    const url = `http://localhost:3000/getrewardsdetails`;

    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        setRewards(response.data);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
        setError(error);
      });

  }, []);




  ///claim rewards 


  const currentUser = localStorage.getItem('userData');

  const userData = JSON.parse(currentUser);

  const data = userData.email;
  const role = userData.role;



  console.log(role);
  const handleClose4 = async () => {
    try {
      if (selectedReward) {
        const { rewardAmount, totalReward } = selectedReward;;
        const response = await axios.post(
          'http://localhost:3000/claimreward',
          { rewardAmount, totalReward, currentUser: data },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          toast('Reward claimed successfully');
          window.location.reload();
        } else {
          toast.error('Failed to claim reward');
        }
      }

     
    } catch (error) {
      toast.error('Error claiming reward:', error);
    }
  }

  useEffect(() => {
    const url = `http://localhost:3000/getrewardsTotal/${data}`;
  
   // const url1 = `http://localhost:3000/rewardsTotal/${data}`;

    axios
      .get(url)
      .then((response) => {
        
         const rewardsTotal = response.data;
     
         // Now, you can also set the state if needed
         setRewardsTotal(rewardsTotal);
     
    
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
        setError(error);
      });

    // axios
    //   .get(url1)
    //   .then((response) => {
    //     const totalAmountcardnum = response.data;
    //     const totalAmount1 = totalAmountcardnum[0].rewards

    //     setReAmount(totalAmount1)
    //     // if (totalAmountSpan) {
    //     //   totalAmountSpan.textContent = `${response.data[0].rewards.toFixed(2)}`;
    //     // }
    //   })

  }, []);


  ////
  const handleBuyClick = (reward) => {

    const rewardId = reward.id;
    const rewardLimit = reward.limit; // Set the limit for each reward
    console.log(parseInt(rewardsTotal)) 
console.log(parseInt(reward.rewardAmount));
 
    //   if (
    //     parseInt(reamount) >= parseInt(reward.rewardAmount) &&
    //     (!purchasedRewards[rewardId] || purchasedRewards[rewardId] < rewardLimit)
    //   ) {
    //     // Proceed with purchase logic
    //     setSelectedReward(reward);
    //     console.log(`Purchased ${reward.companyName}`);

    //     // Update the purchased count for the reward
    //     const updatedPurchasedRewards = {
    //       ...purchasedRewards,
    //       [rewardId]: (purchasedRewards[rewardId] || 0) + 1,
    //     };
    //     setPurchasedRewards(updatedPurchasedRewards);
    //     console.log(purchasedRewards);
    //     handleClickOpen3();
    //   } else {
    //     alert('Cannot purchase this reward. Insufficient coins or purchase limit reached.');
    //   }
    // };

 
  
    
    if (parseInt(rewardsTotal) >= parseInt(reward.rewardAmount)) {
      setSelectedReward(reward);
      handleClickOpen3();
    }
    else {
      toast.error('Not enough coins to purchase this reward');
    }
  }

  return (
    <>
  {!role === "3" && (
      <Button variant='outlined' onClick={handleClickOpen1}>Add Rewards</Button>
      )}
      {role === "2" && (
      <Button variant='outlined' onClick={handleClickOpen1}>Add Rewards</Button>
      )}
      <div className="containercoupon">
        <div className="card-row">
          {rewards.map((reward) => (
            <Card key={reward.id} sx={{ maxWidth: 255 ,minWidth:250}}>
              <CardMedia
                component="img"
                alt="no Image"
                height="140"
                image={reward.imageUrl}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {reward.companyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reward.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">{reward.rewardAmount} coin</Button>
               <Button size="small" onClick={() => handleBuyClick(reward)}>Buy</Button> 
                {/* <Button size="small" >Buy</Button> */}
              </CardActions>
            </Card>
          ))}
        </div>
        <Dialog
        open={open3}
        onClose={handleClose3}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are You Sure Do You Want Claim?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
         
            {selectedReward && <h5>Reward Name: {selectedReward.companyName}</h5>}
            {selectedReward && <p>You Will Get {selectedReward.rewardAmount}  Coin After Buying This Coupon</p>}
            {/* { selectedReward &&<span>{selectedReward.totalReward}</span>} */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose3} >Cancel</Button>
          <Button onClick={handleClose4} autoFocus>
            claim
          </Button>
        </DialogActions>
      </Dialog>
        <Dialog
          open={open1}
          onClose={handleClose1}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Add Cards"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <TextField
                    id="companyName"
                    label="Company Name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    maxRows={4}
                  />
                  <TextField
                    id="description"
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                  />
                  <TextField
                    id="rewardAmount"
                    label="Reward Coin"
                    value={formData.rewardAmount}
                    onChange={handleInputChange}
                  />
                  <TextField
                    id="totalReward"
                    label="Reward Limit"
                    value={formData.totalReward}
                    onChange={handleInputChange}
                  />
                  <TextField
                    id="imageUrl"
                    label="Image URL"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose1}>Cancel</Button>
            <Button onClick={handleSubmit} autoFocus>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <ToastContainer />
    </>
  )
}

export default AddRewards;
