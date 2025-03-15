import { fetchCartFromUserLogedIn } from "../../../controllers/cartControllers.js";
import { fetchListOrder } from "../../../controllers/orderControllers.js";
import { getValueSeasion, roleCanAccessFeature } from "../../../feautureReuse/checkRoleUser/checkRoleUser.js";
import {
  hideLoading,
  showLoading,
} from "../../../feautureReuse/loadingScreen.js";
import { postOrderIdToParam } from "../../../routes/orderRoutes.js";

const getUserId = getValueSeasion('idUserLogedIn');
const userLogedIn = await fetchCartFromUserLogedIn(getUserId);
const orderList = await fetchListOrder();
const dateOrderDOM = document.getElementById("dateOrder");

roleCanAccessFeature(["CUSTOMER", "USERADMIN", "OWNER"]);



displayOrderHistory();

function displayOrderHistory() {
  try {
    showLoading("loadingScreen");
    const orderHistory = getOrderHistory();
    if (orderHistory.length == 0) {
      window.alert("You dont have any order history");
      window.location.href = `../shoppingCart/shoppCart.html`;
    } else {
      displayOrderContainerProducts(orderHistory, "none");
      console.log(orderHistory);
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

  const formatStartDate = new Date(startDateValue).toDateString();
  const formatEndDate = new Date(endDateValue).toDateString();

  const productSimilar = getProductSimilarInput(productNameInput);
  const orderByDate = filterOrdersByDate(formatStartDate, formatEndDate);
  const orderExistInDate = getThatProductExistInDate(formatStartDate, formatEndDate, productSimilar);

  if (productNameInput == "" && !startDateValue && !endDateValue) {
    dateOrderDOM.innerHTML = "";
    displayOrderContainerProducts(orderHistory, "none");
  }
  else if (productNameInput == "" && startDateValue && endDateValue) {
    dateOrderDOM.innerHTML = "";
    displayOrderContainerProducts(orderByDate, "inline-block");
  }
  else if (!productSimilar && startDateValue && endDateValue) {
    dateOrderDOM.innerHTML = "";
    displayOrderContainerProducts(orderByDate, "inline-block");
  }
  else if (productSimilar && !startDateValue && !endDateValue) {
    dateOrderDOM.innerHTML = "";
    displayOrderContainerProducts(productSimilar, "inline-block");
  }
  else if (orderExistInDate) {
    dateOrderDOM.innerHTML = "";
    displayOrderContainerProducts(orderExistInDate, "inline-block");
  }
}

function getProductSimilarInput(productNameInput) {
  const orderHistory = getOrderHistory();
  return orderHistory.filter((order) => order.cartList.some((products) => products.productName.toLowerCase().includes(productNameInput.toLowerCase())))
}

window.findDate = function findDate() {
  const orderHistory = getOrderHistory();
  const startDateValue = document.getElementById('startDate').value;
  const endDateValue = document.getElementById('endDate').value;

  const formatStartDate = new Date(startDateValue).toDateString();
  const formatEndDate = new Date(endDateValue).toDateString();

  const productNameInput = document.getElementById('findProductNameId').value;
  if (startDateValue && endDateValue) {
    const productSimilar = getProductSimilarInput(productNameInput);
    const orderByDate = filterOrdersByDate(formatStartDate, formatEndDate);
    const orderExistInDate = getThatProductExistInDate(formatStartDate, formatEndDate, productSimilar);

    if (productNameInput) {
      if (!orderByDate || orderByDate.length == 0) {
        dateOrderDOM.innerHTML = "";
        window.alert("You don't have any order");
      }
      else if (!orderExistInDate || orderExistInDate.length == 0) {
        dateOrderDOM.innerHTML = "";
        window.alert("You don't have any order");
      }
      else if (orderExistInDate) {
        dateOrderDOM.innerHTML = "";
        displayOrderContainerProducts(orderExistInDate, "inline-block");
      }
    }
    else {
      if (!orderByDate || orderByDate.length == 0) {
        dateOrderDOM.innerHTML = "";
        window.alert("You don't have any order");
      }
      else {
        dateOrderDOM.innerHTML = "";
        displayOrderContainerProducts(orderByDate, "inline-block")
      }
    }
  }
  else {
    if (!productNameInput) {
      dateOrderDOM.innerHTML = "";
      displayOrderContainerProducts(orderHistory, "none");
    }
  }

}

function getThatProductExistInDate(startDate, endDate, productSimilar) {
  const formatStartDate = formatTime(startDate);
  const formatEndDate = formatTime(endDate);

  return productSimilar.filter((order) => {
    const formatOrderDate = formatTime(order.createdAt);
    return formatOrderDate >= formatStartDate && formatOrderDate <= formatEndDate
  });
}

function filterOrdersByDate(startDate, endDate) {
  const orderHistory = getOrderHistory();
  const formatStartDate = formatTime(startDate);
  const formatEndDate = formatTime(endDate);

  return orderHistory.filter((order) => {
    const formatOrderDate = formatTime(order.createdAt);
    return formatOrderDate >= formatStartDate && formatOrderDate <= formatEndDate
  });
}

function formatTime(time) {
  return new Date(time).getTime();
}

function displayOrderContainerProducts(orderHistory, orderDivDOMStyleDisplay) {
  try {
    showLoading("loadingScreen");
    const updateToLatestTime = orderHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const filterDateSimilar = [...new Set(updateToLatestTime.map((order) => order.createdAt))];

    filterDateSimilar.forEach((dates) => {
      const orderHistoryDate = getOderSameDate(updateToLatestTime, dates);

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

      const orderDivFather = document.createElement("div");
      orderDivFather.style.marginLeft = "30px";
      orderDivFather.style.display = orderDivDOMStyleDisplay;

      orderHistoryDate.forEach((order) => {
        const orderContainerProduct = document.createElement("div");
        orderContainerProduct.style.margin = "20px";
        orderContainerProduct.style.display = "Flex";

        const viewDetails = document.createElement("div");
        viewDetails.textContent = "view details";
        viewDetails.style.marginLeft = "10px";
        viewDetails.style.cursor = "pointer";

        orderContainerProduct.textContent = `OrderID: ${order.orderID}, created At ${order.createdAt}, total price: ${order.totalPrice}$`;
        orderDivFather.appendChild(orderContainerProduct);
        orderContainerProduct.appendChild(viewDetails);
        dateOrderDOM.appendChild(orderDivFather);

        buttonExtend.onclick = () => {
          displayInforProduct(orderDivFather);
        }

        viewDetails.onclick = () => {
          window.location.href = `../orderDetails/orderDetails.html${postOrderIdToParam(order.orderID)}`;
        }

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

function getOderSameDate(orderSameDate, DateDOM) {
  return orderSameDate.filter((order) => order.createdAt == DateDOM)
}


function getOrderHistory() {
  const usernameByUserLoggedIn = userLogedIn.user.username;
  return orderList.filter(
    (order) => order.user.username == usernameByUserLoggedIn
  );
}

window.back = function back() {
  window.location.href = `../shoppingCart/shoppCart.html`;
};





