
const express = require('express')
const cors = require('cors');
const mqtt = require('mqtt');
const bodyParser = require('body-parser');
const app = express()
const port = 3000
var mysql = require('mysql2');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database: 'stackmarket',
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
   });


   const host = 'broker.emqx.io'
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
   const face_topic = 'face/topic'
  //  const topic2 = 'mqtt/face/1872722/Rec'
   
   
   client.on('connect', () => {
       console.log('Connected Mqtt')
       client.subscribe([face_topic], () => {
           console.log(`Subscribe to topic '${topic}'`)
       })
      
   })
   client.on('message', (face_topic, payload) => {
       console.log('Received Message:', face_topic, payload.toString())
   
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
    const { firstName,email, password,role } = req.body;

  console.log(req.body);
    // Insert the user data into the database
    const query = 'INSERT INTO users (firstName,  email, password, role) VALUES (?, ?, ?,?)';
    connection.query(query, [firstName,  email, password,  role], (err, results) => {
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
console.log(email, password);
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
      res.json({ role: userRole ,loginstatus:userstatus});
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});


  app.post('/publish', (req, res) => {
    if (client) {
      const messageToPublish = "start"; // Replace with the message you want to publish
      client.publish(topic, messageToPublish, () => {
        const responseMessage = ` ${messageToPublish}`;
        console.log(responseMessage);
        // ending data to the frontend
        const responseData = {
          topic: topic,
          message: messageToPublish,
          response: responseMessage
        };
  
        res.status(200).json(responseData);
      });
    } else {
      res.status(400).send('Not subscribed to MQTT topic');
    }
  });
  
//

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

app.get('/addtime', (req, res) => {
    

  const query = 'SELECT * FROM users WHERE role = 3 AND loginstatus = 1;';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Error retrieving data from the database' });
    } else {
      res.json(results);
    }
  });
});



///app.put('/updateTimes', (req, res) => {
  app.put('/updateTimes', (req, res) => {
    const { email, startTime, endTime } = req.body;
  console.log(req.body);
    // Check if all required data is provided
   
      // Update the times in the MySQL database
      const query = 'UPDATE users SET startTime = ?, endTime = ? WHERE email = ?';
      connection.query(query, [startTime, endTime, email], (err, result) => {
        if (err) {
          console.error('Error updating record in MySQL:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Record updated in MySQL');
          res.status(200).json({ message: 'Record successfully updated' });
        }
      });
   
  });




  app.post('/Addproduce', (req, res) => {
    console.log();
    const { productName,quantity, price,url ,des} = req.body;

  console.log(req.body);
    // Insert the user data into the database
    const query = 'INSERT INTO product (productName,quantity, price,url ,des) VALUES (?, ?, ?,?,?)';
    connection.query(query, [productName,quantity, price,url ,des], (err, results) => {
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



  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })    