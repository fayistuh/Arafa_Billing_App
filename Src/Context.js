import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Router from './Router'
import AppContext from './constant'
import config from './Config'
import Toast from 'react-native-simple-toast'

const Realm = require('realm');

const productsSchema = {
  name: 'Products',
  properties: {
    id: 'string',
    code: 'string',
    name: 'string',
    shop: 'string',
    shop_name: 'string',
    section_name: 'string',
    category_name: 'string',
    sub_category_name: 'string',
    brand_name: 'string',
    price: 'string',
    tax: 'string',
    discount: 'string'

  }
};

const CustomerSchema = {
  name: 'Customers',
  properties: {
    id: 'string',
    name: 'string',
    phone: 'string',
    address: 'string'
  }
};




function Context(props) {
  const [splash, setSplash] = useState(true)
  const [userToken, setUserToken] = useState(null)
  const [productData, setProductData] = useState(null)
  const [customerData, setCustomerData] = useState(null)
  const [syncinfo, setSyncInfo] = useState(null)
  const [billArray, setBillArray] = useState([])
  const [openedBill, setOpenedBill] = useState(null)

  useEffect(() => {
    getLocalBills()
  }, [])

  const getLocalBills = async () => {
    try {
      const value = await AsyncStorage.getItem('@bills');

      if (value !== null) {
        // userdata=JSON.parse(value).userToken
        setBillArray(JSON.parse(value))

      }


    } catch (error) {
      // Error retrieving data
      console.warn('noooo')

    }
  }


  const updateLocalBills = async (bills) => {

    try {
      await AsyncStorage.setItem('@bills', JSON.stringify(bills));
      console.warn('Bill Saved')

    } catch (error) {
      // Error saving data
      console.warn("HAHAH", error)
    }
  }

  //#################### DATABASE OPERATIONS #########################################

  const [filteredProducts, setFilteredProducts] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])



  const DATABASE_OPERATION = (CONFIG) => {
    Realm.open({ schema: [productsSchema, CustomerSchema] }).then(realm => {

      if (CONFIG.operation) {
        if (CONFIG.operation == 'delete' && CONFIG.database == 'customer') {

          //delete customer database operation

          realm.write(() => {
            let allBooks = realm.objects('Customers');
            realm.delete(allBooks); // Deletes all books
            console.warn('deleted all Customers')
          });
          realm.close()
          DeleteAllProducts()

        }
        else if (CONFIG.operation == 'delete' && CONFIG.database == 'product') {

          // delete products database operation

          realm.write(() => {
            let allBooks = realm.objects('Products');
            realm.delete(allBooks); // Deletes all books
            console.warn('deleted all products')
          });
          realm.close()
          cheeckPreviousSync()
        }

        else if (CONFIG.operation == 'write' && CONFIG.database == 'customer') {
          // write products database operation
          var customers = CONFIG.writedata
          customers.map((item) => {
            realm.write(() => {
              const myCar = realm.create('Customers', {
                id: item.id,
                name: item.name,
                phone: item.phone ? item.phone : '',
                address: item.address
              })
            })
          })
          realm.close();
          setCustomerData(customers)
          getUpdatedProductData()
          setCustomerTask('Done')
        }

        else if (CONFIG.operation == 'write' && CONFIG.database == 'product') {

          // write products database operation
          var products = CONFIG.writedata
          products.map((item) => {
            realm.write(() => {
              const myCar = realm.create('Products', {
                id: item.id,
                code: item.code,
                hsn: item.hsn,
                name: item.name,
                shop: item.shop,
                shop_name: item.shop_name,
                section_name: item.section_name,
                category_name: item.category_name,
                sub_category_name: item.sub_category_name,
                brand_name: item.brand_name,
                price: item.price,
                tax: item.tax,
                discount: item.discount
              })
              // myCar.miles += 20;

            })
          })
          realm.close();
          storeSyncinfo(productCount, customerCount)
        }




      }


      else {
        if (CONFIG.type == 'pro') {
          const cars = realm.objects('Products');
          let x = cars.filtered(`code BEGINSWITH "${CONFIG.key}"`)
          setFilteredProducts(x)

        }
        else if (CONFIG.type == 'cus') {
          console.warn('searching customer')
          const cars = realm.objects('Customers');
          let x = cars.filtered(`phone BEGINSWITH "${CONFIG.key}"`)
          setFilteredCustomers(x)
        }
        else {
          console.warn('searching customer')
          const cars = realm.objects('Customers');
          let x = cars.filtered(`name BEGINSWITH "${CONFIG.key}"`)
          setFilteredCustomers(x)
        }
      }






    })
  }

  //################################################################################




  //######################### DATABASE ############################################
  const ip = config.ipAddress
  const [downloading, setDownloading] = useState(false)
  const [showDownloadBox, setDownloadBox] = useState(false)


  const [customerTask, setCustomerTask] = useState('waiting')
  const [productTask, setproductTask] = useState('waiting')

  const [availableShops, setAvailableShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)

  const [availableWarehouses, setWarehouses] = useState([])
  const [selectedWareHose, setSelectedWareHose] = useState(null)

  const [productCount, setProductCount] = useState('')
  const [customerCount, setCustomerCount] = useState('')

  const [listingMode, setListingMode] = useState('shops')


  //*********************************** */ CLEAR DATABASE *****************************

  const DeleteAllCustomers = () => {
    if (customerTask == 'waiting' && productTask == 'waiting') {
      setDownloading(false)
      var CONFIG = {
        operation: 'delete',
        database: 'customer',
      }
      DATABASE_OPERATION(CONFIG)
    }
    else {
      setDownloadBox(true)
    }


  }

  const DeleteAllProducts = () => {
    var CONFIG = {
      operation: 'delete',
      database: 'product',
    }
    DATABASE_OPERATION(CONFIG)
  }

  const cheeckPreviousSync = () => {
    if (syncinfo == null) {
      //skip remove async sync remove task
      getShops()

    }
    else {
      removeSyncInfo()
    }
  }

  const removeSyncInfo = async () => {
    try {
      await AsyncStorage.removeItem('@syncinfo')
      console.warn('remove sync info')
    } catch (e) {
      // remove error
    }

    console.warn('sync info remove Done.')
    getShops()

  }

  //********************************************************************************************** */


  //************************** DOWNLOAD OPERATIONS *************************************************/

  //1.Get available shops

  const getShops = () => {
    var axios = require('axios');

    var config = {
      method: 'get',
      url: 'http://www.arafamobiles.com/api/v1/general/access-shops/',
      headers: {
        Authorization: 'Bearer ' + userToken
      }
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        // storeShops(response.data.data)
        setAvailableShops(response.data.data)
        setDownloadBox(true)
      })
      .catch(function (error) {
        setDownloading(false)
        Toast.show('download failed')
      });

  }



  //1.2 Get available warehouses


  const onRequestWarehouse = (shopid) => {
    var axios = require('axios');

    var config = {
      method: 'get',
      url: 'http://arafamobiles.com/api/v1/general/warehouses/' + shopid,
      headers: {}
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setWarehouses(response.data.data)
      })
      .catch(function (error) {
        setDownloading(false)
        Toast.show('download failed')
      });

  }

  //1.3 start downloading


  const onStartDownload = () => {
    console.warn(selectedShop.shop_pk)
    setDownloading(true)
    getAllCustomers(selectedShop.shop_pk)
  }



  //2. get All customers of curresponding shop

  const getAllCustomers = (id) => {
    setCustomerTask('downloading')
    var axios = require('axios');

    var config = {
      method: 'get',
      url: 'http://arafamobiles.com/api/v1/general/customers/' + id,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        storeCustomers(response.data.data)
      })
      .catch(function (error) {
        console.log(error);
        setCustomerTask('waiting')
        setproductTask('waiting')
        setDownloadBox(false)


      });

  }


  //3. Store All customers to Local Database

  const storeCustomers = (customers) => {
    setCustomerCount(customers.length)
    var CONFIG = {
      operation: 'write',
      database: 'customer',
      writedata: customers
    }
    DATABASE_OPERATION(CONFIG)

  }

  //4. get All update products 

  const getUpdatedProductData = () => {
    setproductTask('downloading')
    console.warn('downloading products', selectedShop)
    var axios = require('axios');

    var config = {
      method: 'get',
      url: 'http://arafamobiles.com/api/v1/products/products/' + selectedShop.shop_pk,
    };

    axios(config)
      .then(function (response) {
        console.warn(response.data.data)
        // storeProductData(response.data.data)

        var products = response.data.data
        storeProducts(products)
        setproductTask('Done')
      })
      .catch(function (error) {
        Toast.show('Something went wrong, Try again')
        setCustomerTask('waiting')
        setproductTask('waiting')
        setDownloadBox(false)

        console.log(error);
      });

  }



  //5.store updated products to Local database

  const storeProducts = (products) => {
    setProductCount(products.length)
    var CONFIG = {
      operation: 'write',
      database: 'product',
      writedata: products
    }
    DATABASE_OPERATION(CONFIG)


  }

  //6. save sync info to async storage

  const storeSyncinfo = async (products, customer) => {
    setCustomerTask('waiting')
    setproductTask('waiting')
    console.warn('storing sync info')

    var syncDate = new Date()
    var p = await productCount
    var c = await customerCount
    var syncObj = {
      shop: selectedShop,
      warehouse: selectedWareHose,
      NoOfCustomers: p,
      NoOfProducts: c,
      lastSync: syncDate
    }
    try {
      await AsyncStorage.setItem('@syncinfo', JSON.stringify(syncObj))
      Toast.show('sync info updated successfully')
      console.warn('KKKKKKKKKKKKKKKKKKKKKKKKKK', syncObj)
      setSyncInfo(syncObj)
      setCustomerTask('waiting')
      setproductTask('waiting')
      setDownloadBox(false)



    } catch (error) {
      // Error saving data
      console.warn("err store sync info", error)
      setCustomerTask('waiting')
      setproductTask('waiting')
      setDownloadBox(false)

    }
  }

  //**************************************************************************************** */


  //##################################################################################



  return (
    <AppContext.Provider
      value={{
        setUserToken,
        userToken,
        productData,
        setProductData,
        customerData,
        setCustomerData,
        syncinfo,
        setSyncInfo,
        billArray,
        setBillArray,
        updateLocalBills,
        openedBill,
        setOpenedBill,
        DATABASE_OPERATION,
        filteredProducts,
        filteredCustomers,
        DeleteAllCustomers,

        customerTask,
        productTask,
        availableShops,
        selectedShop,
        setSelectedShop,
        downloading,
        setDownloading,

        showDownloadBox,
        setDownloadBox,
        onStartDownload,
        productCount,

        listingMode,
        setListingMode,
        onRequestWarehouse,
        availableWarehouses,
        setSelectedWareHose,
        selectedWareHose,
        splash,
        setSplash
      }}>
      <Router />
    </AppContext.Provider>
  )
}
export default Context

