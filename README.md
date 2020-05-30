# Back-End [lambda-howto](https://lambda-howto.herokuapp.com)
Back end server built using Node js, express, knex

- [https://lambda-howto.herokuapp.com](https://lambda-howto.herokuapp.com)




## Routes

__/----------------------------------------/ AUTH ROUTES /----------------------------------------/__

### Login + Register
Both `/api/auth/register` and `/api/auth/login` use the same post data.

| endpoint             	| type 	|
|----------------------	|------	|
| `/api/auth/login`    	| POST 	|
| `/api/auth/register` 	| POST 	|

#### Headers
_No headers needed for login + register (only after user logs-in)_

#### Body
| name       	| type   	| required 	| notes          	|
|------------	|--------	|----------	|----------------	|
| `username` 	| String 	| yes      	| Must be unique 	|
| `password` 	| String 	| yes      	|                	|

#### Example body
```json
{
    "username": "John Doe",
    "password": "johnspass"
}
```

#### Example response
```json
// Register
{
    "username": "John Doe",
    "success": true
}

// Login
{
  "message": "logged in: John Doe",
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmF..."
}
```

You __need__ to save the token to 'localStorage' and use it as an 'Authorization' header on each request.
```javascript
// Request will look something like this
axios({
	method: 'get',
	url: 'https://lambda-howto.herokuapp.com/api/posts',
	headers: {
		Authorization: token
	}
})
```


<br />

__/----------------------------------------/ POST ROUTES /----------------------------------------/__

All routes from here are __protected__ and require an `Authorization` header to access.

| endpoint         	| type   	| description             	|
|------------------	|--------	|-------------------------	|
| `/api/posts`     	| GET    	| returns all posts       	|
| `/api/posts`     	| POST   	| create a new post       	|
| `/api/posts/:id` 	| PUT    	| update an existing post 	|
| `/api/posts/:id` 	| DELETE 	| remove an existing post 	|

#### Headers
| name            	| required 	| description              	|
|-----------------	|----------	|--------------------------	|
| `Authorization` 	| yes      	| Auth `token` from log-in 	|


### GET `/api/posts`

- Returns all posts

#### Example response
```json
// Returns all posts (sorted by likes)
[
  {
    "id": 2,
    "username": "John Doe",
    "content": "_ANOTHER AMAZING LIFE HACK_",
    "image": "example.com/image.png",
    "likes": 21
  },
  {
    "id": 1,
    "username": "John Doe",
    "content": "_INSERT AMAZING LIFE HACK_",
    "image": "example.com/image.png",
    "likes": 8
  }
]
```


### POST: `/api/posts`

- Create a new post

#### Example body
```json
{
	"content": "My new and amazing life-hack",
	"image": "https://res.cloudinary.com/dicdxigq4/image/upload/v1590538257/sample.jpg"
}
```

#### Example response
```json
// Returns new post
{
  "id": 3,
  "username": "John Doe",
  "content": "My new and amazing life-hack",
  "image": "https://example.com/jpg.com",
  "likes": 0
}
```


### PUT: `/api/posts/:id`

- Update an existing post

#### Example body
```json
{
	"content": "My UPDATED life-hack",
	"image": "https://res.cloudinary.com/dicdxigq4/image/upload/samples/landscapes/nature-mountains.jpg"
}
```

#### Example response
```json
// Returns updated post
{
  "id": 3,
  "username": "John Doe",
  "content": "My UPDATED life-hack",
  "image": "https://example.com/jpg.com",
  "likes": 0
}
```


### DELETE: `/api/posts/:id`

- Remove an existing post

#### Example response
```json
// Returns removed post
{
  "id": 3,
  "username": "John Doe",
  "content": "My UPDATED life-hack",
  "image": "https://example.com/jpg.com",
  "likes": 0
}
```


### GET `/api/posts/:id/like`

- Toggle like-status for a post

Will like a post for the current user if not already; and un-like if already liked.

#### Example response
```json
// Returns new like status
{
  "hasLiked": false
}
```

```json
{
  "hasLiked": true
}
```
