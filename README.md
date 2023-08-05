## Photogram REST APIs

- REST APIs for server side for photogram an application like instagram to post photos, add comments and add likes
- REST APIs are written in Express nodeJs framework and connected to mongoDB.
  
-------------
### Models

- Post: support add post of photo with title and add comments and likes to post.

- userSchema: define schema for user include username, email, pasword and picture. Also, in userSchema we have users that the user follow or followings.

-------------
### Routes

- auth: include APIs for signup and signin

- post: include APIs for dealing with posts. It has URL for createPost, allpost, getPost, like, unlike and comment

- user: Dealing with user and how to follow and unfollow.
