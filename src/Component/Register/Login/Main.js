import React from 'react'
import Land from '../Login/land.svg'
import { makeStyles } from '@material-ui/core/styles';
import Shop from '../Login/shop.svg'
import { Button } from '@mui/material';
const useStyles = makeStyles((theme) => ({
    main: {
      width: '90%',
      top:'150px',
      height: '100vh', 
      position:"fixed",
      backgroundSize: 'cover', // Make sure the background image covers the entire element
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      justifyContent: 'center', // Center content horizontally
      alignItems: 'center', // Center content vertically
    },
    // head:{
    //     textAlign:'center',
    //   width:'850px',
    //   marginTop:'40px',
    //   fontFamily:'',
    //   fontSize :'50px',
    //   fontFamily: "'Roboto', 'Gill Sans MT', 'Calibri', 'Trebuchet MS', sans-serif",
    //   fontweight: '600'

   // },
    // sub:{
   
    //    marginTop:'15px',
    //    color:"blue",
    //    color: 'rgb(128, 217, 97)'
    // },
    btnn:{
      
            // color: #ad3737;
            // font-family: "Roboto", Sans-serif;
            // font-size: 38px;
           
    
    
    },

   
  }));
  
function Main() {
    const classes = useStyles();
  return (
    <div> 

       <section>
        <div className={classes.main} >
        <img src={Land}></img>
        {/* <div  className={classes.head}>
          <div className={classes.title}>
        <h2 className={classes.head}>Lorem ipsum dolor sit amet </h2>
        <h6 className={classes.sub}>   Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam ut sunt q </h6>
        <Button variant="outlined"  className={classes.btnn}>Shop Now</Button>
        </div> 
        </div> */}

          {/* <img src={Shop}></img> */}
        </div>
       </section>   
    </div>
  )
}

export default Main