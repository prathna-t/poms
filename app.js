let express = require('express');
let path = require("path");

//import mongoose
// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;//access to mongodb client
const mongoose = require('mongoose');

//URL mongoose
let url='mongodb://localhost:27017/parcelDB';
// const url = 'mongodb://localhost:27017/';//comes with default port numbers

//Config
let app = express();
app.listen(8080);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.urlencoded({extended: true}));


app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));//express.static is a middleware
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use(express.static("public/images"));
app.use(express.static("public/css"));


//referencing schema
const Parcel = require('./models/parcel');


// let db;
// let col;

// MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) { //reference to client to connect to dagtabases
//     if (err) { //not null
//         console.log('Err  ', err);
//     } else { 
//         console.log("Connected successfully to server");
//         db = client.db('Week5Lab'); //give me a reference to this database
//         col = db.collection('fleet');
//     }
// });

//CONNECT TO MONGOOSE 

mongoose.connect(url,function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }

    console.log('Successfully connected');



//Endpoints
app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,"views/index.html"));
});


//TASK 1.1 - ADD PARCEL

app.get('/addparcel',function(req,res){
    res.sendFile(path.join(__dirname,"views/addparcel.html"));
});


app.post("/addparcelpost", function(req,res){
   let newParc = req.body;
   let newSender = req.body.sender;
   let newAddress = req.body.address;
   let newWeight = parseInt(req.body.weight);
   let newFragile = req.body.fragile;

//    col.insertOne({sender:newSender,address:newAddress, weight: newWeight, fragile:newFragile});
let parcel1 = new Parcel({
    _id: mongoose.Types.ObjectId(),
    sender: newSender,
    address: newAddress,
    weight: newWeight,
    fragile: newFragile,
});

parcel1.save(function (err) {
    if (err) throw err;

    console.log('Parcel successfully Added to DB');

    res.redirect("/getparcels");
   
    });
});

});

//TASK 1.2 - DELETE BY ID
app.get('/delparcel', function(req,res){
    res.sendFile(path.join(__dirname,"views/delparcel.html"));
});

app.post('/delparcelpost', function(req,res){
    let id = req.body.id;
    console.log('Success'+ id);

    // col.deleteOne({_id:mongodb.ObjectId(id)},function(err,result){
    //     // res.send(result);
    //     res.redirect("/getparcels");
    // });

    Parcel.deleteOne({_id: id}, function (err, doc) {
        console.log(doc);
        res.redirect("/getparcels");
    });

});


//TASK 1.3 - UPDATE PARCEL BY ID

app.get('/updateparcel', function(req,res){
    res.sendFile(path.join(__dirname,"views/updateparcel.html"));
});

app.post('/updateparcelpost', function(req,res){
    
    let id = req.body.id;
    let newSender = req.body.sender;
    let newAddress = req.body.address;
    let newWeight= parseInt(req.body.weight);
    let newFragile = req.body.fragile;

   
    // col.findOne({_id:mongodb.ObjectId(id)}, function(err,result){
    //         col.updateOne({_id:mongodb.ObjectId(id)},{$set:{sender: newSender, address: newAddress, weight:newWeight, fragile:newFragile}}, function(err,result){
    //             res.redirect('/getparcels');

    //         });
        
    // }); 

    Parcel.updateOne({_id:id}, { $set:{sender: newSender, address: newAddress, weight:newWeight, fragile:newFragile} }, function (err, doc) {
        res.redirect('/getparcels');
    });


});


//TASK 2.1- LIST ALL PARCELS

app.get('/getparcels',function(req,res){
    // col.find({}).toArray(function(err,data){
    //     res.render("listparcels.html", {fleet:data});
    // })

    Parcel.find({}, {}, function (err, docs) {
        res.render("listparcels.html", {parcel:docs});
        console.log(docs);
      });
   
});

//TASK 2.2- LIST ALL PARCELS BY SENDER
app.get('/getparcelssender',function(req,res){
    // col.find({}).toArray(function(err,data){
    //     res.render("listparcels.html", {fleet:data});
    // })

    Parcel.find({}).exec(function (err, data) {
        res.render("listparcelssender.html", {parcelS:data});
    });
   
});

//TASK 2.3- LIST ALL PARCELS BY WEIGHT RANGE
app.get('/getparcelsweight',function(req,res){
    // col.find({}).toArray(function(err,data){
    //     res.render("listparcels.html", {fleet:data});
    // })
   
      Parcel.find({}).exec(function (err, data) {
        res.render("listparcelsweight.html", {parcelW:data});
    });
   
});




// //extra task
// app.get('/updatesenderweight', function(req,res){
//     res.sendFile(path.join(__dirname,"views/updatesenderweight.html"));
// });


// app.post('/updatesenderweightpost', function(req,res){
//     let newWeight = parseInt(req.body.weight);
//     let newSender = req.body.sender;

    
//     col.updateMany({$inc: {newWeight : 5}}, {$set:{sender: "Sender" + newSender}},{upsert: true}, function(err,result){
//         res.redirect('/getparcels');
//     });
   
// });


// app.get('*', function(req, res){
//     res.sendFile(path.join(__dirname,"views/404.html"));
