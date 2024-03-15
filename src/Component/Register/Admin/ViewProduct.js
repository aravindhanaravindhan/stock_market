
import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";


const columns = [
    // { field: 'id', headerName: 'ID', width: 70 },
    { field: 'productName', headerName: 'ProductName', width: 200 },
    { field: 'des', headerName: 'Description', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 200 },
    { field: 'price', headerName: 'Price', width: 200 },
   
    
  ];

function ViewProduct() {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(null);
      useEffect(() => {
          axios
            .get("http://localhost:3000/viewProduct")
            .then((response) => {
              // const formattedRows = response.data.map((row, index) => ({
              //   id: index + 1,
              //   ...row,
              // }));
              console.log(response.data);
              setRows(response.data);
            })
            .catch((error) => {
              console.log("Error fetching data:", error);
              setError(error);
            });
        }, []);
  return (
     <div style={{ height: 600, width: '100%', marginTop:'50px'  }}>
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
  )
}

export default ViewProduct



