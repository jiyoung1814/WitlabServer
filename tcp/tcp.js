const net = require('net');

class TCPServer{
    constructor(port, address){
        this.port = port;
        this.address = address || '127.0.0.1';
        this.clientList =[];
        this.server = null;

        this.connection = null;
        this.res = null;
    }

    start(callback){
        this.server = net.createServer((socket) =>{

            const client = {
                "address": socket.remoteAddress,
                "port": socket.remotePort,
                "socket": socket,
                // "data": ""
            }
            this.clientList.push(client);
            
            socket.setEncoding('utf8');
        
            socket.on('data', (data) =>{
                if(this.res) this.res(client, data);
            })
        
            socket.on('end', () =>{
                console.log(`client ${client.address}: ${client.port} is end`);
                this.clientList.splice(this.clientList.indexOf(client), 1);
            })

            socket.on('error', () =>{
                console.log(`client ${client.address}: ${client.port} is closed`);
                this.clientList.splice(this.clientList.indexOf(client), 1);
            })


            if(this.connection) {
                this.connection(client);
            }
        })

        this.server.listen(this.port, this.address, () => {
            callback();
        });
        

        this.server.on('close', () =>{
            console.log("tcp server is close");
        })

        this.server.on('disconnect', () =>{
            console.log('tcp server is disconnect');
        })

        this.server.on('error', (err) =>{
            console.log(`tcp server err: ${err}`)
        })
           
    }

    brodcast(data, clientSender){

        this.clientList.forEach(client =>{
            client.socket.write(data)
        })
    }

}

let readData = "";

const tcp = new TCPServer(process.env.tcp_port, process.env.tcp_ipaddr);
tcp.start(()=> console.log(`tcp server started at ${process.env.tcp_ipaddr}: ${process.env.tcp_port}`))

tcp.connection = (client) => console.log(`${client.address}: ${client.port} connected`)

tcp.res = (client, data) => {

    // console.log(`${client.address}:${client.port} =>  ${data}`);
    readData = data;
    // console.log(readData)
}

const clearTcpRead = () =>{
    console.log("clear")
    readData = "";
}

const getTcpRead = () =>{
    return readData;
}

const wirteTCP = (write_data) =>{
    tcp.brodcast(write_data);
}

const checkTCPConnection =() =>{
    return tcp.clientList;
}

module.exports = {clearTcpRead, getTcpRead, wirteTCP, checkTCPConnection}