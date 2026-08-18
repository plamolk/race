const express = require('express');
const path = require('path');
const app = express();
const db  = require('mysql2');
const jwt = require('jsonwebtoken');
const config = db.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'sos',
    port:3307
})
const secret_key = "FTX_FRAME"
config.connect((err) =>{
    if(err){
        console.log(err)
        console.log('connect fail');
    } else{
        console.log('connect success');
    }
})

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.get('/select/client',(req,res)=>{
    const sql = "SELECT * FROM client WHERE client_status = 1";
    config.query(sql,(err,resulte)=>{
        if(err){
            return res.status(500).json({message:"Error Select"})
        }else{
            return res.status(200).json(resulte)
        }
    })
})

app.post('/auth/login', (req, res) => {
    const { email, pass } = req.body;
    const values = [email, pass];
    let sql = "SELECT * FROM client WHERE client_email = ? AND client_password = ?";
    config.query(sql, values, (err, results) => {
        if (err) {
            console.log('Select error' + err);
            return res.status(500).json({ success: false, message: "Select error:" + err });
        }
        if (results.length === 0) {
            console.log('Invalid email or password' + err);
            return res.status(200).json({ success: false, message: "Invalid email or password:" });
        }
        const users = {
            id: results[0].client_id,
            email: results[0].client_email
        }
        const token = jwt.sign(users, secret_key, { expiresIn: "3h" });
        return res.status(200).json({ success: true, message: "Select success:", token: token });
    })
})

app.post('/auth/regis',(req,res) => {
    const {user, mail, pass} = req.body;
    const value = [user, mail, pass];
    const sql = "INSERT INTO client(client_fullname,client_email,client_password)VALUES(?,?,?)";
    config.query(sql, value, (err, resultes) => {
        if(err){
            console.error(err)
            return res.status(500).json({message:"insert error"+err, success:false})
        } else{
            return res.status(200).json({message:"insert success", success:true})
        }
    })
})

app.post('/add/client',(req,res)=>{
        const {user, mail, pass, role} = req.body;
    const value = [user, mail, pass, role];
    const sql = "INSERT INTO client(client_fullname,client_email,client_password,client_role)VALUES(?,?,?,?)";
    config.query(sql, value, (err, resultes) => {
        if(err){
            console.error(err)
            return res.status(500).json({message:"insert error"+err, success:false})
        } else{
            return res.status(200).json({message:"insert success", success:true})
        }
    })
})
function authen(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(500).json({ message: "Error", success: false })
    }
    jwt.verify(token, secret_key, (err, user) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(500).json({ message: "Tokenexpired", success: false });
            }
            return res.status(500).json({ message: err, success: false });
        } else {
            req.user = user;
            next();
        }
    });
}
app.get("/profile", authen, (req, res) => {
    const userId = req.user.id;
    const sql = "SELECT * FROM client WHERE client_id = ?";
    config.query(sql, userId, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "DB error", success: false })
        };
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found", success: fale })
        }
        res.json(results[0]);
    });
});

app.get('/select/assessment',(req,res)=>{
    const sql = "SELECT * FROM assessment ";
        config.query(sql, (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: "Select error", success: false })
        };
        if (results.length === 0) {
            return res.status(404).json({ message: "Assessment not found", success: fale })
        }
        res.json(results);
    });
})

app.get('/count/assess_all/:id', (req,res) =>{
    const id = req.params.id;
    const values = [id,id];
    const sql = "SELECT COUNT (*) AS total FROM assessment WHERE assessment_assessor_id = ? OR assessment_assessor_id_two = ?";
    config.query(sql, values, (err, results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err})
        } else{
            res.json(results);
        }
    })
})
app.get('/count/assess_suc/:id', (req,res) =>{
    const id = req.params.id;
    const values = [id,id];
    const sql = "SELECT COUNT (*) AS total FROM assessment WHERE (assessment_assessor_id = ? OR assessment_assessor_id_two = ?) AND assessment_status = 3";
    config.query(sql, values, (err, results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err})
        } else{
            res.json(results);
        }
    })
})
app.get('/count/assess_wt/:id', (req,res) =>{
    const id = req.params.id;
    const values = [id,id];
    const sql = "SELECT COUNT (*) AS total FROM assessment WHERE (assessment_assessor_id = ? OR assessment_assessor_id_two = ?) AND assessment_status = 2";
    config.query(sql, values, (err, results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err})
        } else{
            res.json(results);
        }
    })
})

app.get('/select/assess_client_st2/:id', (req,res) =>{
    const id = req.params.id;
    const values = [id,id];
    const sql = "SELECT * FROM assessment WHERE (assessment_assessor_id = ? OR assessment_assessor_id_two = ?) AND assessment_status = 2 LIMIT 4";
    config.query(sql, values , (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err})
        } else {
            res.json(results);
        }
    })
})

app.get('/select/client/:id', (req,res) =>{
    const id = req.params.id;
    const sql = "SELECT * FROM client WHERE client_id = ?";
    config.query(sql,id, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err})
        } else{
            res.json(results);
        }
    })
})
app.get('/select/department/:id', (req,res) =>{
    const id = req.params.id;
    const sql = "SELECT * FROM department WHERE department_id  = ?";
    config.query(sql,id, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err})
        } else{
            res.json(results);
        }
    })
})
app.get('/select/institution/:id', (req,res) =>{
    const id = req.params.id;
    const sql  = "SELECT * FROM institution WHERE institution_id = ?";
    config.query(sql,id, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err})
        } else{
            res.json(results);
        }
    })
})
app.get('/select/position/:id', (req,res) =>{
    const id = req.params.id;
    const sql = "SELECT * FROM position WHERE position_id  = ?";
    config.query(sql,id, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err})
        } else{
            res.json(results);
        }
    })
})
app.get('/select/assess_client/:id',(req,res) =>{
    const id = req.params.id;
    const sql ="SELECT * FROM assessment WHERE assessment_client_id = ?";
    config.query(sql, id, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err, success: false })
        }
        if (results.length === 0) {
            return res.status(404).json({ message:"assessment not found", success: false })
        } else{
            res.json(results);
        }
    })
})
app.get('/select/assessment/:id', (req,res) =>{
    const id = req.params.id;
    const sql1 = "SELECT * FROM assessment WHERE assessment_id = ?";
    config.query(sql1, id, (err,assess) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err , success:false});
        }
        const topic = assess[0].assessment_id;
        const sql2 = "SELECT * FROM topic WHERE topic_assessment_id = ?";
        config.query(sql2,topic, (err, top) =>{
            if(err){
                console.log(err);
                return res.status(500).json({message:'select error'+err , success:false});
            }
            const subtopic = top.map( t => t.topic_id);
            const sql3 = "SELECT * FROM subtopic WHERE subtopic_topic_id IN (?)";
            config.query(sql3, [subtopic], (err,sub) =>{
                if(err){
                    console.log(err);
                    return res.status(500).json({message:'select error'+err , success:false});
                } else{
                    res.json({assessment:assess , topic:top, subtopic:sub, success:true})
                }
            })
        })
    })
})

app.post('/add/topic',(req,res)=>{
    const {id,topic} = req.body;
    const value = [id, topic];
    const sql = "INSERT INTO topic (topic_assessment_id, topic_name)VALUES(?,?)";
        config.query(sql, value, (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: "Insert error", success: false })
        }
        res.json({ message: "insert Success", success: true });
    });
})

app.put('/ub/score_as/:id', (req,res) =>{
    const id = req.params.id;
    const {num} = req.body;
    const value = [num,id];
    const sql = "UPDATE subtopic SET subtopic_score_as = ? WHERE subtopic_id = ?";
    config.query(sql, value, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'update error'+err , success:false})
        } else{
            return res.status(200).json({message:'update success' , success:true})

        }
    })
})
app.put('/ub/choice_as/:id', (req,res) =>{
    const id = req.params.id;
    const {num} = req.body;
    const value = [num,id];
    const sql = "UPDATE subtopic SET subtopic_choice_as = ? WHERE subtopic_id = ?";
    config.query(sql, value, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'update error'+err , success:false})
        } else{
            return res.status(200).json({message:'update success' , success:true})

        }
    })
})
app.post('/add/comment', (req,res) =>{
    const {assess, by, detail} = req.body;
    const values = [assess, by, detail];
    const sql = "INSERT INTO comment(comment_assessment_id , comment_by , comment_detail)VALUES(?,?,?)";
    config.query(sql, values, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'insert error'+err , success:false})
        } else{
            return res.status(200).json({message:'insert success' , success:true})
        }
    })
})
app.post('/add/assess', (req,res) =>{
    const {client , user} = req.body;
    const values = [client, user];
    const sql = "INSERT INTO assessment(assessment_client_id, assessment_client_fullname, assessment_round , assessment_status)VALUES(?,?,1,0)";
    config.query(sql,values, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'insert error'+err , success:false})
        } else{
            return res.status(200).json({message:'insert success' , success:true})
        }
    })
})
app.put('/ud/client/:id', (req,res) =>{
    const id = req.params.id;
    const {insti, posi ,dep, sub, sala, per, grade} = req.body;
    const values = [insti, posi, dep, sub, sala, per, grade, id];
    const sql = "UPDATE client SET 	client_institution = ? , client_position = ?, client_department = ?, client_sub_tech = ?, client_saraly = ?, client_per_week = ?, client_grade_tech = ? WHERE client_id = ?";
    config.query(sql, values, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'insert error'+err , success:false})
        } else{
            return res.status(200).json({message:'insert success' , success:true})
        }
    })
})
app.get('/ud/status_suc/:id', (req,res) =>{
    const id = req.params.id;
    const sql = "UPDATE assessment SET assessment_status = 3 WHERE assessment_id = ?";
    config.query(sql,id, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'update error'+err, success:false})
        } else{
            return res.status(200).json({message:'update success', success:true})
        }
    })
})
app.get('/select/assess_suc/:id', (req,res) =>{
    const id = req.params.id;
    const values =[id,id];
    const sql = "SELECT  * FROM assessment WHERE (assessment_assessor_id = ? OR assessment_assessor_id_two = ?) AND assessment_status = 3 ";
    config.query(sql,values, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err})
        } else{
            res.json(results);
        }
    })
})
app.get('/select/institution', (req,res) =>{
    const sql = "SELECT * FROM institution";
    config.query(sql, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err})
        } else{
            res.json(results);
        }
    })
})
app.get('/select/position', (req,res) =>{
    const sql = "SELECT * FROM position";
    config.query(sql, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err})
        } else{
            res.json(results);
        }
    })
})
app.get('/select/department', (req,res) =>{
    const sql = "SELECT * FROM department";
    config.query(sql, (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'select error'+err})
        } else{
            res.json(results);
        }
    })
})
app.get('/delete/client/:id', (req,res)=>{
    const id = req.params.id;
    const sql = "DELETE FROM client WHERE client_id = ?";
    config.query(sql, [id], (err, resulte)=>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'Delete error'+err , success:false})
        } else{
            return res.status(200).json({message:'Delete success' , success:true})

        }
    })
})
app.listen(3000, (req,res) =>{
    console.log('welcome!!!');
})