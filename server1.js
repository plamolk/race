const express = require('express');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
const db = require('mysql2')

const config = db.createConnection( {
    host:'localhost',
    user:'root',
    port:3307,
    password:'123',
    database:'mydatabase'
})

config.connect(err =>{
    if(err) console.log('connect failed');

    else console.log('connect success');
    
    
})

const secret_key = "veerakit";

const authen = (req,res,next) =>{
    jwt.verify(req.headers.authrization?.split(" ")[1], secret_key, (err,row) =>{
        if(err) return res.json({message:'auth error' , success:false})
            req.row = row;
        next();
    })
}

app.get('/profile', authen ,(req,res)=>{
    config.query('SELECT * FROM client WHERE client_id = ?', (req.token.id) , (err,[row]) =>{
        if(err || !row) return res.json({message:'profile failed', success:'false'})
            res.json(row)
    })
} )

app.get('/select/assessment/:id', (req,res) =>{
    const error = (e) => res.status(500).json({ message:'error' , success:false})

    config.query('SELECT * FROM evolution WHERE ev_id = ?' , req.params.id , (e , evo) =>{
        if(e) return error(e);
        config.query('SELECT * FROM topic WHERE topic_ev_id' , evo[0].ev_id , (e, top) =>{
            if(e) return error(e);
            config.query('SELECT * FROM subtopic WHERE subtopic_topic_id IN (?)' , [top.map(t => t.topic_id)] , (e , sub) =>{
                if(e) return error(e);
                res.json({ev:evo , top:top , sub:sub})
            })
        })
    })
})





app.get('/select/assessment/:id', (req, res) => {
    // สร้างฟังก์ชันจัดการ Error สั้นๆ ไว้ใช้ซ้ำ
    const errRes = (e) => res.status(500).json({ message: 'error', success: false });

    config.query("SELECT * FROM assessment WHERE assessment_id = ?", req.params.id, (e, assess) => {
        if (e) return errRes(e);
        config.query("SELECT * FROM topic WHERE topic_assessment_id = ?", assess[0].assessment_id, (e, top) => {
            if (e) return errRes(e);
            config.query("SELECT * FROM subtopic WHERE subtopic_topic_id IN (?)", [top.map(t => t.topic_id)], (e, sub) => {
                if (e) return errRes(e);
                res.json({ assessment: assess, topic: top, subtopic: sub, success: true });
            });
        });
    });
});


app.get('/select/evolution/:id', (req,res) =>{
    const err = (e) => res.status(500).json({message: 'error' , success:false})

    config.query("SELECT * FROM evolution WHERE ev_id = ?" , req.params.id , (e , assess) =>{
        if(e) return err(e);
        config.query('SELECT * FROM topic WHERE topic_ev_id = ?', assess[0].ev_id , (e , top) =>{
            if(e) return err(e);
            config.query('SELECT * FROM subtopic WHERE subtopic_topic_id IN (?)', [top.map(t => t.topic_id)], (e , sub) =>{
                if(e) return err(e);
                 res.json({ev:assess , topic:top , sub:sub , success:true});
            })
        })
    } )
})

