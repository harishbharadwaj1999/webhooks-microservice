"use strict";
const express = require("express");
const bodyParser = require('body-parser')
 
module.exports = {
    name: "gateway",
    settings: {
        port: process.env.PORT || 3000,
    },
    methods: {
        initRoutes(app) {
            // app.get("/", (req, res)=> res.send('Hello World') )
            app.post("/create", this.register);
            app.get("/read", this.list);
            app.put("/update", this.update);
            // app.delete("/delete", this.delete);
            app.post("/ip", this.trigger);
        },
        register(req,res){
            const targetUrl= req.body.targetUrl;
            return Promise.resolve().then(()=>{
                return this.broker.call("webhooks.register",{targetUrl}).then(id=>
                    res.send(id)
                    );
            }).catch(this.handleErr(res));
        },
        update(req,res){
            const id=req.body.id;
            const newTargetUrl=req.body.newTargetUrl;
            return Promise.resolve().then(()=>{
                return this.broker.call("webhooks.update",{id,newTargetUrl}).then(msg=>
                    res.send(msg)
                    );
            }).catch(this.handleErr(res));
        },
        list(req,res){
            return Promise.resolve().then(()=>{
                return this.broker.call("webhooks.list").then(lists=>
                    res.send(lists)
                    );
            }).catch(this.handleErr(res));
        },
        trigger(req,res){
            const ipAdress=req.body.ipAdress;
            return Promise.resolve().then(()=>{
                return this.broker.call("webhooks.trigger",{ipAdress}).then(msg=>
                    res.send(msg)
                    );
            }).catch(this.handleErr(res));
        },
        // delete(req,res){

        // },
        handleErr(res) {
            return err => {
                res.status(err.code || 500).send(err.message);
            };
        }
    },
    created() {
            const app = express();
            app.use(bodyParser());
            this.initRoutes(app);
            this.app = app;
        }
};
    