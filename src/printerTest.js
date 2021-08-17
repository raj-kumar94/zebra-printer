let closebtn = document.getElementById('get-printers');
let printPdfBtn = document.getElementById('print-sample-pdf');

closebtn.addEventListener('click', (e) => {
    console.log("hello")
    console.log(window.api);

    window.api.send("toMain", "some data");

    window.api.receive("fromMain", (data) => {
        console.log(`Received ${data} from main process`);
        console.log("printerTest:receive");
        console.log({data})

        const printerNames = data.map(p => `<p>Printer Name: ${p.name}</p>`)
        document.getElementById('printers-list').innerHTML = printerNames;
        document.getElementById('printer-code').innerHTML = JSON.stringify(data, null, 2);
    });

});


printPdfBtn.addEventListener('click', (e) => {

    window.api.send("toMain", {action: "print_pdf"});

    window.api.receive("fromMain", (data) => {
        if(data.response === 'success') {
            alert('Print command sent');
        }
    });

});