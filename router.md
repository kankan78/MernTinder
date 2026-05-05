#Auth Router
Post /signup
Post /login
Post /logout

#Profile
GET     /profile/user
POST    /profile/user/edit
PATCH   /profile/password

#Connections
POST    /request/send/interested/:id
POST    /request/send/ignored/:id
POST    /request/received/accepted/:id
POST    /request/received/rejected/:id

#User
POST    /