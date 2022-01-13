Nostalgia Machine

> nos·tal·gia /näˈstaljə,nəˈstaljə/ a sentimental longing or wistful affection for the past, typically for a period or place with happy personal associations.

Nostalgia Machine API

This is the API for the Nostalgia Machine. A full-stack application that allows users to browse decades, post nostalgia, and share comments.

This was built using NodeJS, Express, SQL, and PostgreSQL. It features authentication/authorization with JWT tokens
SQL queries are contained in a custom ORM. Routes are protected with tokens and custom middleware. Each route/model is tested using jest. A detailed list of routes are below.

## View it here: https://nostalgia-api.herokuapp.com/

## Routes

## **/auth**

    POST /auth/token: { username, password } => { token }

_Returns JWT token which can be used to authenticate further requests._

    POST /auth/register: { user } => { token }

_User must include { username, password }
Returns JWT token_

## **/decade**

      GET /[id] => { decade }

See it here: https://nostalgia-api.herokuapp.com/decade/1

_Returns { id, name, description, posts:[]}_
_Authorization required: none_

    GET / => {decades:[{id, name, description}...]}

See it here: https://nostalgia-api.herokuapp.com/decade/
_get all decades
Authorization required: none_

## **/posts**

     GET /[id] => { post }

_Returns { "post": {"id" "title, "url","username", "comments":[]
} }
Authorization required: none_
See it here: https://nostalgia-api.herokuapp.com/posts/88

    POST /{title,url, decade_id} => { post }

_Creates new post  
 Returns { "post": {"id": "title", "url", decade_id} }_
_Authorization required: logged in_

    / PATCH /[postid] { post } => { post}

_Edit post you made_
_Returns { "post": {id, title, url, decade_id, username} }
Authorization required: same-user-as-username_

     DELETE /[postid] => { deleted: postid }

_Delete post you made_
_Authorization required: same-user-as-username_

**/posts/[postid]/comments**

    POST /[postid]/comments/

_create comment on post_
\*Returns {comment": {id,
text,created, username, post_id
}}

    PATCH /[postid]/comments/[commentid]

_edit comment you created_
_Returns {text:comment}_
_Authorization required: same-user-as-username/
logged in_

    DELETE/[postid]/comments/[commentid]

_delete comment
Returns {deleted:[commentid]}
Authorization required: same-user-as-username_

## **/users**

    GET /[username] => { user }

_Returns {"user": { "username": "posts": [] }}
Authorization required: same user-as-:username_

    DELETE /[username] => { deleted }

_Delete user
Returns {deleted:username}
Authorization required: same user-as-:username_

**/users/[username]/favorite**

     POST /[username]/favorite/[id]

_Like/save a post
Returns {"favoriteAdded": postId}
Authorization required: username the same as logged in user_

    DELETE /[username]/favorite/[id]

*"unlike" a post
*Returns {"removed": postId}_
Authorization required: same-user-as-:username_

     GET /[username]/favorite => { favorites}

_Get all favorites of a user
Returns { favorites:[{"id","title", "url", "decade_id" }...] }
Authorization required: same user-as-:username_
