var printer = require('printer'),
    util = require('util');


console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));


// let printerName = 'EPSON_L6170_Series';
let filename = 'label.pdf';
// console.log(process.env);

// printer.getJob(printerName, 21);
console.log("platform", process.platform);

const printLabel = (printerName) => {
    if (process.platform != 'win32') {
        printer.printFile({
            filename: filename,
            printer: printerName, // printer name, if missing then will print to default printer
            success: function (jobID) {
                console.log("sent to printer with ID: " + jobID);
            },
            error: function (err) {
                console.log(err);
            }
        });
    } else {
        // not yet implemented, use printDirect and text
        var fs = require('fs');
        printer.printDirect({
            data: fs.readFileSync(filename),
            printer: printerName, // printer name, if missing then will print to default printer
            success: function (jobID) {
                console.log("sent to printer with ID: " + jobID);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}

module.exports = {
    printLabel
}