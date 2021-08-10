import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';

import moment from 'moment';


const printRow = async (code, name, qty, price) => {

    let columnWidths = [12, 15, 5, 10];

    await BluetoothEscposPrinter.printColumn(columnWidths,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
        [code, name, qty, price], { fonttype: 1 });
}


const makeFormat = async (Data, shopName, shopNumber) => {
    let columnWidths = [12, 15, 5, 10];


    var products = Data.sale_items
    var t = 0

    var date = moment().format('MMMM Do YYYY, h:mm:ss a')

    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.printText(`${shopName}\n`, {});
    await BluetoothEscposPrinter.printText(`Phone: ${shopNumber}\n\n`, {});

    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.printText(`Date: ${date}\n`, { fonttype: 1 });
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

    await BluetoothEscposPrinter.printText("...............................\n\n", {});

    await BluetoothEscposPrinter.printColumn(columnWidths,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['CODE', 'NAME', 'QTY', 'PRICE'], { fonttype: 1 });
    await BluetoothEscposPrinter.printText("...............................\n", {});

    products.map((item) => {
        var price = `${item.price - item.discount}`
        printRow(item.product_code, item.name, item.qty, price)
        t = t + item.price
    })

    await BluetoothEscposPrinter.printText("...............................\n\n", {});

    var subTotal = t
    var billDiscount = Data.special_discount
    var Total = subTotal - billDiscount

    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);

    let summaryColumn = [15, 15];

    await BluetoothEscposPrinter.printColumn(summaryColumn,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Sub Total', `Rs.${subTotal}`], {});
    await BluetoothEscposPrinter.printColumn(summaryColumn,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Discount', `Rs.${billDiscount}`], {});
    await BluetoothEscposPrinter.printColumn(summaryColumn,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Total', `Rs.${Total}`], {});

    return true
}

export default {
    makeBillFormat: makeFormat
}