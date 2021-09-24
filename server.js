require('dotenv').config({ path: '.env' })
const express = require('express');
const app = express();
const fs = require('fs');  
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripeSecretKey = process.env.STRIPE_PRIVATE_KEY;
const stripe = require('stripe')(stripeSecretKey);

app.use(express.json());
app.set('view engine','ejs');    //setting view engine to EJS
app.use(express.static('public'));//telling the app to look for the front-end files in public folder

app.get('/', (req,res) =>{
    res.render('index.ejs',{
        stripePublicKey : stripePublicKey
    }) //rendering the index page
})

app.get('/drinks', (req,res) =>{
    fs.readFile('items.json', (error,data)=>{    //reading list.json file
        if(error){
            res.status(500).end();
        }else{
            res.render('cdrinks.ejs',{ //rendering index page
                stripePublicKey : stripePublicKey,  //sending stripe public key to front-end
                items: JSON.parse(data) //parse the json data to items
            })
        }
    })
})


app.post('/drinks', function(req,res){
    fs.readFile('items.json', (error,data)=>{    //reading list.json file
        if(error){
            res.status(500).end();
        }else{
            var itemJson = JSON.parse(data);   
            var itemArray = itemJson.cold.concat(itemJson.hot).concat(itemJson.top10)  //combine all the categories.
            var total = 0;
            req.body.itemList.forEach(function(item){
                const itemJson = itemArray.find(function(i){   //finding the item in the array
                   return i.id == item.id; //returning the id from the item
                    //if the id on the iq matches the id on the request then it will output the json for that item
                })
                total = total  + itemJson.price  //getting the total amount 
            })

            stripe.charges.create({ //.create will return a promise.
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'aud'
            }).then(function(){ //if promise returns success
                console.log("charged success");
                res.json({message: 'Your drinks have been ordered.'})        //sending json back to the front-end
            }).catch(function(){
                console.log("Charge failed");
                res.status(500).end();
            })
        }
    })
})


app.listen(3000, () =>{
    console.log("Connected to the server");
})