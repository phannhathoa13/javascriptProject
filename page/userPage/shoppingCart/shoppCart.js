import {
  addProductToCartId,
  fetchCartFromUserLogedIn,
  updateCart$
} from '../../../controllers/cartControllers.js'
import { fetchListOrder } from '../../../controllers/orderControllers.js'
import {
  deleteProduct$,
  fetchProductAPI
} from '../../../controllers/productControllers.js'
import {
  editAccount$,
  fetchUserAPI
} from '../../../controllers/userController.js'
import {
  getValueSeasion,
  removeInforUserLogedIn,
  roleCanAccessFeature
} from '../../../feautureReuse/checkRoleUser/checkRoleUser.js'
import {
  hideLoading,
  showLoading
} from '../../../feautureReuse/loadingScreen.js'
import Cart from '../../../models/cartModels.js'

const listProducts = await fetchProductAPI()
const listOrder = await fetchListOrder()
const listUser = await fetchUserAPI()
// const socket = new WebSocket('ws://localhost:3000')
const getUserId = getValueSeasion('idUserLogedIn')
let userLogedIn = await fetchCartFromUserLogedIn(getUserId)
let totalPriceByUser = 0

// socket.onopen = () => {
//   console.log('✅ Kết nối WebSocket thành công')
// }

// socket.onmessage = event => {
//   const notification = JSON.parse(event.data)
//   console.log('🔔 Nhận thông báo:', notification)
// }

// socket.onclose = () => {
//   console.log('❌ WebSocket bị đóng!')
// }

// socket.onerror = error => {
//   console.log('⚠️ Lỗi WebSocket:', error)
// }
roleCanAccessFeature(['CUSTOMER', 'USERADMIN', 'OWNER'])
displayAllInformation()

async function displayAllInformation() {
  await updateRankingUser()
  await displayListProduct()
  checkRoleToDisplayButton()
}

async function updateRankingUser() {
  try {
    showLoading('loadingScreen')
    const orderHistoryByUser = getOrderHistoryByUserLogedIn()
    const user = getUser()
    orderHistoryByUser.forEach(products => {
      totalPriceByUser += products.totalPrice
      if (totalPriceByUser < 1500) {
        user.ranking = 'Member'
      }
      if (totalPriceByUser >= 1500) {
        user.ranking = 'VIP'
      }
      if (totalPriceByUser >= 3000) {
        user.ranking = 'VVIP'
      }
    })
    await editAccount$(user.idUser, user)
    const updateCart = await updateCart$(userLogedIn.cartID, user, userLogedIn)

    if (updateCart) {
      userLogedIn = updateCart
    }
  } catch (error) {
    console.log('Update ranking user get error', error)
  } finally {
    hideLoading('loadingScreen')
  }
}

function filterMostPurchasedProducts() {
  const topSellingProducts = findTopSellingProducts()
  return listProducts.filter(products => {
    const productsExisted = topSellingProducts.find(
      products_ => products_.productName == products.productName
    )
    if (productsExisted) {
      return products.productName != productsExisted.productName
    }
    return products
  })
}

function findTopSellingProducts() {
  const listProductPurchased = []

  listOrder.forEach(orders => {
    orders.cartList.forEach(products => {
      listProductPurchased.push({
        id: products.id,
        productName: products.productName,
        amount: products.amount,
        price: products.price,
        imageProduct: products.imageProduct,
        userPurchased: orders.user.username,
        userPurchasedCount: 1
      })
    })
  })

  const mostPurchasedProducts = []

  listProductPurchased.forEach(products => {
    const productPurchased = mostPurchasedProducts.find(
      products_ => products_.productName == products.productName
    )
    if (productPurchased) {
      productPurchased.amount += products.amount
      if (!productPurchased.userPurchased.includes(products.userPurchased)) {
        productPurchased.userPurchasedCount += 1
        productPurchased.userPurchased.push(products.userPurchased)
      }
    } else {
      mostPurchasedProducts.push({
        id: products.id,
        productName: products.productName,
        amount: products.amount,
        price: products.price,
        imageProduct: products.imageProduct,
        userPurchased: [products.userPurchased],
        userPurchasedCount: 1
      })
    }
  })

  const sortedProducts = mostPurchasedProducts.sort(
    (a, b) => b.userPurchasedCount - a.userPurchasedCount
  )
  return sortedProducts.splice(0, 3)
}

async function displayListProduct() {
  try {
    showLoading('loadingScreen')
    const topSellingProducts = findTopSellingProducts()
    const nonTopSellingProducts = filterMostPurchasedProducts()

    console.log(topSellingProducts)
    topSellingProducts.forEach(products => {
      const productExistInListProduct = getProducts(products.productName)

      const bestSellerString = document.createElement('span')
      bestSellerString.textContent = '(Best Seller)'
      bestSellerString.style.color = '#FFA500'
      bestSellerString.style.margin = '0 5px'

      const amountAndPriceInfor = document.createElement('span')
      amountAndPriceInfor.textContent = `Amount: ${productExistInListProduct.amount}, Price: ${productExistInListProduct.price}$`

      const productInforDOM = document.createElement('div')
      productInforDOM.textContent = `Product: ${products.productName}`
      productInforDOM.style.placeContent = 'center'

      productInforDOM.appendChild(bestSellerString)
      productInforDOM.appendChild(amountAndPriceInfor)

      displayProductsDOM(products, productExistInListProduct, productInforDOM)
    })

    nonTopSellingProducts.forEach(products => {
      const productInforDOM = document.createElement('div')
      productInforDOM.textContent = `Product: ${products.productName}, Amount: ${products.amount}, Price: ${products.price}$`
      productInforDOM.style.placeContent = 'center'
      displayProductsDOM(products, products, productInforDOM)
    })
  } catch (error) {
    console.log('loading list Product error: ', error)
  } finally {
    hideLoading('loadingScreen')
  }
}

async function displayProductsDOM(products, amountProducts, productInforDOM) {
  const listProductDOM = document.getElementById('listProduct')

  const buttonContainer = document.getElementById('buttonContainer')
  buttonContainer.style.display = 'inline-block'

  const productDivDOM = document.createElement('div')
  productDivDOM.style.display = 'flex'

  const imageProductDOM = document.createElement('img')
  imageProductDOM.src = products.imageProduct
  imageProductDOM.style.width = '100px'
  imageProductDOM.style.height = '60px'
  imageProductDOM.style.margin = '10px'

  const buttonAddToCart = document.createElement('button')
  buttonAddToCart.textContent = 'ADD'
  buttonAddToCart.style.margin = '10px'
  buttonAddToCart.onclick = () => {
    addToCart(
      parseFloat(products.id),
      products.productName,
      parseFloat(products.price),
      amountProducts.amount,
      products.imageProduct
    )
  }
  productInforDOM.appendChild(buttonAddToCart)
  if (products.amount == 0) {
    productInforDOM.remove()
    await deleteProduct$(products.id);
  } else {
    listProductDOM.appendChild(productDivDOM)
    productDivDOM.appendChild(imageProductDOM)
    productDivDOM.appendChild(productInforDOM)
  }
}

function checkRoleToDisplayButton() {
  const roleUserLogedIn = userLogedIn.user.role

  const accountsManagerButtonDOM = document.getElementById('accountsManager')
  accountsManagerButtonDOM.style.display = 'none'
  accountsManagerButtonDOM.style.margin = '0px'

  const productsManagerButtonDOM = document.getElementById('productsManager')
  productsManagerButtonDOM.style.margin = '5px'

  const roleAccessManagerDOM = document.getElementById('roleAccessManager')

  const voucherManagerDOM = document.getElementById('voucherManager')
  voucherManagerDOM.style.display = 'none'

  if (roleUserLogedIn == 'OWNER') {
    accountsManagerButtonDOM.style.display = 'inline-block'
    productsManagerButtonDOM.style.display = 'inline-block'
    roleAccessManagerDOM.style.display = 'inline-block'
    voucherManagerDOM.style.display = 'inline-block'

    return
  }
  if (roleUserLogedIn == 'USERADMIN') {
    productsManagerButtonDOM.style.display = 'inline-block'
    roleAccessManagerDOM.style.display = 'inline-block'
    voucherManagerDOM.style.display = 'none'
  } else {
    accountsManagerButtonDOM.style.display = 'none'
    productsManagerButtonDOM.style.display = 'none'
    roleAccessManagerDOM.style.display = 'none'
    voucherManagerDOM.style.display = 'none'

    return
  }
}

window.accountAndPermissons = function accountAndPermissons() {
  window.location.href = `../accountAndPermissions/accountAndPermissions.html`
}

window.productsManager = function productsManager() {
  window.location.href = `../../adminPage/managerPage/producctManager/productManager.html`
}
window.accountsManager = function accountsManager() {
  window.location.href = `../../adminPage/managerPage/accountManager/accountManager.html`
}
window.voucherManager = function voucherManager() {
  window.location.href = `../../adminPage/managerPage/voucherManager/voucherManager.html`
}

async function addToCart(productIdDOM, nameProductDOM, priceProductDOM, amountProductDOM, imageProductDOM) {
  try {
    showLoading('loadingScreen')
    const createAt = new Date()
    if (
      userLogedIn &&
      userLogedIn.products &&
      userLogedIn.products.length > 0
    ) {
      const product = productExistedInCart(nameProductDOM)
      if (product) {
        if (product.amount >= amountProductDOM) {
          hideLoading('loadingScreen')
          window.alert('You reach to limited amount of product')
          return
        } else {
          product.amount += 1
          userLogedIn.totalPrice += product.price
        }
      } else {
        userLogedIn.products.push({
          id: productIdDOM,
          productName: nameProductDOM,
          amount: 1,
          price: priceProductDOM,
          imageProduct: imageProductDOM
        })
      }
      const updatedCart = await addProductToCartId(getUserId, userLogedIn)
      if (updatedCart) {
        userLogedIn = updatedCart
        hideLoading('loadingScreen')
      }
    } else {
      const cartValue = new Cart(userLogedIn.user, createAt.toDateString())
      cartValue.products.push({
        id: productIdDOM,
        productName: nameProductDOM,
        amount: 1,
        price: priceProductDOM,
        imageProduct: imageProductDOM
      })
      cartValue.totalPrice += priceProductDOM
      const updatedCart = await addProductToCartId(getUserId, cartValue)
      if (updatedCart) {
        userLogedIn = updatedCart
        hideLoading('loadingScreen')
      }
    }
  } catch (error) {
    console.error(error)
  }
}

function productExistedInCart(nameProductDOM) {
  return userLogedIn.products.find(
    product_ => product_.productName == nameProductDOM
  )
}

function getProducts(productNameInTopSelling) {
  return listProducts.find(
    products => products.productName == productNameInTopSelling
  )
}

function getOrderHistoryByUserLogedIn() {
  return listOrder.filter(
    users => users.user.username == userLogedIn.user.username
  )
}

window.orderHistory = function orderHistory() {
  window.location.href = `../orderHistory/orderHistory.html`
}

window.viewCart = function viewCart() {
  window.location.href = `../viewCart/viewCart.html`
}
window.logOut = function logOut() {
  removeInforUserLogedIn()
  window.location.href = '../loginPage/loginPage.html'
}

window.roleAccessManager = function roleAccessManager() {
  window.location.href = `../../adminPage/managerPage/roleAccessPage/roleAccessPage.html`
}

function getUser() {
  return listUser.find(users => users.username == userLogedIn.user.username)
}
