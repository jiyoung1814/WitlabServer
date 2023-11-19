const hamamatusService = require('../service/hamamtus');

const getMeasurement = async(req, res, next) =>{
        const mesermentValue = await hamamatusService.getMeasurement(req.body.cmd, req.body.intgtime);
        if(!mesermentValue){
                return res.status(505).json("hamamtus 오류")
        }
        else{
                return res.status(200).json(mesermentValue)
        }
        
}


module.exports ={
        getMeasurement
}