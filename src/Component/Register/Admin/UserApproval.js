import React, { useEffect, useState } from "react";

import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import Button from '@mui/material/Button';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

function Approval() {

  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
 
    { field: 'firstName', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 180 },



    {
      field: 'approve', headerName: 'Action', width: 180,
      renderCell: (params) => (<Button onClick={() => handleUpdate(params.row)}>Approve</Button>)

    },
    
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3000/userdata")
      .then((response) => {
        const formattedRows = response.data.map((row, index) => ({
          id: index + 1,
          ...row,
        }));
        setRows(formattedRows);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
        setError(error);
      });
  }, []);




  const handleUpdate = (row) => {

    const email = row.email;
    const url = `http://localhost:3000/approveuser/${email}`;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }), // Include the email in the request body
    })
      .then(response => {
        if (response.ok) {
          toast('User Approved successfully');
          window.location.reload();
        } else {
          toast.error('Failed to update user approval status');
        }
      })
      .catch(error => {
        console.error('Error during fetch:', error);
      });
  };



  return (
    <>



      <div style={{ height: 600, width: '100%', margin: '50px auto' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}

        />
      </div>
      <ToastContainer />
   
    </>

  )
}

export default Approval;