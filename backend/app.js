
const express = require('express')
const cors = require('cors');
const mqtt = require('mqtt');
const bodyParser = require('body-parser');
const app = express()
const port = 3000
var mysql = require('mysql2');
const fs = require('fs');
const { log } = require('console');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'stackmarket',
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});


const host = 'broker.hivemq.com'
const port1 = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`


const connectUrl = `mqtt://${host}:${port1}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})

const topic = 'access/topic'
const purchasedettails = 'purchase/details'
//  const topic2 = 'mqtt/face/1872722/Rec'


client.on('connect', () => {
  console.log('Connected Mqtt')
  client.subscribe([purchasedettails], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })

})



function registeFace(responseData) {

  const customPromise = new Promise((resolve, reject) => {
    client.publish("mqtt/face/18722", JSON.stringify(responseData), { qos: 0, retain: false }, (error) => {

      client.on('message', async (data, payload) => {
        // console.log('Received Message:');
        // console.log('Received Message:', data, payload.toString());

        if (data == 'mqtt/face/1872722/Ack') {
          console.log("Ack")
          var att = JSON.parse(payload.toString())
          console.log(att.info);
          resolve(att.info);

        }
      })
    });


  });
  return customPromise;
}

app.use(cors());
app.use(bodyParser.json());


app.post('/register', (req, res) => {
  const { firstName, email, password, role } = req.body;


  // Insert the user data into the database
  const query = 'INSERT INTO users (firstName,  email, password, role) VALUES (?, ?, ?,?)';
  connection.query(query, [firstName, email, password, role], (err, results) => {
    if (err) {
      console.error('Error inserting user into the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('User registered successfully');
      res.status(201).json({ message: 'User registered successfully' });
    }
  });
});



///login

app.post('/login', (req, res) => {
  const { email, password } = req.body;


  // Replace 'your_query_here' with your actual query to authenticate the user
  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error executing login query:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length > 0) {
      // Assuming you have a 'role' column in your users table
      const userRole = results[0].role;
      const userstatus = results[0].loginstatus;
      const userEmail = results[0].email;

      res.json({ role: userRole, loginstatus: userstatus, email: userEmail },);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});




app.put('/approveuser/:email', (req, res) => {


  const { email } = req.params;


  // Build the SQL query to update the data
  const query = 'UPDATE users SET loginstatus=? WHERE email = ?';

  // Execute the query with the updated data and ID
  connection.query(query, ["1", email], (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Error updating data in the database' });
    } else {
      res.json({ message: 'Data updated successfully' });
    }
  });
});




app.get('/userdata', (req, res) => {


  const query = 'SELECT * FROM users WHERE role = 3 AND loginstatus = 0;';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Error retrieving data from the database' });
    } else {
      res.json(results);
    }
  });
});






app.post('/Addproduce', (req, res) => {

  const { productid, productName, quantity, price, url, des } = req.body;



  // Insert the user data into the database
  const query = 'INSERT INTO product (productId,productName,quantity, price,url ,des) VALUES (?, ?, ?,?,?,?)';
  connection.query(query, [productid, productName, quantity, price, url, des], (err, results) => {
    if (err) {
      console.error('Error inserting user into the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('User registered successfully');
      res.status(201).json({ message: 'Product Added Sucessfully' });
    }
  });
});






app.get('/viewProduct', (req, res) => {


  const query = 'SELECT * FROM product ';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Error retrieving data from the database' });
    } else {
      res.json(results);
    }
  });
});


app.get('/ProductDetails/:email', (req, res) => {


  const { email } = req.params;
  const currentUser = req.params.email;

  const query1 = `SELECT * FROM users where email='${currentUser}'`;
  connection.query(query1, (error, results) => {

    const firstName = results.length > 0 ? results[0].firstName : null;
    const userName = (firstName);

    const query = `SELECT * FROM orders1 where person='${userName}'`;
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).json({ error: 'Error retrieving data from the database' });
      } else {
        res.json(results);
      }
    });
  });



});


app.get('/minimumStock', (req, res) => {
  const query = 'SELECT productName, quantity FROM product WHERE quantity < 10';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Error retrieving data from the database' });
    } else {
      res.json(results);

    }
  });
});

//// post data in mysql table
app.post('/purchase', (req, res) => {
  const purchase = req.body;

  connection.query('INSERT INTO purchasedetails SET ?', purchase, (error, results, fields) => {
    if (error) {
      console.error('Error storing purchase details: ' + error);
      res.status(500).json({ error: 'Error storing purchase details' });
      return;
    }
    console.log('Purchase details added successfully');
    res.json({ message: 'Purchase details added successfully', data: purchase });
  });
});








client.on('message', (purchasedetails, payload) => {
  console.log('Received Message:', purchasedetails, payload.toString());
  const parsedData = JSON.parse(payload.toString());
const person=(parsedData.person);

function calculateTotalAmount(data) {
  let total = 0;
  data.products.forEach(product => {
    total += product.qty * product.amount;
  });
  return total;
}

// Calculate total amount for John's purchases
const totalAmount = calculateTotalAmount(parsedData);

const purchaseData= totalAmount*0.10;

  parsedData.products.forEach(product => {
    const sql = 'INSERT INTO orders1 (person, product, qty,price ) VALUES (?, ?, ?,? )';
    const values = [parsedData.person, product.name, product.qty ,product.amount];
    
    connection.query(sql, values, (err, result) => {
    //  const query2 = `SELECT * FROM orders1 where person='${person}'`;
    //     connection.query(query2, (error, results2) => {


          const query5 = `SELECT rewards_Total
      FROM orders1
      WHERE person = '${person}' ORDER BY created_at ASC LIMIT 1 ;
      `;

         connection.query(query5, (error, results3) => {
                const updata=(results3[0].rewards_Total );



           const dada6= parseInt(updata);
           console.log(purchaseData,"out")
           let add =dada6+purchaseData;

            const updateQuery = 'UPDATE orders1 SET rewards_Total = ? WHERE person = ? ORDER BY created_at ASC LIMIT 1';
            connection.query(updateQuery, [add, person], (updateError, updateResults) => {
             
             
            });
          });
       // })
    });
    
  });


  
  // Begin transaction
  connection.beginTransaction((transactionError) => {
    if (transactionError) {
      console.error('Error beginning transaction:', transactionError);
      return;
    }

    try {
      parsedData.products.forEach(product => {
        const { name, qty } = product;

        // Select the product from the database
        const selectQuery = 'SELECT * FROM product WHERE productName = ?';
        connection.query(selectQuery, [name], (error, results) => {
          if (error) {
            console.error('Error selecting product from database:', error);
            return connection.rollback(() => {
              console.error('Transaction rolled back due to error in selecting product');
            });
          }

          // Check if the product exists in the database
          if (results.length === 0) {
            console.error(`Product '${name}' not found in the database`);
            return;
          }

          const productName = results[0].productName;
          const currentQty = results[0].quantity;
          const updatedQty = currentQty - qty; // Subtract purchased quantity from current quantity

          // Update the quantity of the product in the database
          const updateQuery = 'UPDATE product SET quantity = ? WHERE productName = ?';
          connection.query(updateQuery, [updatedQty, productName], (updateError, updateResults) => {
            if (updateError) {
              console.error('Error updating product quantity:', updateError);
              return connection.rollback(() => {
                console.error('Transaction rolled back due to error in updating product quantity');
              });
            }
            console.log(`Quantity updated for ${productName}`);
          });
        });
      });

      // Commit the transaction
      connection.commit((commitError) => {
        if (commitError) {
          console.error('Error committing transaction:', commitError);
          return connection.rollback(() => {
            console.error('Transaction rolled back due to error in committing transaction');
          });
        }
        console.log('Transaction committed successfully');
      });
    } catch (error) {
      console.error('Error:', error.message);
      return connection.rollback(() => {
        console.error('Transaction rolled back due to error');
      });
    }
  });
});




////add rewards


app.post('/rewardadd', (req, res) => {


  const { companyName, description, rewardAmount, totalReward, imageUrl } = req.body;

  // Check if all fields are present
  if (!companyName || !description || !rewardAmount || !totalReward || !imageUrl) {
    return res.status(400).json({ error: 'Please fill in all fields before submitting.' });
  }

  // Insert data into MySQL database
  connection.query('INSERT INTO rewards (companyName, description, rewardAmount, totalReward, imageUrl) VALUES (?, ?, ?, ?, ?)',
    [companyName, description, rewardAmount, totalReward, imageUrl],
    (error, results) => {
      if (error) {
        console.error('Error inserting data into database:', error);
        return res.status(500).json({ error: 'Failed to submit form data.' });
      }
      res.status(200).json({ message: 'Form data submitted successfully' });
    });
});


///total Rewards in user 

app.get('/getrewards/:email', (req, res) => {


  const { email } = req.params;
  const currentUser = req.params.email;

  const query1 = `SELECT * FROM users where email='${currentUser}'`;
  connection.query(query1, (error, results) => {

    const firstName = results.length > 0 ? results[0].firstName : null;
    const userName = (firstName);

    const query2 = `SELECT * FROM orders1 where person='${userName}'`;
    connection.query(query2, (error, results2) => {


      const query = `SELECT rewards_Total
               FROM orders1
               WHERE person = '${userName}' 
               ORDER BY created_at ASC
               LIMIT 1;
              `;

      connection.query(query, (error, results3) => {

        //  const updatedQty=(results3[0].rewards_Total);

        //  console.log(rewardsPoint);
        res.json(results3);



      });
    });
  });
});







app.get('/getrewardsdetails', (req, res) => {

  const query = `SELECT * FROM rewards `;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Error retrieving data from the database' });
    } else {
      res.json(results);
    }
  });
});






app.get('/getrewardsTotal/:email', (req, res) => {

  const { email } = req.params;
  const currentUser = req.params.email;

  const query1 = `SELECT * FROM users where email='${currentUser}'`;
  connection.query(query1, (error, results) => {

    const firstName = results.length > 0 ? results[0].firstName : null;
    const userName = (firstName);

    const query = `SELECT SUM(rewards_Amount) AS total_value
        FROM orders1
        WHERE person = '${userName}';
        `;
    connection.query(query, (error, results3) => {

      const updatedQty = (results3[0].total_value);

      if (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).json({ error: 'Error retrieving data from the database' });
      } else {
        res.json(updatedQty);
      }




    });
  });
});




///claim rewards


app.post('/claimreward', async (req, res) => {



  try {
    const { rewardAmount, totalReward, currentUser } = req.body;


    const query1 = `SELECT * FROM users where email='${currentUser}'`;
    connection.query(query1, (error, results) => {

      const firstName = results.length > 0 ? results[0].firstName : null;
      const userName = (firstName);



    
      const query = `SELECT rewards_Total
      FROM orders1
      WHERE person = '${userName}' ORDER BY created_at ASC LIMIT 1; `;
      connection.query(query, (error, results3) => {

       //  console.log(results3[0].rewards_Total,"hi");

        const updateRewards = (results3[0].rewards_Total);


  const BuyRewards = (updateRewards - rewardAmount);
   console.log(BuyRewards)
   
        const updateQuery = 'UPDATE orders1 SET rewards_Total = ? WHERE person = ? ORDER BY created_at ASC LIMIT 1;';
        connection.query(updateQuery, [BuyRewards, userName], (updateError, updateResults) => {
          if (updateError) {
            console.error('Error updating product quantity:', updateError);
            return;
          }
          res.json(updateResults);
        });


      });

    })
  


  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




// {
//   "person": "user",
//   "products": [
//     {
//       "name": "brush",
//       "qty": 2,
//       "amount": 44
//     },
//     {
//       "name": "paste",
//       "qty": 2,
//       "amount": 20
//     },
//     {
//       "name": "chips",
//       "qty": 1,
//       "amount": 20
//     },
//     {
//       "name": "biscuit",
//       "qty": 1,
//       "amount": 30
//     }
//   ],
//   "total_amount": 146
// }
// {"person":"John","total_amount":82,"products":[{"name":"brush","qty":1,"amount":22},{"name":"paste","qty":1,"amount":10},{"name":"chips","qty":1,"amount":20},{"name":"biscuit","qty":1,"amount":30}]}











// client.on('message', (purchasedettails, payload) => {
//   console.log('Received Message:', purchasedettails, payload.toString());

//   try {
//     const parsedData = JSON.parse(payload.toString());

//     //Check if parsedData is an object
//     if (typeof parsedData !== 'object') {
//       throw new Error('Invalid JSON data: Parsed data is not an object');
//     }
//     const formattedData = {
//       person: parsedData.person,
//       total_amount: parsedData.total_amount,
//       products: parsedData.products.map(product => {
//         const totalAmount = product.qty * product.amount;
//         const rewardsPoints = totalAmount * 0.10;

//         return {
//           ...product,
//           totalAmount,
//           rewardsPoints
//         };
//       })
//     };
//     const totalRewardsPoints = formattedData.products.reduce((total, product) => {
//       return total + product.rewardsPoints;

//     }, 0);


//     console.log("Total rewards points:", totalRewardsPoints);

//     // Assuming parsedData is an object with purchase details
//     const { person, products, total_amount, totalAmount, rewardsPoints } = formattedData;



//     // Check if required fields are present
//     if (!person || !Array.isArray(products) || !total_amount) {
//       throw new Error('Invalid JSON data: Required fields are missing');
//     }

//     const insertQuery = 'INSERT INTO orders1 (person, product, qty, price, total, total_amount, rewards_amount) VALUES (?, ?, ?, ?, ?, ?, ?)';

//     // Iterate over each product and insert its details into the database
//     products.forEach(product => {
//       const values = [person, product.name, product.qty, product.amount, product.totalAmount, total_amount, product.rewardsPoints];

//       // Insert product details into the database
//       connection.query(insertQuery, values, (insertError, insertResults) => {

//         const query2 = `SELECT * FROM orders1 where person='${person}'`;
//         connection.query(query2, (error, results2) => {


//           const query = `SELECT SUM(rewards_Amount) AS total_value
//       FROM orders1
//       WHERE person = '${person}';
//       `;

//           connection.query(query, (error, results3) => {
//             const updatedQty = (results3[0].total_value);
//             const updateQuery = 'UPDATE orders1 SET rewards_Total = ? WHERE person = ?';
//             connection.query(updateQuery, [updatedQty, person], (updateError, updateResults) => {
             
             
//             });
//           });
//         });

//       });
//     });

//     products.forEach(product => {
//       const { name, qty } = product;

//       // Select the product from the database
//       const selectQuery = `SELECT * FROM product WHERE productName = '${name}'`;
//       connection.query(selectQuery, (error, results) => {
//         if (error) {
//           console.error('Error selecting product from database:', error);
//           return;
//         }

//         // Check if the product exists in the database
//         if (results.length === 0) {
//           console.error(`Product '${name}' not found in the database`);
//           return;
//         }

//         const productName = results[0].productName;
//         const currentQty = results[0].quantity;
//         const updatedQty = currentQty - qty; // Subtract purchased quantity from current quantity

//         // Update the quantity of the product in the database
//         const updateQuery = 'UPDATE product SET quantity = ? WHERE productName = ?';
//         connection.query(updateQuery, [updatedQty, productName], (updateError, updateResults) => {
//           if (updateError) {
//             console.error('Error updating product quantity:', updateError);
//             return;
//           }
//           console.log(`Quantity updated for ${productName}`);
//         }); `1`
//       });
//     });
//   } catch (error) {
//     console.error(error.message);
//   }
// });


