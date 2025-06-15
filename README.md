[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19734008&assignment_repo_type=AssignmentRepo)

# P2-Challenge-1 (Server Side)

> Tuliskan API Docs kamu di sini

# Restaurant API Documentation

P2-Challenge-1 (Server Side)

**DOMAIN :** [https://hizkiajonathanbudiana.my.id](https://hizkiajonathanbudiana.my.id)

**AWS Public IP Address:** [http://13.229.119.47/](http://13.229.119.47/)

## Endpoint Lists

- `POST /register`
- `POST /login`
- `GET /pub/cuisines`
- `GET /pub/cuisines/:id`
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`
- `POST /cuisines`
- `PUT /cuisines/:id`
- `DELETE /cuisines/:id`
- `PATCH /cuisines/:id`

---

### **1. POST /register**

**Description:** Registers a new user (role `Staff`). This endpoint can only be accessed by users with the `Admin` role.

**Request:**

- **Headers:**
  ```json
  {
    "Authorization": "Bearer <admin_access_token>"
  }
  ```
- **Body:**
  ```json
  {
    "email": "string (required, unique)",
    "password": "string (required, minimum 5 characters)",
    "username": "string (optional)",
    "phoneNumber": "string (optional)",
    "address": "string (optional)"
  }
  ```

**Responses:**

- **201 - Created**
  ```json
  {
    "message": "User with id 7 successfully created !"
  }
  ```
- **400 - Bad Request (Validation Error)**
  _The error message will be an array containing all failed validations from the model._
  ```json
  {
    "error": [
      "Email cant empty",
      "Wrong format email",
      "email already used, please choose another",
      "Password cant empty",
      "Password length minimal is 5"
    ]
  }
  ```
- **401 - Unauthorized**
  _Occurs if the token is invalid or not sent._
  ```json
  {
    "error": "Invalid token"
  }
  ```
- **403 - Forbidden**
  _Occurs if the accessing user is not an `Admin`._
  ```json
  {
    "error": "Not Authorized"
  }
  ```

---

### **2. POST /login**

**Description:** Login to get an `access_token`.

**Request:**

- **Body:**
  ```json
  {
    "email": "string (required)",
    "password": "string (required)"
  }
  ```

**Responses:**

- **200 - OK**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzQ5ODI3MTczfQ.iQgwws29mXhjljeZIj_ngI816biPIoD8xG57UOB6SRQ"
  }
  ```
- **400 - Bad Request**
  _Occurs if email or password is not provided._
  ```json
  {
    "error": "Please input email and password"
  }
  ```
- **401 - Unauthorized**
  _Occurs if the email or password is wrong._
  ```json
  {
    "error": "Invalid email / password"
  }
  ```

---

### **3. GET /pub/cuisines or /cuisines**

**Description:** Displays all cuisine data. This endpoint (/pub/cuisines) is public and does not require authentication. Meanwhile, endpoint (/cuisines) does require authentication.

**Request:**

- Does not require Headers or Body.
- **Query Params:**

  - `search` (optional): `string` - Searches for cuisines by name (case-insensitive search).
  - `filter` (optional): `integer` - Filters cuisines by `categoryId`.
  - `sort` (optional): `string` - Sorts data by creation date. Options: `ASC` (oldest) or `DESC` (newest).
  - `page` (optional): `integer` - Page number for pagination. The default is page `1`. The size per page is 10 items.

- **Example Full URL:**
  ```
  /pub/cuisines?search=nasi&filter=2&sort=DESC&page=1
  ```

**Response:**

- **200 - OK**
  ```json
  {
    "total": 22,
    "size": 10,
    "totalPage": 3,
    "currentPage": 1,
    "data": [
      {
        "id": 1,
        "name": "Bruschetta Classico",
        "description": "Crispy toasted bread with fresh tomato, garlic, basil, and olive oil toppings.",
        "price": 45000,
        "imgUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FRestaurant&psig=AOvVaw0Z1OPkwkzfWvavxTF8Vqw9&ust=1749862917146000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPD6rL-Z7Y0DFQAAAAAdAAAAABAE",
        "categoryId": 1,
        "authorId": 1,
        "createdAt": "2025-06-13T13:21:15.420Z",
        "updatedAt": "2025-06-13T13:21:15.420Z",
        "User": {
          "id": 1,
          "username": "admin_satu",
          "email": "admin1@mail.com",
          "role": "Admin",
          "phoneNumber": "081211112222",
          "address": "Jl. Merdeka No. 1, Jakarta",
          "createdAt": "2025-06-13T13:21:15.296Z",
          "updatedAt": "2025-06-13T13:21:15.296Z"
        },
        "Category": {
          "id": 1,
          "name": "Appetizer",
          "createdAt": "2025-06-13T13:21:15.409Z",
          "updatedAt": "2025-06-13T13:21:15.409Z"
        }
      }
    ]
  }
  ```

---

### **4. GET /pub/cuisines/:id or /cuisines/:id**

**Description:** Displays the details of a single cuisine based on ID. This endpoint(/pub/cuisines/:id) is public. Meanwhile, endpoint (/cuisines) does require authentication.

**Request:**

- **Params:**
  - `id`: `integer (required)` - ID of the Cuisine.

**Responses:**

- **200 - OK**
  ```json
  {
    "postDetails": {
      "id": 1,
      "name": "Bruschetta Classico",
      "description": "Crispy toasted bread with fresh tomato, garlic, basil, and olive oil toppings.",
      "price": 45000,
      "imgUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FRestaurant&psig=AOvVaw0Z1OPkwkzfWvavxTF8Vqw9&ust=1749862917146000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPD6rL-Z7Y0DFQAAAAAdAAAAABAE",
      "categoryId": 1,
      "authorId": 1,
      "createdAt": "2025-06-13T13:21:15.420Z",
      "updatedAt": "2025-06-13T13:21:15.420Z",
      "User": {
        "id": 1,
        "username": "admin_satu",
        "email": "admin1@mail.com",
        "role": "Admin",
        "phoneNumber": "081211112222",
        "address": "Jl. Merdeka No. 1, Jakarta",
        "createdAt": "2025-06-13T13:21:15.296Z",
        "updatedAt": "2025-06-13T13:21:15.296Z"
      },
      "Category": {
        "id": 1,
        "name": "Appetizer",
        "createdAt": "2025-06-13T13:21:15.409Z",
        "updatedAt": "2025-06-13T13:21:15.409Z"
      }
    }
  }
  ```
- **404 - Not Found**
  _Occurs if the Cuisine with the given `id` is not found._
  ```json
  {
    "error": "Data not found"
  }
  ```

---

### **5. GET /categories**

**Description:** Displays all cuisine categories. Requires login.

**Request:**

- **Headers:**
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```

**Response:**

- **200 - OK**
  ```json
  {
    "categories": [
      {
        "id": 1,
        "name": "Appetizer",
        "createdAt": "2025-06-13T13:21:15.409Z",
        "updatedAt": "2025-06-13T13:21:15.409Z"
      },
      {
        "id": 2,
        "name": "Main Course",
        "createdAt": "2025-06-13T13:21:15.409Z",
        "updatedAt": "2025-06-13T13:21:15.409Z"
      }
    ]
  }
  ```
- **401 - Unauthorized**
  ```json
  {
    "error": "Invalid token"
  }
  ```

---

### **6. POST /categories**

**Description:** Creates a new category. Requires login.

**Request:**

- **Headers:**
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Body:**
  ```json
  {
    "name": "string (required)"
  }
  ```

**Responses:**

- **201 - Created**
  ```json
  {
    "createdCategory": {
      "id": 7,
      "name": "Fast Food",
      "updatedAt": "2025-06-13T14:53:36.770Z",
      "createdAt": "2025-06-13T14:53:36.770Z"
    }
  }
  ```
- **400 - Bad Request**
  _Occurs if `name` validation fails (empty)._
  ```json
  {
    "error": ["Category cant empty"]
  }
  ```
- **401 - Unauthorized**
  ```json
  {
    "error": "Invalid token"
  }
  ```

---

### **7. PUT /categories/:id**

**Description:** Updates category data by ID. Requires login.

**Request:**

- **Headers:**
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Params:**
  - `id`: `integer (required)` - ID of the Category.
- **Body:**
  ```json
  {
    "name": "string (required)"
  }
  ```

**Responses:**

- **200 - OK**
  ```json
  {
    "updatedCategory": {
      "id": 7,
      "name": "Fast Foods",
      "createdAt": "2025-06-13T14:53:36.770Z",
      "updatedAt": "2025-06-13T14:54:41.721Z"
    }
  }
  ```
- **404 - Not Found**
  ```json
  {
    "error": "Data not found"
  }
  ```
- **401 - Unauthorized**
  ```json
  {
    "error": "Invalid token"
  }
  ```
- **403 - Forbidden**
  ```json
  {
    "error": "Not Authorized"
  }
  ```

---

### **8. DELETE /categories/:id**

**Description:** Deletes a category by ID. Requires login.

**Request:**

- **Headers:**
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Params:**
  - `id`: `integer (required)` - ID of the Category.

**Responses:**

- **200 - OK**
  ```json
  {
    "message": "Fast Foods success to delete"
  }
  ```
- **404 - Not Found**
  ```json
  {
    "error": "Data not found"
  }
  ```
- **401 - Unauthorized**
  ```json
  {
    "error": "Invalid token"
  }
  ```

---

### **9. POST /cuisines**

**Description:** Creates new cuisine data. Can only be accessed by `Admin`.

**Request:**

- **Headers:**
  ```json
  {
    "Authorization": "Bearer <admin_access_token>"
  }
  ```
- **Body (`form-data`):**
  - `name`: `string (required)`
  - `description`: `string (required)`
  - `price`: `integer (required, minimum 1000)`
  - `categoryId`: `integer (required)`
  - `image`: `file (required)`

**Responses:**

- **201 - Created**
  ```json
  {
    "createdPost": {
      "id": 24,
      "name": "KFC",
      "description": "Crispy Chicken",
      "price": 1000,
      "imgUrl": "https://res.cloudinary.com/dffbvex6y/image/upload/v1749791932/cuisine_KFC.jpg",
      "categoryId": 2,
      "authorId": 3,
      "updatedAt": "2025-06-13T15:22:32.144Z",
      "createdAt": "2025-06-13T15:22:32.144Z"
    }
  }
  ```
- **400 - Bad Request (Validation)**
  ```json
  {
    "error": [
      "Name cant empty",
      "Description cant empty",
      "Price cant empty",
      "Minimal price is Rp. 1.000,00",
      "Category cant empty"
    ]
  }
  ```
- **400 - Bad Request (No Img)**

  ```json
  {
    "error": "Image is required"
  }
  ```

- **401 - Unauthorized**
  ```json
  {
    "error": "Invalid token"
  }
  ```

---

### **10. PUT /cuisines/:id**

**Description:** Updates cuisine data by ID. Can only be accessed by `Admin` or the creator of the cuisine (`Staff` concerned).

**Request:**

- **Headers:**
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Params:**
  - `id`: `integer (required)` - ID of the Cuisine.
- **Body (`form-data`):**
  - `name`: `string (required)`
  - `description`: `string (required)`
  - `price`: `integer (required, minimum 1000)`
  - `categoryId`: `integer (required)`
  - `image`: `file (optional)`

**Responses:**

- **200 - OK**
  ```json
  {
    "updatedPost": {
      "id": 25,
      "name": "KFC",
      "description": "Crispy Chicken",
      "price": 1000,
      "imgUrl": "https://res.cloudinary.com/dffbvex6y/image/upload/v1749791932/cuisine_KFC.jpg",
      "categoryId": 2,
      "authorId": 6,
      "createdAt": "2025-06-13T15:25:39.406Z",
      "updatedAt": "2025-06-13T15:25:53.857Z"
    }
  }
  ```
- **404 - Not Found**
  ```json
  {
    "error": "Data not found"
  }
  ```
- **403 - Forbidden**
  ```json
  {
    "error": "Not Authorized"
  }
  ```
- **401 - Unauthorized**
  ```json
  {
    "error": "Invalid token"
  }
  ```

---

### **11. DELETE /cuisines/:id**

**Description:** Deletes cuisine data by ID. Can only be accessed by `Admin` or its creator.

**Request:**

- **Headers:**
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Params:**
  - `id`: `integer (required)` - ID of the Cuisine.

**Responses:**

- **200 - OK**
  ```json
  {
    "message": "Cuisine with id 3 has been deleted"
  }
  ```
- **404 - Not Found**
  ```json
  {
    "error": "Data not found"
  }
  ```
- **403 - Forbidden**
  ```json
  {
    "error": "Not Authorized"
  }
  ```
- **401 - Unauthorized**
  ```json
  {
    "error": "Invalid token"
  }
  ```

---

### **12. PATCH /cuisines/:id**

**Description:** Updates the cuisine image by ID. Can only be accessed by `Admin` or its creator.

**Request:**

- **Headers:**
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```
- **Params:**
  - `id`: `integer (required)` - ID of the Cuisine.
- **Body (`form-data`):**
  - `image`: `file (required)`

**Responses:**

- **200 - OK**
  ```json
  {
    "message": "Image for Cuisine with id 3 has been updated"
  }
  ```
- **400 - Bad Request (No Image)**
  ```json
  {
    "error": "Image is required"
  }
  ```
- **404 - Not Found**
  ```json
  {
    "error": "Data not found"
  }
  ```
- **403 - Forbidden**
  ```json
  {
    "error": "Not Authorized"
  }
  ```
- **401 - Unauthorized**
  ```json
  {
    "error": "Invalid token"
  }
  ```

---

## Global Errors

The following errors can occur globally on many endpoints.

- **500 - Internal Server Error**
  _Occurs if there is an unexpected error on the server._
  ```json
  {
    "error": "Internal Server Error"
  }
  ```
