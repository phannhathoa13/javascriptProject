import { fetchCartFromUserLogedIn } from "../../../controllers/cartControllers.js";
import { fetchListOrder } from "../../../controllers/orderControllers.js";
import {
  hideLoading,
  showLoading,
} from "../../../feautureReuse/loadingScreen.js";
import {
  getValueInQuerryParam,
  postCartIDToParam,
} from "../../../routes/cartRoutes.js";
import { postCartIdAndOrderIDToParam } from "../../../routes/orderRoutes.js";

const getuserId = getValueInQuerryParam("cartID");
const userLogedIn = await fetchCartFromUserLogedIn(getuserId);
const orderList = await fetchListOrder();
const dateOrderDOM = document.getElementById("dateOrder");

displayOrderHistory();

function displayOrderHistory() {
  try {
    showLoading("loadingScreen");
    const orderHistory = getOrderHistory();
    if (orderHistory.length == 0) {
      window.alert("You dont have any order history");
      window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(
        userLogedIn.cartID
      )}`;
    } else {
      displayOderContainerProduct(orderHistory);
    }
  } catch (error) {
    console.log("Display order history get error", error);
  } finally {
    hideLoading("loadingScreen");
  }
}

window.findProductName = function findProductName(event) {
  const productNameInput = event.target.value.toLowerCase();
  const orderHistory = getOrderHistory();

  const startDateValue = document.getElementById('startDate').value;
  const endDateValue = document.getElementById('endDate').value;

  const productSimilar = getProductSimilarInput(productNameInput);

  const filterDateProductSimilar = filterDateInProductSimilar(startDateValue,endDateValue,productSimilar);
  // if (!productSimilar) {
  //   dateOrderDOM.innerHTML = "";
  //   displayOderContainerProduct(orderHistory);
  // }
  // else if (productSimilar) {
  //   dateOrderDOM.innerHTML = "";
  //   displayOderContainerProduct(productSimilar);
  // }
  // else if (productSimilar && !isStartDateAndEndDateHaveOrder(startDateValue,endDateValue)) {
  //   dateOrderDOM.innerHTML = "";
  // }
  // else if (productSimilar && filterDateProductSimilar) {
  //   dateOrderDOM.innerHTML ="";
  //   displayOderContainerProduct(filterDateProductSimilar);
  // }
  
  if(productSimilar.length > 0){
    if (dateOrderDOM) {
      dateOrderDOM.innerHTML = ""
    }
  displayOderContainerProduct(productSimilar);
  }

  console.log(productSimilar);
}

function filterDateInProductSimilar(startDate,endDate,productSimilar){
  const formatStartDate = formatTimeToLocaleDateString(startDate);
  const formatEndDate = formatTimeToLocaleDateString(endDate);

  return productSimilar.filter((order) =>{
    const formatTimeInProductSimilar = formatTimeToLocaleDateString(order.createdAt);
    return formatTimeInProductSimilar >= formatStartDate && formatTimeInProductSimilar <= formatEndDate;
  })
}

function getProductSimilarInput(productNameInput) {
  const orderHistory = getOrderHistory();
  return orderHistory.map((order) => {
    const filterProductName = order.cartList.filter((products) => products.productName.toLowerCase() == productNameInput);
    return {
      ...order,
      cartList: filterProductName,
    }
  }).filter((order) => order.cartList.length > 0)
}

window.findDate = function findDate() {
  const startDateValue = document.getElementById('startDate').value;
  const endDateValue = document.getElementById('endDate').value;
  const productNameInput = document.getElementById('findProductNameId').value;

  const orderHistory = getOrderHistory();
  const productSimilar = getProductSimilarInput(productNameInput);
  const filterDateProductSimilar = filterDateInProductSimilar(startDateValue,endDateValue,productSimilar);

  const filterOrder = filterOrdersByDate(startDateValue, endDateValue);

  if (!isStartDateAndEndDateHaveOrder(startDateValue, endDateValue)) {
    dateOrderDOM.innerHTML = "";
  }
  else if (isStartDateAndEndDateHaveOrder(startDateValue,endDateValue)) {
    dateOrderDOM.innerHTML = "";
    displayOderContainerProduct(filterOrder);
  }
  else if (productSimilar && filterDateProductSimilar) {
    dateOrderDOM.innerHTML = "";
    displayOderContainerProduct(filterDateProductSimilar);
  }
  
}

function filterOrdersByDate(startDate, endDate) {
  const orderHistory = getOrderHistory();
  const updateStarteDate = formatTimeToLocaleDateString(startDate);
  const updateEndDate = formatTimeToLocaleDateString(endDate);

  return orderHistory.filter((order) => {
    const updateTime = formatTimeToLocaleDateString(order.createdAt);
    return updateTime >= updateStarteDate && updateTime <= updateEndDate
  });
}

function isStartDateAndEndDateHaveOrder(startDate, endDate) {
  const orderHistory = getOrderHistory();
  const updateStarteDate = formatTimeToLocaleDateString(startDate);
  const updateEndDate = formatTimeToLocaleDateString(endDate);

  return orderHistory.some((order) => {
    const updateTime = formatTimeToLocaleDateString(order.createdAt);
    return updateTime >= updateStarteDate && updateTime <= updateEndDate
  });
}

function formatTimeToLocaleDateString(time) {
  return new Date(time).toLocaleDateString();
}

function displayOderContainerProduct(orderHistory) {
  try {
    showLoading("loadingScreen");
    const updateToLatestTime = orderHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const updatedTime = [...new Set(updateToLatestTime.map((order) => order.createdAt))];

    updatedTime.forEach((dates) => {
      const orderHistoryDate = getOderSameDate(dates);

      const dateDOM = document.createElement("div");
      dateDOM.style.display = "flex";
      dateDOM.style.margin = "10px";

      const dateOrder = document.createElement("div");
      dateOrder.textContent = dates;
      dateOrder.style.margin = "5px";

      const buttonExtend = document.createElement("button");
      buttonExtend.textContent = "Extend";

      dateOrderDOM.appendChild(dateDOM);
      dateDOM.appendChild(dateOrder);
      dateDOM.appendChild(buttonExtend);

      const orderDiv = document.createElement("div");
      orderDiv.style.marginLeft = "30px";
      orderDiv.style.display = "none";

      orderHistoryDate.forEach((order) => {
        let totalPrice = 0;
        const orderIdDOM = document.createElement("div");
        orderIdDOM.style.margin = "20px";
        orderIdDOM.style.display = "Flex";

        const viewDetails = document.createElement("div");
        viewDetails.textContent = "view details";
        viewDetails.style.marginLeft = "10px";
        viewDetails.style.cursor = "pointer";

        dateOrderDOM.appendChild(orderIdDOM);

        order.cartList.forEach((products) => {
          totalPrice += products.amount * products.price;
          orderIdDOM.textContent = `OrderID: ${order.orderID}, created At ${order.createdAt}, total price: ${totalPrice}$`;

          orderDiv.appendChild(orderIdDOM);
          orderIdDOM.appendChild(viewDetails);

          buttonExtend.onclick = () => {
            displayInforProduct(orderDiv);
          }
          viewDetails.onclick = () => {
            window.location.href = `../orderDetails/orderDetails.html${postCartIdAndOrderIDToParam(userLogedIn.cartID, order.orderID)}`;
          }
          dateOrderDOM.appendChild(orderDiv);
        })
      })
    })
  } catch (error) {
    console.log("Display list product get error", error);
  }
  finally {
    hideLoading("loadingScreen");
  }
}

function displayInforProduct(productsDOM) {
  if (productsDOM.style.display == "none") {
    productsDOM.style.display = "block";
  } else {
    productsDOM.style.display = "none";
  }
}

function getOderSameDate(DateDOM) {
  const orderHistory = getOrderHistory();
  return orderHistory.filter((order) => order.createdAt == DateDOM)
}


function getOrderHistory() {
  const usernameByUserLoggedIn = userLogedIn.user.username;
  return orderList.filter(
    (order) => order.user.username == usernameByUserLoggedIn
  );
}

window.back = function back() {
  window.location.href = `../shoppingCart/shoppCart.html${postCartIDToParam(
    getuserId
  )}`;
};





