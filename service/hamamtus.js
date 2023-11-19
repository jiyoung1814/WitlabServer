
const tcp = require('../tcp/tcp.js');
const convertType = require('../function/ConvertType.js');
const sleep = require('../function/sleep.js')

const getTcpPacket = async(second) =>{
    let cnt = 0;
    let readData = "";

    while(cnt < second * 10){
        await sleep(100) //0.1s
        
        readData += tcp.getTcpRead();
        if(readData.substring(readData.length-2) === '03' && readData.length == 1168){
            console.log("hamamtus 측정 완료")
            return readData;
        }
        cnt += 1;
    }

    console.log("ERROR: hamamtus 측정 실패");
    return ;
}

const parsingPacket = (packet) =>{
    let stx = packet.slice(0,2);
    let deviceId = packet.slice(2,4);
    let etx = packet.slice(packet.length-2, packet.length);

    if(stx === '02' && deviceId === '01' && etx == '03'){
        let cmd = String.fromCharCode(parseInt(packet.slice(4,6),16));
        let intgTime = parseInt(packet.slice(6,14),16);
        let pixel ={};
        for(let i=0;i<288;i++){
            pixel[i] = parseInt(packet.slice(i*4+14, i*4+18),16);
        }

        if(intgTime > 1000000 || intgTime < 10){
            console.log("ERROR: hamamtus intgtime 부족 또는 초과 상태")
            return ;
        }
    
        hamamtus_value = {
            'cmd': cmd,
            'intgtime': intgTime,
            'pixel': pixel
        }
        return hamamtus_value;
    }
    else{
        console.log("ERROR: hamamtus 정상 패킷 아님");
        return ;
    }
}


const getMeasurement = async (cmd, intgtime) =>{
    // stx: 02[1Byte], deviceId: 01[1Byte], cmd: A(M)[1Byte], intgtime: 1000[4Byte], etx: 03[1Byte]
    if(tcp.checkTCPConnection().length != 0){
        let STX = convertType.StringToHexString('02', 2);
        let DEVICEID = convertType.StringToHexString('01', 2);
        let CMD = convertType.StringToHexString(cmd, 2);
        let INTGTIME = convertType.StringToHexString(intgtime, 8);
        let ETX = convertType.StringToHexString('03', 2);
        
        let sendPacket_str = STX + DEVICEID + CMD+ INTGTIME+ ETX;
        let sendPacket_byteArray = convertType.HexStringToHexByteArray(sendPacket_str)

        console.log("hamamtus send packet");
        console.log(sendPacket_byteArray)
        tcp.wirteTCP(sendPacket_byteArray);

        let readPacket = await getTcpPacket(30);
        console.log(`hamamtus packet: ${readPacket}`)

        if(readPacket){
            let hamamtus_value = parsingPacket(readPacket);

            if(hamamtus_value){
                return hamamtus_value;
            }
        }
    }

    console.log("hamamatus 실패")
    return ;
}

module.exports = {getMeasurement}