import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Component/Register/Login/Login";
import Admin from "./Component/Register/Admin/Admin";

import PurchaseDetails from "./Component/Register/User/PurchaseDetails";
import Approval from "./Component/Register/Admin/UserApproval";

import LandingPage from "../src/Component/Register/LandingPage/landingpage";
import ViewProduct from "./Component/Register/Admin/ViewProduct";
import AddProduct from './Component/Register/Admin/AddProduct';
import AddRewards from './Component/Register/Rewards/Rewards';

// import Main from './Component/Register/Login/Login';










function App() {


	return (
<BrowserRouter>
   
   <Routes>
   {<Route path="/landingpage"  element={<LandingPage />} />}
	 <Route path="/" element={<Login />} />
	 <Route path="/admin" element={<Admin />}>
	   <Route path="addProduct" element={<AddProduct />} />
	   {<Route path="viewProduct" exact element={<ViewProduct />} />}
	   {<Route path="approval" exact element={<Approval />} />}
	   {<Route path="purchaseDetails" exact element={<PurchaseDetails />} />}
	{<Route path="addRewards" exact element={<AddRewards />} />}
	    	
	   {/* <Route path="addbook" element={<Addbook />} /> */}
	 </Route>
   </Routes>
 </BrowserRouter>
	

	);
}

export default App;