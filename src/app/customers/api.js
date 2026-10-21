import axios from "axios";
// https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi/api/wallet/add-money
// {
//     "userId": "o7c3upYdXDVnqclgLxQs",
//     "amount": 1,
//     "action": "credit",
//     "reason": "Broken Case"
// }
const BASE_URL =
  "https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi";

const GET_USER_BY_ID = (userId) =>
  `${BASE_URL}/api/Users/${encodeURIComponent(userId)}`;
const GET_USER_ORDERS = `${BASE_URL}/api/orders/user-orders`;
const ADD_WALLET_MONEY = `${BASE_URL}/api/wallet/add-money`;
const SEARCH_USERS = `${BASE_URL}/api/Users/search`;

/**
 * Fetch customer / user details by userId.
 *
 * @param {string} userId - Customer's user ID.
 * @returns {Promise<object>} User details data.
 */
export async function getUserById(userId) {
  if (!userId) {
    throw new Error("User ID is required to fetch user details");
  }

  try {
    const { data } = await axios.get(GET_USER_BY_ID(userId));

    if (data?.success === false) {
      throw new Error(data.message || "Failed to load user details");
    }
    if (data?.error) {
      throw new Error(data.error || "Failed to load user details");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to load user details";
    throw new Error(message);
  }
}

/**
 * Fetch orders placed by a specific user.
 * Accepts either a userId string or a payload object { userId: "..." }.
 *
 * @param {string|{ userId: string }} payloadOrUserId
 * @returns {Promise<object>} User orders data.
 */
export async function getUserOrders(payloadOrUserId) {
  let userId = "";
  if (typeof payloadOrUserId === "string") {
    userId = payloadOrUserId;
  } else if (payloadOrUserId && typeof payloadOrUserId === "object") {
    userId = payloadOrUserId.userId || payloadOrUserId.id || "";
  }

  if (!userId) {
    throw new Error("User ID is required to fetch user orders");
  }

  const payload = { userId };

  try {
    const { data } = await axios.post(GET_USER_ORDERS, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // If API returns false success with a "no orders" message, treat as empty list
    if (data?.success === false) {
      const msg = String(data.message || "").toLowerCase();
      if (
        msg.includes("no order") ||
        msg.includes("not found") ||
        msg.includes("empty") ||
        msg.includes("zero")
      ) {
        return { orders: [], message: data.message };
      }
      throw new Error(data.message || "Failed to load user orders");
    }

    if (data?.error) {
      const errStr = String(data.error).toLowerCase();
      if (
        errStr.includes("no order") ||
        errStr.includes("not found") ||
        errStr.includes("empty")
      ) {
        return { orders: [], message: data.error };
      }
      throw new Error(data.error || "Failed to load user orders");
    }

    return data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return { orders: [], message: "No orders found" };
    }

    const resMsg = String(
      error?.response?.data?.message || error?.response?.data?.error || ""
    ).toLowerCase();
    if (resMsg.includes("no order") || resMsg.includes("not found")) {
      return { orders: [], message: resMsg };
    }

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to load user orders";
    throw new Error(message);
  }
}

// Aliases for convenience matching common naming patterns across the project
export const getUserDetails = getUserById;
export const fetchUserOrders = getUserOrders;

/**
 * Fetch customer details and user orders concurrently using Promise.all.
 *
 * @param {string} userId - Customer's user ID.
 * @returns {Promise<[object, object]>} Tuple of [customerData, ordersData]
 */
export async function getCustomerWithOrders(userId) {
  if (!userId) {
    throw new Error("User ID is required to fetch customer details and orders");
  }
  return Promise.all([
    getUserDetails(userId),
    fetchUserOrders(userId),
  ]);
}

/**
 * Add / credit money to customer wallet.
 *
 * @param {{ userId: string, amount: number, action?: string, reason?: string }} payload
 * @returns {Promise<object>} Result payload.
 */
export async function addWalletMoney(payload) {
  if (!payload?.userId) {
    throw new Error("User ID is required to add wallet money");
  }
  if (typeof payload?.amount !== "number" || payload.amount <= 0) {
    throw new Error("Valid amount is required");
  }

  try {
    const { data } = await axios.post(
      ADD_WALLET_MONEY,
      {
        action: "credit",
        ...payload,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data?.success === false) {
      throw new Error(data.message || "Failed to add wallet money");
    }
    if (data?.error) {
      throw new Error(data.error || "Failed to add wallet money");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to add wallet money";
    throw new Error(message);
  }
}

/**
 * Search users by phone number.
 * Endpoint: POST /api/Users/search { "phone_number": string }
 *
 * @param {string|number} phoneNumber
 * @returns {Promise<{ success: boolean, users: Array<object>, total: number, phone_number: string }>}
 */
export async function searchUsers(phoneNumber) {
  if (!phoneNumber) {
    throw new Error("Phone number is required to search users");
  }

  try {
    const { data } = await axios.post(
      SEARCH_USERS,
      {
        phone_number: String(phoneNumber).trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data?.error) {
      throw new Error(data.error || "Failed to search users");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to search users";
    throw new Error(message);
  }
}


