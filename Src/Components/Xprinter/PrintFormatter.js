const makeFormat = (Data) => {
    var Headings = `<C>ARAFA</C>\n`
    var products = Data.sale_items
    var pro_list = Headings + '\nCODE   NAME   QTY   PRICE\n -----------------------------'
    var t = 0
    products.map((item) => {

        var billrow = `\n${item.product_code}   ${item.name}   ${item.qty}   Rs.${item.price - item.discount}`
        pro_list = pro_list + billrow
        t = t + item.price

    })


    var subTotal = t
    var billDiscount = Data.special_discount
    var Total = subTotal - billDiscount
    var line = pro_list + '\n\n<C>*****************************</C>'
    var summary = line + `\nSub Total: ${subTotal} \nDiscount:${billDiscount}\nTotal: ${Total}`
    return `${summary}`
}

export default {
    makeBillFormat: makeFormat
}