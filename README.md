Run the below command to start the server.
```sh
npm install && npm start
```


load 
```
book-rating-system-api.postman_collection.json
```
into postman for examples of the APIs.

# Project: book-rating-system-api
# 🚀 Get started here

This collection guides you through CRUD operations (GET, POST, PUT, DELETE), variables, and tests.

## 🔖 **How to use this collection**

#### **Step 1: Send requests**

RESTful APIs allow you to perform CRUD operations using the POST, GET, PUT, and DELETE HTTP methods.

This collection contains each of these request types. Open each request and click "Send" to see what happens.

#### **Step 2: View responses**

Observe the response tab for status code (200 OK), response time, and size.

#### **Step 3: Send new Body data**

Update or add new data in "Body" in the POST request. Typically, Body data is also used in PUT and PATCH requests.

```
{
    "name": "Add your name in the body"
}

```

#### **Step 4: Update the variable**

Variables enable you to store and reuse values in Postman. We have created a variable called `base_url` with the sample request [https://postman-api-learner.glitch.me](https://postman-api-learner.glitch.me). Replace it with your API endpoint to customize this collection.

#### **Step 5: Add tests in the "Tests" tab**

Tests help you confirm that your API is working as expected. You can write test scripts in JavaScript and view the output in the "Test Results" tab.

<img src="https://content.pstmn.io/b5f280a7-4b09-48ec-857f-0a7ed99d7ef8/U2NyZWVuc2hvdCAyMDIzLTAzLTI3IGF0IDkuNDcuMjggUE0ucG5n">

## 💪 Pro tips

- Use folders to group related requests and organize the collection.
- Add more scripts in "Tests" to verify if the API works as expected and execute flows.
    

## ℹ️ Resources

[Building requests](https://learning.postman.com/docs/sending-requests/requests/)  
[Authorizing requests](https://learning.postman.com/docs/sending-requests/authorization/)  
[Using variables](https://learning.postman.com/docs/sending-requests/variables/)  
[Managing environments](https://learning.postman.com/docs/sending-requests/managing-environments/)  
[Writing scripts](https://learning.postman.com/docs/writing-scripts/intro-to-scripts/)

## End-point: User Login
### Method: POST
>```
>http://localhost:3000/users/login
>```
### Body (**raw**)

```json
{
    "email": "admin1@london.ac.uk",
    "password": "admin1password"
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 400
```json
{
    "error": "invalid email or password"
}
```

### Response: 200
```json
{
    "user": {
        "id": 1,
        "email": "admin1@london.ac.uk",
        "role": 1,
        "first_name": "Phoebe",
        "last_name": "Buffay",
        "profile_picture": "imgs/user_profiles/1-1741515534647.jpeg"
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: User Logout
### Method: GET
>```
>http://localhost:3000/users/logout
>```
### Body (**raw**)

```json

```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "message": "user logged out succesfully"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get logged in User Info
### Method: GET
>```
>localhost:3000/user
>```
### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 401
```json
{
    "error": "User not logged-in"
}
```

### Response: 200
```json
{
    "id": 1,
    "email": "admin1@london.ac.uk",
    "role": 1,
    "first_name": "Phoebe",
    "last_name": "Buffay",
    "profile_picture": "imgs/user_profiles/1-1741515534647.jpeg"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: List all Users
### Method: GET
>```
>http://localhost:3000/users
>```
### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "data": [
        {
            "id": 1,
            "email": "admin1@london.ac.uk",
            "password_hash": "$2b$10$0JbtY9LQ4VfOiX9NbHQMLer1bh.b2KwtxkARNv6HUOsyCUiA6VUwK",
            "role": 1,
            "first_name": "Phoebe",
            "last_name": "Buffay",
            "profile_picture": "imgs/user_profiles/1-1741515534647.jpeg"
        },
        {
            "id": 202,
            "email": "floreskrissafc@gmail.com",
            "password_hash": "$2b$10$H71UuLqP2SK9jHia21lTYeBr3S4m1oLUgfw4aj5sYseF9GZ6p/JS2",
            "role": 0,
            "first_name": "kriss",
            "last_name": "flores",
            "profile_picture": "imgs/user_profiles/202-1741462155600.jpeg"
        },
        {
            "id": 332,
            "email": "kc164@student.london.ac.uk",
            "password_hash": "$2b$10$CYcJ20azQNY./Q6bBtVno.xsINsB0SChkE.6hvy.2iTZOpV3JUxOO",
            "role": 0,
            "first_name": "Kriss",
            "last_name": "Flores",
            "profile_picture": "imgs/user_profiles/default_profile.png"
        },
        {
            "id": 359,
            "email": "rachelgreen@student.london.ac.uk",
            "password_hash": "$2b$10$QpHTXuSNMbjGZyjTnBy6fuRP59y8DepLAUscD/P34ShGJrhviD96y",
            "role": 0,
            "first_name": "Rachel",
            "last_name": "Green",
            "profile_picture": "imgs/user_profiles/359-1741515365284.jpeg"
        },
        {
            "id": 360,
            "email": "rossgeller@student.london.ac.uk",
            "password_hash": "$2b$10$EUY8aRIqYFe7L6aGX5yZo.baZU/u08QSra0mhqUoSEUW74T.7/M.S",
            "role": 0,
            "first_name": "Ross",
            "last_name": "Geller",
            "profile_picture": "imgs/user_profiles/360-1741515441286.jpeg"
        },
        {
            "id": 361,
            "email": "monicageller@student.london.ac.uk",
            "password_hash": "$2b$10$lBNNkzhJcKrnTicm8LIUJOOTY19oXaK3mFAJmvQ4HrWjXatIOT5Te",
            "role": 0,
            "first_name": "Monica",
            "last_name": "Bing",
            "profile_picture": "imgs/user_profiles/361-1741515586564.jpeg"
        },
        {
            "id": 374,
            "email": "joytribianni@student.london.ac.uk",
            "password_hash": "$2b$10$UW5vZ6tIl0lfVohTl77DD./Acp2iQ9uNlnP7.ssooAEyj2UJ3Ptdq",
            "role": 0,
            "first_name": "Joseph",
            "last_name": "Tribianni",
            "profile_picture": "imgs/user_profiles/default_profile.png"
        }
    ],
    "meta": {
        "page": 1
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Create new User
### Method: POST
>```
>http://localhost:3000/users/register
>```
### Body (**raw**)

```json
{
    "email": "chandlerbing@student.london.ac.uk",
    "password": "asdQWE123!",
    "first_name": "Chandler",
    "last_name": "Bing"
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "message": "User created successfully"
}
```

### Response: 400
```json
{
    "error": "login or reset password."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Update an Existing User
### Method: POST
>```
>localhost:3000/users/update
>```
### Body formdata

|Param|value|Type|
|---|---|---|
|profile_pic_input|/Users/krissflores/Desktop/woman_face_3.jpeg|file|
|first_name|admin_one|text|
|last_name|flores|text|


### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "id": 1,
    "email": "admin1@london.ac.uk",
    "password_hash": "$2b$10$0JbtY9LQ4VfOiX9NbHQMLer1bh.b2KwtxkARNv6HUOsyCUiA6VUwK",
    "role": 1,
    "first_name": "Phoebe",
    "last_name": "Buffay",
    "profile_picture": "imgs/user_profiles/1-1741576963269.jpeg"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Delete an existing User
### Method: DELETE
>```
>http://localhost:3000/users
>```
### Body (**raw**)

```json
{
    "email": "admin2@london.ac.uk"
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 400
```json
{
    "error": "Can't delete currently active logged in user"
}
```

### Response: 400
```json
{
    "error": "An user with email admin2@london.ac.uk is not present in the system, please search for another email or Add a new user here"
}
```

### Response: 200
```json
{
    "message": "You have successfully removed admin2@london.ac.uk from the system"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Change Password
### Method: POST
>```
>http://localhost:3000/users/changepassword
>```
### Body (**raw**)

```json
{
    "email": "chandlerbing@student.london.ac.uk",
    "oldPassword": "asdQWE123!",
    "newPassword": "123qweASD!"
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "message": "password reset successfully"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Homepage Data
### Method: GET
>```
>http://localhost:3000/home
>```
### Body (**raw**)

```json
{
    "email": "admin1@london.ac.uk",
    "password": "admin1"
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "data": [
        {
            "id": 7,
            "module_code": "CM3005",
            "name": "Data Science",
            "books": [
                {
                    "id": 8,
                    "ISBN": "978-7-7432-8068-5",
                    "title": "Data Science and Big Data Analytics, Discovering Analyzing, Visualizing and Presenting Data.",
                    "edition": "1st Edition",
                    "authors": "Education services EMC",
                    "link": "",
                    "cover_picture": "imgs/books_cover/9787743280685-1741538799426.jpeg",
                    "rating": 2.75
                },
                {
                    "id": 9,
                    "ISBN": "978-1-0981-2122-8",
                    "title": "Python Data Science Handbook: Essential Tools for Working with Data",
                    "edition": "2nd Edition",
                    "authors": "Jake VanderPlas",
                    "link": "",
                    "cover_picture": "imgs/books_cover/978-1098121228-1741541982143.jpeg",
                    "rating": 3.5
                }
            ]
        },
        {
            "id": 8,
            "module_code": "CM2020",
            "name": "Agile Software Projects",
            "books": [
                {
                    "id": 12,
                    "ISBN": "978-1-119-54725-9",
                    "title": "Interaction Design: Beyond Human-Computer Interaction",
                    "edition": "5th Edition",
                    "authors": "Sharp H., Preece J., Rogers Y.",
                    "link": "",
                    "cover_picture": "imgs/books_cover/978-1119547259-1741542225199.jpeg",
                    "rating": 3.5
                },
                {
                    "id": 13,
                    "ISBN": "978-1-292-06356-0",
                    "title": "Brilliant Agile Project Management: A Practical Guide to Using Agile, Scrum and Kanban",
                    "edition": "1st Edition",
                    "authors": "Robe Cole, Edward Scotcher",
                    "link": "",
                    "cover_picture": "imgs/books_cover/978-1292063560-1741542297113.jpeg",
                    "rating": 3
                }
            ]
        },
        {
            "id": 9,
            "module_code": "CM3010",
            "name": "Databases and Advanced Data Techniques",
            "books": [
                {
                    "id": 10,
                    "ISBN": "978-1-4493-2801-6",
                    "title": "Database Design and Relational Theory",
                    "edition": "1st Edition",
                    "authors": "C. J. Date",
                    "link": "",
                    "cover_picture": "imgs/books_cover/978-1449328016-1741542071895.jpeg",
                    "rating": 3
                },
                {
                    "id": 11,
                    "ISBN": "978-0-267-91975-8",
                    "title": "The Entity-Relationship Model: Towards an Unified View of Data",
                    "edition": "1st Edition",
                    "authors": "Peter Chen",
                    "link": "",
                    "cover_picture": "imgs/books_cover/978-0267919758-1741542146541.jpeg",
                    "rating": 3
                }
            ]
        }
    ],
    "meta": {
        "page": 1
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Create New Course
### Method: POST
>```
>localhost:3000/modules
>```
### Body (**raw**)

```json
{
    "module_code": "mc3",
    "name": "module3"
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "message": "Module created successfully"
}
```

### Response: 500
```json
{
    "error": "UNIQUE constraint failed: modules.module_code"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: List all Course
### Method: GET
>```
>localhost:3000/modules
>```
### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "data": [
        {
            "id": 7,
            "module_code": "CM3005",
            "name": "Data Science"
        },
        {
            "id": 8,
            "module_code": "CM2020",
            "name": "Agile Software Projects"
        },
        {
            "id": 9,
            "module_code": "CM3010",
            "name": "Databases and Advanced Data Techniques"
        }
    ],
    "meta": {
        "page": 1
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Delete a Course
### Method: DELETE
>```
>localhost:3000/modules
>```
### Body (**raw**)

```json
{
    "module_name": "module1"
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 400
```json
{
    "error": "User not logged-in"
}
```

### Response: 400
```json
{
    "error": "No module is selected"
}
```

### Response: 400
```json
{
    "error": "Module by name: module 4 not found"
}
```

### Response: 200
```json
{
    "message": "Your review has been deleted successfully"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Update a Course
### Method: POST
>```
>localhost:3000/modules/update
>```
### Body (**raw**)

```json
{
	"module_id": 2,
    "module_name": "module 2",
    "module_code": "mc2"
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "message": "Your review has been updated successfully"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Add a new Book
### Method: POST
>```
>localhost:3000/books
>```
### Body formdata

|Param|value|Type|
|---|---|---|
|isbn|978-0-7943-4561-7|text|
|title|title1|text|
|authors|author1, author2|text|
|book_pic_input|/Users/krissflores/Desktop/pictures_for_books/714GQjvNZYL._SY522_.jpg|file|
|edition|12|text|
|link|http://example.com|text|


### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "message": "The book title1 is going to be added with id: 2."
}
```

### Response: 200
```json
{
    "message": "The book title1 is going to be added with id: 5."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: List all Books
This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.
### Method: GET
>```
>http://localhost:3000/books
>```
### Response: 400
```json
{
    "error": "User not logged-in"
}
```

### Response: 200
```json
{
    "data": [
        {
            "id": 7,
            "ISBN": "978-0-245-19746-8",
            "title": "Test Book",
            "edition": "2nd Edition",
            "authors": "Joy Tribianni",
            "link": "https://link.springer.com/chapter/10.1007/978-3-319-49487-6_3",
            "cover_picture": "imgs/books_cover/default_book_cover.jpg",
            "rating": 1
        },
        {
            "id": 8,
            "ISBN": "978-7-7432-8068-5",
            "title": "Data Science and Big Data Analytics, Discovering Analyzing, Visualizing and Presenting Data.",
            "edition": "1st Edition",
            "authors": "Education services EMC",
            "link": "",
            "cover_picture": "imgs/books_cover/9787743280685-1741538799426.jpeg",
            "rating": 2.75
        },
        {
            "id": 9,
            "ISBN": "978-1-0981-2122-8",
            "title": "Python Data Science Handbook: Essential Tools for Working with Data",
            "edition": "2nd Edition",
            "authors": "Jake VanderPlas",
            "link": "",
            "cover_picture": "imgs/books_cover/978-1098121228-1741541982143.jpeg",
            "rating": 3.6666666666666665
        },
        {
            "id": 10,
            "ISBN": "978-1-4493-2801-6",
            "title": "Database Design and Relational Theory",
            "edition": "1st Edition",
            "authors": "C. J. Date",
            "link": "",
            "cover_picture": "imgs/books_cover/978-1449328016-1741542071895.jpeg",
            "rating": 3
        },
        {
            "id": 11,
            "ISBN": "978-0-267-91975-8",
            "title": "The Entity-Relationship Model: Towards an Unified View of Data",
            "edition": "1st Edition",
            "authors": "Peter Chen",
            "link": "",
            "cover_picture": "imgs/books_cover/978-0267919758-1741542146541.jpeg",
            "rating": 3
        },
        {
            "id": 12,
            "ISBN": "978-1-119-54725-9",
            "title": "Interaction Design: Beyond Human-Computer Interaction",
            "edition": "5th Edition",
            "authors": "Sharp H., Preece J., Rogers Y.",
            "link": "",
            "cover_picture": "imgs/books_cover/978-1119547259-1741542225199.jpeg",
            "rating": 3.5
        },
        {
            "id": 13,
            "ISBN": "978-1-292-06356-0",
            "title": "Brilliant Agile Project Management: A Practical Guide to Using Agile, Scrum and Kanban",
            "edition": "1st Edition",
            "authors": "Robe Cole, Edward Scotcher",
            "link": "",
            "cover_picture": "imgs/books_cover/978-1292063560-1741542297113.jpeg",
            "rating": 3
        }
    ],
    "meta": {
        "page": 1
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Update an existing book without cover photo
### Method: POST
>```
>localhost:3000/books/update
>```
### Body (**raw**)

```json
{
    "module_name": "module1",
    "isbn": "978-0-439-02348-1",
    "title": "title one",
    "authors": "author one"
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 400
```json
{
    "error": "User not logged-in"
}
```

### Response: 400
```json
{
    "error": "These book details are already stored in the system"
}
```

### Response: 200
```json
{
    "message": "The book title1 has been updated with title: title 1 authors: author1, author2"
}
```

### Response: 200
```json
{
    "message": "The book title 1 has been updated with title: title 1 authors: author1"
}
```

### Response: 200
```json
{
    "message": "The book title 1 has been updated with title: title one authors: author one"
}
```

### Response: 400
```json
{
    "error": "ISBN does not match any known format"
}
```

### Response: 400
```json
{
    "error": "Module name is not selected"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Update and existing book with cover photo
### Method: POST
>```
>localhost:3000/books/update
>```
### Body formdata

|Param|value|Type|
|---|---|---|
|isbn|978-92-95055-02-5|text|
|book_pic_input|/Users/krissflores/Desktop/pictures_for_books/911Ne+5GetL._SY522_.jpg|file|


### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "message": "The book title2 has been updated with title: undefined authors: undefined cover_picture: imgs/books_cover/978-92-95055-02-5-1740981366872.svg"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Delete an existing Book
### Method: DELETE
>```
>localhost:3000/books
>```
### Body (**raw**)

```json
{
    "book_id": 1
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "message": "Your review has been deleted successfully"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Add Book to Module
### Method: POST
>```
>localhost:3000/modules/addbook
>```
### Body (**raw**)

```json
{
    "book_id": "1",
    "module_id": 1
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "message": "The book id: 1 is going to be added to module id: 1"
}
```

### Response: 400
```json
{
    "error": "The book 1 already exists in the system for module id: 1. Do you want to add a different book?"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get all Books for a Course
### Method: GET
>```
>localhost:3000/modules/books/1
>```
### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "data": [
        {
            "id": 1,
            "ISBN": "978-5-904790-09-7",
            "title": "title1",
            "edition": null,
            "authors": "author1",
            "link": null,
            "cover_picture": null,
            "rating": 0
        }
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Create a new review
### Method: POST
>```
>http://localhost:3000/reviews/
>```
### Body (**raw**)

```json
{
    "book_id": 1, 
    "user_id": 1, 
    "comment": "comment 3",
    "rating": 2
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "message": "Your review has been processed successfully"
}
```

### Response: 400
```json
{
    "error": "please remove offensive words from review"
}
```

### Response: 500
```json
{
    "error": "CHECK constraint failed: rating BETWEEN 1 AND 5"
}
```

### Response: 400
```json
{
    "error": "no rating present"
}
```

### Response: 500
```json
{
    "error": "CHECK constraint failed: rating BETWEEN 1 AND 5"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Delete a Review
### Method: DELETE
>```
>http://localhost:3000/reviews/
>```
### Body (**raw**)

```json
{
    "book_id": 2, 
    "user_id": 1
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "message": "Your review has been processed successfully"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: List all reviews by a User
### Method: GET
>```
>http://localhost:3000/reviews/byuser/359
>```
### Body (**raw**)

```json

```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "data": [
        {
            "book_id": 8,
            "user_id": 359,
            "comment": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "rating": 4,
            "created_at": "2025-03-09 18:20:55",
            "id": 8,
            "ISBN": "978-7-7432-8068-5",
            "title": "Data Science and Big Data Analytics, Discovering Analyzing, Visualizing and Presenting Data.",
            "edition": "1st Edition",
            "authors": "Education services EMC",
            "link": "",
            "cover_picture": "imgs/books_cover/9787743280685-1741538799426.jpeg"
        },
        {
            "book_id": 9,
            "user_id": 359,
            "comment": "Didn't like this book too much. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
            "rating": 2,
            "created_at": "2025-03-09 18:21:38",
            "id": 9,
            "ISBN": "978-1-0981-2122-8",
            "title": "Python Data Science Handbook: Essential Tools for Working with Data",
            "edition": "2nd Edition",
            "authors": "Jake VanderPlas",
            "link": "",
            "cover_picture": "imgs/books_cover/978-1098121228-1741541982143.jpeg"
        },
        {
            "book_id": 12,
            "user_id": 359,
            "comment": "This book is awesome, loved how it explained things. Use it!",
            "rating": 5,
            "created_at": "2025-03-09 18:23:32",
            "id": 12,
            "ISBN": "978-1-119-54725-9",
            "title": "Interaction Design: Beyond Human-Computer Interaction",
            "edition": "5th Edition",
            "authors": "Sharp H., Preece J., Rogers Y.",
            "link": "",
            "cover_picture": "imgs/books_cover/978-1119547259-1741542225199.jpeg"
        },
        {
            "book_id": 13,
            "user_id": 359,
            "comment": "I don't like how they explain the subjects on this book. Wasn't really helpful for me",
            "rating": 2,
            "created_at": "2025-03-09 18:28:08",
            "id": 13,
            "ISBN": "978-1-292-06356-0",
            "title": "Brilliant Agile Project Management: A Practical Guide to Using Agile, Scrum and Kanban",
            "edition": "1st Edition",
            "authors": "Robe Cole, Edward Scotcher",
            "link": "",
            "cover_picture": "imgs/books_cover/978-1292063560-1741542297113.jpeg"
        },
        {
            "book_id": 10,
            "user_id": 359,
            "comment": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "rating": 3,
            "created_at": "2025-03-09 18:30:28",
            "id": 10,
            "ISBN": "978-1-4493-2801-6",
            "title": "Database Design and Relational Theory",
            "edition": "1st Edition",
            "authors": "C. J. Date",
            "link": "",
            "cover_picture": "imgs/books_cover/978-1449328016-1741542071895.jpeg"
        }
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Update an existing Review
### Method: POST
>```
>localhost:3000/reviews/update
>```
### Body (**raw**)

```json
{
  "book_id": 1,
	"user_id": 1,
	"comment": "comment modified 2",
	"rating": 3
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "message": "The review 1 1 has been updated."
}
```

### Response: 200
```json
{
    "message": "The review 1 1 has been updated."
}
```

### Response: 200
```json
{
    "message": "The review 1 1 has been updated."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: List all Reviews for a Book
### Method: GET
>```
>http://localhost:3000/reviews/bybook/8
>```
### Body (**raw**)

```json
{
    "book_id": 1, 
    "user_id": 1, 
    "comment": "comment 1",
    "rating": 5
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 500
```json
{
    "error": "no book_id present"
}
```

### Response: 404
```json
{
    "error": "There are no reviews for this book yet. Be the first to write a review and share your thoughts with other students"
}
```

### Response: 200
```json
{
    "data": [
        {
            "book_id": 8,
            "user_id": 359,
            "comment": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "rating": 4,
            "created_at": "2025-03-09 18:20:55",
            "id": 359,
            "email": "rachelgreen@student.london.ac.uk",
            "password_hash": "$2b$10$QpHTXuSNMbjGZyjTnBy6fuRP59y8DepLAUscD/P34ShGJrhviD96y",
            "role": 0,
            "first_name": "Rachel",
            "last_name": "Green",
            "profile_picture": "imgs/user_profiles/359-1741515365284.jpeg"
        },
        {
            "book_id": 8,
            "user_id": 360,
            "comment": "We were on a break.. when I read this book but didn't find it really helpful",
            "rating": 2,
            "created_at": "2025-03-09 18:32:06",
            "id": 360,
            "email": "rossgeller@student.london.ac.uk",
            "password_hash": "$2b$10$EUY8aRIqYFe7L6aGX5yZo.baZU/u08QSra0mhqUoSEUW74T.7/M.S",
            "role": 0,
            "first_name": "Ross",
            "last_name": "Geller",
            "profile_picture": "imgs/user_profiles/360-1741515441286.jpeg"
        },
        {
            "book_id": 8,
            "user_id": 361,
            "comment": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "rating": 3,
            "created_at": "2025-03-09 19:14:33",
            "id": 361,
            "email": "monicageller@student.london.ac.uk",
            "password_hash": "$2b$10$lBNNkzhJcKrnTicm8LIUJOOTY19oXaK3mFAJmvQ4HrWjXatIOT5Te",
            "role": 0,
            "first_name": "Monica",
            "last_name": "Bing",
            "profile_picture": "imgs/user_profiles/361-1741515586564.jpeg"
        },
        {
            "book_id": 8,
            "user_id": 374,
            "comment": "I liked The Shining better ",
            "rating": 2,
            "created_at": "2025-03-09 19:27:49",
            "id": 374,
            "email": "joytribianni@student.london.ac.uk",
            "password_hash": "$2b$10$UW5vZ6tIl0lfVohTl77DD./Acp2iQ9uNlnP7.ssooAEyj2UJ3Ptdq",
            "role": 0,
            "first_name": "Joseph",
            "last_name": "Tribianni",
            "profile_picture": "imgs/user_profiles/default_profile.png"
        }
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Propose a new Book for a Course
### Method: POST
>```
>localhost:3000/books/propose
>```
### Body (**raw**)

```json
{
    "isbn": "978-0-439-02348-1",
    "title": "title1",
    "module_name": "module2"
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 400
```json
{
    "error": "The ISBN is not correct"
}
```

### Response: 400
```json
{
    "error": "The ISBN is not correct"
}
```

### Response: 400
```json
{
    "error": "User not logged-in"
}
```

### Response: 200
```json
{
    "message": "proposal has been submitted"
}
```

### Response: 400
```json
{
    "error": "Module by name: module2 not found"
}
```

### Response: 500
```json
{
    "error": "UNIQUE constraint failed: proposed_books.ISBN, proposed_books.module_id"
}
```

### Response: 200
```json
{
    "message": "proposal has been submitted"
}
```

### Response: 500
```json
{
    "error": "UNIQUE constraint failed: proposed_books.ISBN, proposed_books.module_id"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get all Proposed Books
### Method: GET
>```
>localhost:3000/books/proposed
>```
### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "data": [
        {
            "id": 6,
            "module_id": 9,
            "ISBN": "978-1-337-09342-2",
            "title": "Concepts of Database Management ",
            "name": "Databases and Advanced Data Techniques"
        }
    ],
    "meta": {
        "page": 1
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Remove a Proposed Book
### Method: DELETE
>```
>localhost:3000/books/removeproposed
>```
### Body (**raw**)

```json
{
    "id": 1
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: 200
```json
{
    "message": "proposed book has been deleted successfully"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
_________________________________________________
Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)


TODOs:
- [x] replace new Error by new Err.
- [x] remove messages error handling.
- [x] validate the linting errors like missing ;.
- [x] users upload pics flow validate.
- [x] books images upload.
- [x] add get params routes for most get requests.
- [x] make sure there is never password returned in any of the output response.
- [x] validate the partial update of users, books and reviews.
- [x] add average rating for each book.
- [x] handle seperate book addition and book to module addition.
- [x] postman backend api publish.
- [x] /resetpassword route is used for forgot password, validate the flow with UI.
- [x] chrome issues
    - [x] disable the weak password detection.
    - [x] disable chrome://settings/security?search=safe+browsing
    - [x] https://support.google.com/chrome/thread/23945619/how-to-disable-the-password-checkup-in-chrome?hl=en

Optional:
- [ ] add docsctrings and comments.
- [ ] add unit tests
- [ ] make it private live in using digital ocean or github etc.


