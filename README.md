Nostalgia Machine

> nos·tal·gia /näˈstaljə,nəˈstaljə/ a sentimental longing or wistful affection for the past, typically for a period or place with happy personal associations.

Nostalgia Machine API

This is the API for the Nostalgia Machine. A full-stack application that allows users to browse decades, post nostalgia, and share comments. 

This was built using NodeJS, Express, SQL, and PostgreSQL.  It features authentication/authorization with JWT tokens
SQL queries are contained in a custom ORM. Routes are protected with tokens and custom middleware. Each route/model is tested using jest. A detailed list of routes are below.
## View it here: https://nostalgia-api.herokuapp.com/

## Routes

## **/auth**

    POST /auth/token: { username, password } => { token }

 *Returns JWT token which can be used to authenticate further requests.*

    POST /auth/register: { user } => { token }

 *User must include { username, password }\
 Returns JWT token* 


## **/decade**

      GET /[id] => { decade }
See it here: https://nostalgia-api.herokuapp.com/decade/1

 *Returns { id, name, description, posts:[]}*\
	*Authorization required: none*

  

    GET / => {decades:[{id, name, description}...]}
See it here: https://nostalgia-api.herokuapp.com/decade/\
*get all decades\
Authorization required: none*

## **/posts**

     GET /[id] => { post }
*Returns { "post": {"id" "title, "url","username", "comments":[]
} }\
 Authorization required: none*\
See it here: https://nostalgia-api.herokuapp.com/posts/88

 

    POST /{title,url, decade_id} => { post }
  *Creates new post  \
 Returns { "post": {"id": "title", "url", decade_id} }*\
*Authorization required: logged in*

    / PATCH /[postid] { post } => { post}
*Edit post you made*\
*Returns { "post": {id, title, url, decade_id, username} }\
Authorization required: same-user-as-username*

     DELETE /[postid] => { deleted: postid }
*Delete post you made*\
*Authorization required: same-user-as-username*\

**/posts/[postid]/comments**

    POST /[postid]/comments/

*create comment on post*\
*Returns {comment": {id,
text,created, username, post_id
}}*

    PATCH /[postid]/comments/[commentid]

*edit comment you created*\
*Returns {text:comment}*\
*Authorization required: same-user-as-username/
 logged in*

    DELETE/[postid]/comments/[commentid]
*delete comment\
Returns {deleted:[commentid]}\
Authorization required: same-user-as-username*\

## **/users**

    GET /[username] => { user }
*Returns {"user": { "username": "posts": [] }}\
Authorization required: same user-as-:username*


    DELETE /[username] => { deleted }
    
*Delete user\
Returns {deleted:username}\
Authorization required: same user-as-:username*

**/users/[username]/favorite**

     POST /[username]/favorite/[id]
*Like/save a post\
Returns {"favoriteAdded": postId}\
 Authorization required: username the same as logged in user*

    DELETE /[username]/favorite/[id]
*"unlike" a post\
*Returns {"removed": postId}*\
Authorization required: same-user-as-:username*\

     GET /[username]/favorite => { favorites}

 - *Get all favorites of a user*\
*Returns { favorites:[{"id","title", "url", "decade_id" }...] }*\
*Authorization required: same user-as-:username**


