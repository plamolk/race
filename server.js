const express = require('express');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
const db = require('mysql2');

const config = db.createConnection( {
    host:'localhost',
    port:3307,
    user:'root',
    password:'1234',
    database:'mydatabase'
})

const secret_key = "veerakit";

config.connect(err =>{
    if(err){
        console.log('database fail สาเหตุคือ:', err.message);
    }else{
        console.log('database connect');
    }
})
app.use(express.json());
app.use(express.static(path.join(__dirname , '/frontend')))

app.listen(3000 , () =>{
    console.log('server running success');
})

app.post('/auth/login', (req,res) =>{
    const {email , pass} = req.body;
    config.query('SELECT * FROM client WHERE client_email = ? AND client_password = ?' , [email,pass],(err,row) =>{
        if (err || !row.length) return res.status(401).json({success:'false' , message:"login fail"});

        const token = jwt.sign({id:row[0].client_id,email:row[0].client_email},secret_key,{expiresIn:'6h'})
        res.json({token:token , success:true})
    })
})

const authen = (req,res,next) =>{
    jwt.verify(req.headers.authrization?.split(" ")[1], secret_key ,(err,user) =>{
        if(err) return res.json({success:false , message:"auth fail"});
        req.user = user;
        next();
    })
}

app.get('/profile',authen,(req,res)=>{
    config.query('SELECT * FROM client WHERE client_id = ?',[req.user.id],(err,[user]) =>{
        if (err || !user) return res.json({success:false , message:'profile failed'})
            res.json(user)
    })
})

app.get('/profile' , authen , (req,res) =>{
    config.query('SELECT * FROM client WHERE client_id = ?',[req.user.id] , (err,[user]) =>{
        if(err || !user) return res.json({message:'profile failed' , success:false})
            
            ret.json(user)
    })
})

// app.post('/auth/regis' ,(req,res) =>{
//     const {email , pass , user} = req.body;
//     const value = [user , email , pass];
//     console.log([user,email,pass]);
//     const sql = ('INSERT INTO client(client_fullname , client_email , client_password , cleint_role)VALUES(?,?,?,1)')
//     config.query(sql , value ,(err,row) =>{
//         if(err) return res.status(400).json({message:"authregis fail" , success:false})

//             res.json({message:'insert success' , success:true})
//     })
// })
app.post('/auth/regis' ,(req,res) =>{
    const {email , pass , user} = req.body;
    config.query('INSERT INTO client(client_fullname , client_email , client_password , cleint_role)VALUES(?,?,?,1)', ([user , email , pass]),(err,row) => {
        if(err) return res.status(400).json({message:"authregis fail" , success:false})

            res.json({message:'insert success' , success:true})
    })
})



// const authen = (req,res,next) =>{
//     jwt.verify(req.headers.authrization?.split(" ")[1], secret_key , (err, user) =>{
//         if (err) return res.json({message:'auth fail' , success:false})

//             req.user = user;
//             next()
//     })
// }