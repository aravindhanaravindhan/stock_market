import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import axios from "axios";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from "@mui/material";
const TAX_RATE = 0.07;

function ccyFormat(num) {
  const parsedNum = parseFloat(num);
  if (isNaN(parsedNum)) {
    return '0.00';
  }
  return parsedNum.toFixed(2);
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(product, qty, amount, totalAmount) {
  return { product, qty, amount, totalAmount };
}

function subtotal(items) {
  return items.map(({ totalAmount }) => totalAmount).reduce((sum, i) => sum + i, 0);
}

export default function SpanningTable() {
  const [rows, setRows] = useState([]);
  const [subtotalValue, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = localStorage.getItem('userData');
  const userData = JSON.parse(currentUser);
  const email=userData.email;

  useEffect(() => {
    axios
    .get(`http://localhost:3000/ProductDetails/${email}`)
      .then((response) => {
        const formattedRows = response.data.map((row, index) => ({
          id: index + 1,
          ...row,
          totalAmount: row.qty * row.price, // Calculate total amount
        }));
        setRows(formattedRows);
        const subTotal = subtotal(formattedRows);
        console.log(subTotal);
        console.log();
        const taxes = TAX_RATE * subTotal;
        const totalPrice = subTotal + taxes;
        const rewardsPoint=totalPrice * 0.10
       
        setRewards(rewardsPoint)
        setSubtotal(subTotal);
        setTax(taxes);
        setTotal(totalPrice);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  // Filter rows based on date range
// Filter rows based on date range
// Filter rows based on date range
const filteredRows = rows.filter(row => {
  if (startDate && endDate) {
    const rowDate = new Date(row.created_at);
    const rowDateString = rowDate.toISOString().substring(0, 10); // Convert to "yyyy-MM-dd" format
    const startDateString = startDate.toISOString().substring(0, 10); // Convert to "yyyy-MM-dd" format
    const endDateString = endDate.toISOString().substring(0, 10); // Convert to "yyyy-MM-dd" format
    return rowDateString >= startDateString && rowDateString <= endDateString;
  }
  return true;
}).filter(row =>
  row.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
  row.qty.toString().includes(searchQuery.toLowerCase()) ||
  row.amount.toString().includes(searchQuery.toLowerCase()) ||
  row.totalAmount.toString().includes(searchQuery.toLowerCase()) ||
  row.created_at.includes(searchQuery) // Search by exact date string
);
const handleClearFilters = () => {
  setStartDate(null);
  setEndDate(null);
  setSearchQuery("");
};
const generatePDF = () => {
  const doc = new jsPDF();

  const columns = [
    { title: "Date", dataKey: "created_at" },
    { title: "Product", dataKey: "product" },
    { title: "Qty", dataKey: "qty" },
    { title: "Price", dataKey: "price" },
    { title: "Total Amount", dataKey: "totalAmount" },
  ];

  const tableData = rows.map(row => ({
    created_at: row.created_at,
    product: row.product,
    qty: row.qty,
    price: ccyFormat(row.price),
    totalAmount: ccyFormat(row.totalAmount)
  }));

  doc.autoTable({
    head: [columns.map(column => column.title)],
    body: tableData.map(row => columns.map(column => row[column.dataKey])),
  });

  doc.save("table_data.pdf");
};


  return (
    <>
    <div>
   
      <label>Start Date: </label>
      <input
  type="date"
  value={startDate ? startDate.toISOString().substring(0, 10) : ''}
  onChange={e => setStartDate(new Date(e.target.value))}
/>

      <label>End Date: </label>
      <input
  type="date"
  value={endDate ? endDate.toISOString().substring(0, 10) : ''}
  onChange={e => setEndDate(new Date(e.target.value))}
/>

      <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      <button onClick={handleClearFilters}>Clear Filters</button>
      <Button onClick={generatePDF} variant="outlined" >Generate PDF</Button>
    </div>
   
<TableContainer component={Paper}>
  <Table sx={{ minWidth: 700 }} aria-label="spanning table">
    <TableHead>
      <TableRow>
        <TableCell align="center" colSpan={4}>
          Details
        </TableCell>
        <TableCell align="right">Price</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Date</TableCell>
        <TableCell>Product</TableCell>
        <TableCell align="right">Qty</TableCell>
        <TableCell align="right">Amount</TableCell>
        <TableCell align="right">Total Amount</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredRows.map((row) => (
        <TableRow key={row.id}>
          <TableCell>{row.created_at}</TableCell>
          <TableCell>{row.product}</TableCell>
          <TableCell align="right">{row.qty}</TableCell>
          <TableCell align="right">{ccyFormat(row.price)}</TableCell>
          <TableCell align="right">{ccyFormat(row.totalAmount)}</TableCell>
        </TableRow>
      ))}
      <TableRow>
        <TableCell colSpan={3}>Subtotal</TableCell>
        <TableCell align="right" colSpan={2}>{ccyFormat(subtotal(filteredRows))}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={3}>Tax ({(TAX_RATE * 100).toFixed(0)} %)</TableCell>
        <TableCell align="right" colSpan={2}>{ccyFormat(tax)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={3}>Total</TableCell>
        <TableCell align="right" colSpan={2}>{ccyFormat(total)}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>

    </>
  );
}
