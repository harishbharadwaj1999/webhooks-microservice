"use strict";  
const DbService = require("moleculer-db");
const axios = require('axios');

module.exports = {
    name: "webhooks",
    mixins: [DbService],
    settings: {
		fields: [
			"_id",
			"targetUrl"
		],

		entityValidator: {
			_id: "string",
			targetUrl: "string"
		}
	},
    actions: {
        register:{
            auth: "required",
            params: {
				targetUrl: "string"
			},
            async handler(ctx) {
                const targetUrl=ctx.params.targetUrl;
                const doc = await this.adapter.insert({targetUrl});
                const json = await this.transformDocuments(ctx, ctx.params, doc);
                await this.entityChanged("created", json, ctx);
                return {"_id":json["_id"]}
        }
    },
        update:{
            auth: "required",
            params: {
                id:"string",
				newTargetUrl: "string"
			},
            async handler(ctx){
            const id=ctx.params.id;
            const newTargetUrl=ctx.params.newTargetUrl;
            const updt={
                "targetUrl":newTargetUrl
            }
            const json= await this.adapter.updateById(id,updt)
            if(!json){
                return {
                    "message":"Id not found",
                    "status code":404
                };
            }
            else{
                return {
                    "message":"Success",
                    "status code":200
                };
            }
        }
    },
        list:{
            auth: "required",
            async handler(ctx){
            res= await this.adapter.find();
            if(!res){
                return {
                    "message":"Internal error",
                    "status code":500
                };
            }
            else{
                return res;
            }
        }
    },
        trigger:{
            params: {
				ipAddress: "string"
			},
            async handler(ctx){
                const ipAddress=ctx.params.ipAddress;
                const res=await this.adapter.find();
                const urlList=res.map(obj=>obj["targetUrl"]);
                
                // Using axios to parallelize POST requests in batches of 10
                // For each batch, if error occurs then the status is logged else Success
                var count=0
                while(count<urlList.length){
                    let promises=[]
                    for(var i=0;i<10;i++){
                        if(count<urlList.length){
                        let data={}
                        data["ipAdress"]=ipAddress
                        data["timestamp"]=Date.now()
                        let newPromise = axios({
                            method: 'post',
                            url: urlList[count],
                            data: data
                          })
                        promises.push(newPromise)
                        count+=1
                        }
                    }
                    axios.all(promises).then(axios.spread((...responses) => {
                        responses.forEach(res => console.log('Success'))
                        console.log('Batch completes');
                    })).catch(error => {
                        if(error.response)
                        console.log(error.response.status)
                    })
                }
            }
        }
    },
};
