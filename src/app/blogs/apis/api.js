import axios from "axios";
import { toCDN } from "../helper";

/**
 * DACBY Blogs API Configuration & Endpoints
 */
export const CLOUD_FUNCTIONS_BASE_URL =
  "https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi";

export const DATABASE_WEB_APP_BASE_URL = "https://dacby-database.web.app";

export const BLOGS_BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZCI6InhpYW9taS9naW5rZ28vZ2lua2dvOjExL1JLUTEuMjAxMDA0LjAwMi9WMTIuNS4yLjAuUkNPSU5YTTp1c2VyL3JlbGVhc2Uta2V5cyIsInBsYXRmb3JtIjoiYW5kcm9pZCIsImRldmljZVR5cGUiOiJzbWFydHBob25lIiwiaXBBZGRyZXNzIjoiMjIzLjE4MS4zNC4yMTQiLCJpYXQiOjE3NTEyNjQ2ODcsImV4cCI6MTc1MTM1MTA4N30.FULHzuzg_dgq6NeQRFgJzxHcuKu4I-7e8d91fWFCTyw";

export const ENDPOINTS = {
  addBlog: `${CLOUD_FUNCTIONS_BASE_URL}/api/blogs/add`,
  editBlog: `${CLOUD_FUNCTIONS_BASE_URL}/api/blogs/edit`,
  deleteBlog: `${CLOUD_FUNCTIONS_BASE_URL}/api/blogs/delete`,
  getBlogs: `${DATABASE_WEB_APP_BASE_URL}/blogs`,
  getBlogDetail: (id) => `${DATABASE_WEB_APP_BASE_URL}/blogs/${encodeURIComponent(id)}`,
};

/**
 * Standard Auth Headers for DACBY Database Web App
 */
const getAuthHeaders = (extraHeaders = {}) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${BLOGS_BEARER_TOKEN}`,
  ...extraHeaders,
});

/**
 * Helper to extract standardized error messages from API response
 */
function extractErrorMessage(error, defaultMessage) {
  return (
    error?.response?.data?.details ||
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    defaultMessage
  );
}

/**
 * 1. GET ALL BLOGS
 * Fetches all blogs along with page banners.
 *
 * Endpoint: GET https://dacby-database.web.app/blogs
 * Headers: Authorization: Bearer <token>
 *
 * @param {Object} [options]
 * @param {string} [options.token] - Optional custom Bearer token
 * @returns {Promise<{ page_banners: Object, blogs: Array<Object> }>}
 */
export async function getBlogs(options = {}) {
  const token = options.token || BLOGS_BEARER_TOKEN;

  try {
    const response = await axios.get(ENDPOINTS.getBlogs, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response?.data || {};
    return {
      page_banners: data.page_banners || { banner_web: "", banner_mobile: "" },
      blogs: Array.isArray(data.blogs) ? data.blogs : [],
      rawResponse: data,
    };
  } catch (error) {
    const errorMsg = extractErrorMessage(error, "Failed to fetch blogs from database.");
    console.error("Error in getBlogs:", errorMsg, error);
    throw new Error(errorMsg);
  }
}

/**
 * 2. GET BLOG BY ID
 * Fetches full details of a single blog.
 *
 * Endpoint: GET https://dacby-database.web.app/blogs/{id}
 * Headers: Authorization: Bearer <token>
 *
 * @param {string} id - The unique Firestore blog document ID
 * @param {Object} [options]
 * @param {string} [options.token] - Optional custom Bearer token
 * @returns {Promise<Object>} Single blog object
 */
export async function getBlogById(id, options = {}) {
  if (!id || typeof id !== "string") {
    throw new Error("A valid blog ID is required to fetch blog details.");
  }

  const token = options.token || BLOGS_BEARER_TOKEN;

  try {
    const response = await axios.get(ENDPOINTS.getBlogDetail(id.trim()), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const blog = response?.data || null;
    if (!blog) {
      throw new Error(`Blog with ID "${id}" was not found.`);
    }

    return blog;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, `Failed to fetch blog with ID "${id}".`);
    console.error("Error in getBlogById:", errorMsg, error);
    throw new Error(errorMsg);
  }
}

/**
 * 3. ADD BLOG
 * Creates and publishes a new blog post.
 *
 * Endpoint: POST https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi/api/blogs/add
 * Payload:
 * {
 *   content: [
 *     {
 *       heading: string,
 *       para: string,
 *       image: string,
 *       backlinks: [{ anchor: string, url: string }]
 *     }
 *   ],
 *   hashtags: string[],
 *   top_image: string,
 *   visible: boolean
 * }
 *
 * @param {Object} blogData
 * @param {Array<Object>} blogData.content - Array of content sections
 * @param {Array<string>} [blogData.hashtags] - Array of hashtag tags
 * @param {string} [blogData.top_image] - Top cover image URL
 * @param {boolean} [blogData.visible=true] - Visibility flag
 * @returns {Promise<{ success: boolean, message: string, id: string }>}
 */
export async function addBlog(blogData = {}) {
  try {
    const cleanedContent = Array.isArray(blogData.content)
      ? blogData.content.map((sec) => ({
          heading: (sec?.heading || "").trim(),
          para: (sec?.para || "").trim(),
          image: toCDN((sec?.image || "").trim()),
          backlinks: Array.isArray(sec?.backlinks)
            ? sec.backlinks
                .filter((b) => b && (b.anchor || b.url))
                .map((b) => ({
                  anchor: (b.anchor || "").trim(),
                  url: (b.url || "").trim(),
                }))
            : [],
        }))
      : [];

    const cleanedHashtags = Array.isArray(blogData.hashtags)
      ? blogData.hashtags.map((tag) => String(tag).trim()).filter(Boolean)
      : [];

    const payload = {
      content: cleanedContent,
      hashtags: cleanedHashtags,
      top_image: toCDN((blogData.top_image || "").trim()),
      visible: typeof blogData.visible === "boolean" ? blogData.visible : true,
    };

    const response = await axios.post(ENDPOINTS.addBlog, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response?.data || {};
    return {
      success: Boolean(data.success),
      message: data.message || "Blog added",
      id: data.id || "",
      rawResponse: data,
    };
  } catch (error) {
    const errorMsg = extractErrorMessage(error, "Failed to add blog.");
    console.error("Error in addBlog:", errorMsg, error);
    throw new Error(errorMsg);
  }
}

/**
 * 4. EDIT BLOG
 * Updates an existing blog post. Uses the same payload structure as add blog, but requires `id`.
 *
 * Endpoint: POST https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi/api/blogs/edit
 * Payload:
 * {
 *   id: string,
 *   content: Array<Object>,
 *   hashtags: string[],
 *   top_image: string,
 *   visible: boolean
 * }
 *
 * @param {Object} blogData
 * @param {string} blogData.id - Unique ID of the blog to edit
 * @returns {Promise<{ success: boolean, message: string, id: string }>}
 */
export async function editBlog(blogData = {}) {
  const blogId = (blogData.id || "").trim();
  if (!blogId) {
    throw new Error("A valid blog 'id' is required to update a blog.");
  }

  try {
    const payload = {
      id: blogId,
      ...(typeof blogData.visible === "boolean" && { visible: blogData.visible }),
      ...(Array.isArray(blogData.hashtags) && {
        hashtags: blogData.hashtags.map((tag) => String(tag).trim()).filter(Boolean),
      }),
      ...(typeof blogData.top_image === "string" && {
        top_image: toCDN(blogData.top_image.trim()),
      }),
      ...(Array.isArray(blogData.content) && {
        content: blogData.content.map((sec) => ({
          heading: (sec?.heading || "").trim(),
          para: (sec?.para || "").trim(),
          image: toCDN((sec?.image || "").trim()),
          backlinks: Array.isArray(sec?.backlinks)
            ? sec.backlinks
                .filter((b) => b && (b.anchor || b.url))
                .map((b) => ({
                  anchor: (b.anchor || "").trim(),
                  url: (b.url || "").trim(),
                }))
            : [],
        })),
      }),
    };

    const response = await axios.post(ENDPOINTS.editBlog, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response?.data || {};
    return {
      success: Boolean(data.success),
      message: data.message || "Blog updated",
      id: data.id || blogId,
      rawResponse: data,
    };
  } catch (error) {
    const errorMsg = extractErrorMessage(error, `Failed to update blog with ID "${blogId}".`);
    console.error("Error in editBlog:", errorMsg, error);
    throw new Error(errorMsg);
  }
}

/**
 * 5. DELETE BLOG
 * Deletes an existing blog post by ID.
 *
 * Endpoint: POST https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi/api/blogs/delete
 * Payload: { id: string }
 *
 * @param {string|{ id: string }} idOrPayload - Blog ID string or object containing id
 * @returns {Promise<{ success: boolean, message: string, id: string }>}
 */
export async function deleteBlog(idOrPayload) {
  const blogId = typeof idOrPayload === "string" ? idOrPayload.trim() : (idOrPayload?.id || "").trim();

  if (!blogId) {
    throw new Error("A valid blog 'id' is required to delete a blog.");
  }

  try {
    const response = await axios.post(
      ENDPOINTS.deleteBlog,
      { id: blogId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response?.data || {};
    return {
      success: Boolean(data.success),
      message: data.message || "Blog deleted",
      id: data.id || blogId,
      rawResponse: data,
    };
  } catch (error) {
    const errorMsg = extractErrorMessage(error, `Failed to delete blog with ID "${blogId}".`);
    console.error("Error in deleteBlog:", errorMsg, error);
    throw new Error(errorMsg);
  }
}

