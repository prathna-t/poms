let express = require('express');
let path = require("path");
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;//access to mongodb client

const url = 'mongodb://localhost:27017/';//comes with default port numbers

//Config
let app = express();
app.listen(8080);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.urlencoded({extended: true}));


app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use(express.static("public/images"));
app.use(express.static("public/css"));


let db;
let col;

MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) { //reference to client to connect to dagtabases
    if (err) { //not null
        console.log('Err  ', err);
    } else { 
        console.log("Connected successfully to server");
        db = client.db('Week5Lab'); //give me a reference to this database
        col = db.collection('fleet');
    }
});


//Endpoints

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,"views/index.html"));
});

app.get('/addparcel',function(req,res){
    res.sendFile(path.join(__dirname,"views/addparcel.html"));
});


app.post("/addparcelpost", function(req,res){
   let newParc = req.body;
   let newSender = req.body.sender;
   let newAddress = req.body.address;
   let newWeight = parseInt(req.body.weight);
   let newFragile = req.body.fragile;

   col.insertOne({sender:newSender,address:newAddress, weight: newWeight, fragile:newFragile});
   
//    res.send('Thank you!');
res.redirect("/getparcels");
   
   
   
});

app.get('/getparcels',function(req,res){
    col.find({}).toArray(function(err,data){
        res.render("listparcels.html", {fleet:data});
    })
   
});

  app.get('/delparcel', function(req,res){
    res.sendFile(path.join(__dirname,"views/delparcel.html"));
});

app.post('/delparcelpost', function(req,res){
    let id = req.body.id;
    console.log('Success'+ id);
    col.deleteOne({_id:mongodb.ObjectId(id)},function(err,result){
        // res.send(result);
        res.redirect("/getparcels");
    });


});

app.get('/updateparcel', function(req,res){
    res.sendFile(path.join(__dirname,"views/updateparcel.html"));
});

app.post('/updateparcelpost', function(req,res){
    let id = req.body.id;
    let newSender = req.body.sender;
    let newAddress = req.body.address;
    let newWeight= req.body.weight;
    let newFragile = req.body.fragile;

    col.findOne({_id:mongodb.ObjectId(id)}, function(err,result){
            col.updateOne({_id:mongodb.ObjectId(id)},{$set:{sender: newSender, address: newAddress, weight:newWeight, fragile:newFragile}}, function(err,result){
                res.redirect('/getparcels');

            });
        
    });

});


//extra task
app.get('/updatesenderweight', function(req,res){
    res.sendFile(path.join(__dirname,"views/updatesenderweight.html"));
});


app.post('/updatesenderweightpost', function(req,res){
    let newWeight = parseInt(req.body.weight);
    let newSender = req.body.sender;

    
    col.updateMany({$inc: {newWeight : 5}}, {$set:{sender: "Sender" + newSender}},{upsert: true}, function(err,result){
        res.redirect('/getparcels');
    });
   
});


app.get('*', function(req, res){
    res.sendFile(path.join(__dirname,"views/404.html"));
  });






