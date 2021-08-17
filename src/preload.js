let printer = require('printer')
let util = require('util');

const {
    contextBridge,
    ipcRenderer
} = require("electron");
const { printLabel } = require('./app');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            console.log("calling send...",{data})
            // whitelist channels
            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                if(data && data.action) {
                    console.log("Sending print command...");
                    ipcRenderer.send(channel, data);
                } else {
                    ipcRenderer.send(channel, data);
                }
            }
        },
        receive: (channel, func) => {
            // console.log("rerere")
            let validChannels = ["fromMain"];
            if (validChannels.includes(channel)) {
                // console.log({channel})
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => {
                    console.log("calling receive,,,,");
                    console.log({args})
                    
                    if(args && args[0] && args[0].action) {
                        console.log("print command sent to...", args[0].printerName);
                        const labelPrinted = printLabel(args[0].printerName);
                        func(...args)
                    } else {
                        const printers = getPrinters(); 
                        console.log({printers})
                        // const PrinterNames = printers.map(p => p.name)
                        // func(...args)
                        func(printers);
                    }
                });
            }
        }
    }
);

const getPrinters = () => {
    console.log("installed printers:\n");
    // console.log(util.inspect(printer.getPrinters(), {colors:true, depth:10}));
    return printer.getPrinters();
    // return util.inspect(printer.getPrinters(), {colors:true, depth:10});
}

// window.getPrinters = getPrinters;
