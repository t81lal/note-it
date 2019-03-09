# note-It

`note-it` is a simple backend app for users to create, edit, archive and delete collections of notes.

## Installation
1. Clone the repository
2. Run `npm install`
3. Create a [MongoDB Atlas database](https://www.mongodb.com/cloud/atlas)
4. Edit the `nodemon.json` with your database URL and a secret key (phrase or string) of your choice
5. Start the server using `nodemon server.js`

## Usage
The note service currently has 2 internal object models:
### User
| Field | Type     | Description                                                        |
|-------|----------|--------------------------------------------------------------------|
| _id   | ObjectId | Unique identifier associated with each user                        |
| name  | String   | Uniquely identifiable username for logging in and display purposes |
### Note
| Field    | Type     | Description                                                               |
|----------|----------|---------------------------------------------------------------------------|
| _id      | ObjectId | Unique identifier associated with each note                               |
| creator  | ObjectId | ID of the user who created the note        |
| contents | String   | Message associated with each note                                         |
| archived | Boolean  | Flag indicating whether the note can be modified or deleted in the future |

There are currently two endpoints: `users` and `notes`. The body and response of a request have content type of `application/json` <br>
Some operations require the 'Authorization' header to have the value of a valid authentication token. These actions have a (+) next to them. 

### User
#### /users/signup (POST)
Creates a new user profile

Parameters(body):
```
{
    "name" :: String,
    "password" :: String
}
```
Response 201:
```
{
    "message" : "User created",
    "user" :: User
}
```
Response 406 (illegal username):
```
{
    "message" : "User name must be at least 4 characters long"
}
```
Response 409:
```
{
    "message" : "User already exists",
    "name" :: String
}
```
Response 500:
```
{
    "message" : "Error creating user",
    "error" :: Error
}
```


#### /users/login (POST)
Creates an authentication token for a user for an hour

Parameters(body):
```
{
    "name" :: String,
    "password" :: String
}
```
Response 200:
```
{
    "message" : "Auth successful",
    "token" :: AuthToken
}
```
Response 401 (auth failed):
```
{
    "message" : "Auth failed"
}
```
Response 406 (illegal username):
```
{
    "message" : "User name must be at least 4 characters long"
}
```
Response 500:
```
{
    "message" : "Error creating user",
    "error" :: Error
}
```

#### /users/:userId (DELETE) (+)
Deletes a user

Parameters(query):
```
userId :: ObjectId
```
Response 200:
```
{
    "message" : "User deleted",
    "userId" :: ObjectId (user to delete)
}
```
Response 401:
```
{
    "message" : "Not authorised to delete user",
    userId :: ObjectId, (user to delete)
    user :: User (logged in user)
}
```
Response 404:
```
{
    "message" : "User not found",
    userId :: ObjectId (user to delete)
}
```
Response 406 (illegal username):
```
{
    "message" : "User name must be at least 4 characters long"
}
```
Response 500:
```
{
    "message" : "Error deleting user",
        userId :: ObjectId, (user to delete)
    "error" :: Error
}
```

#### /users/ (GET)
Gets a list of Users

Response 200:
```
[User]
```
Response 500:
```
{
    "message" : "Error fetching user list",
    "error" :: Error
}
```


### Note
#### /notes/ (GET) (+)
Gets a list of notes

Response 200:
```
[Note]
```
Response 500:
```
{
    "message" : "Error fetching notes list",
    "error" :: Error
}
```

#### /notes/ (POST) (+)
Creates a new note attributed to the logged in User

Parameters(body):
```
{
    "content" :: String
}
```

Response 201:
```
{
    "message" : "Created note",
    "note" :: Note
}
```
Response 500:
```
{
    "message" : "Could not create note",
    "error" :: Error
}
```

#### /notes/:noteId (PATCH) (+)
Updates the content of a note
Parameters(body):
```
{
    "content" :: String
}
```
Response 200:
```
{} :: Note
```
Response 401:
```
{
    "message" : "User is not authorised to edit note"
}
```
Response 404:
```
{
    "message" : "Note not found"
}
```
Response 500:
```
{
    "message" : "Could not update note",
    "error" :: Error
}
```

#### /notes/:noteId?archive=true (PATCH) (+)
Archives a note
Response 200:
```
{
    "message" : "Archived note",
    "user" :: User,
    "note" :: Note
}
```
Response 403:
```
{
    "message" : "Note is not editable",
    "user" :: User,
    "note" :: Note
}
```
Response 404:
```
{
    "message" : "Note not found",
    "user" :: User,
    "id" : nodeId
}
```
Response 500:
```
{
    "message" : "Could not archive note",
    "user" :: User,
    "error" :: Error
}
```

#### /notes/:noteId (DELETE) (+)
Deletes a note
Response 200:
```
{
    "message" : "Deleted note",
    "user" :: User,
    "note" :: Note
}
```
Response 401:
```
{
    "message" : "User is not authorised to delete note",
    "user" :: User,
    "note" :: Note
}
```
Response 404:
```
{
    "message" : "Note not found",
    "user" :: User,
    "id" : nodeId
}
```
Response 500:
```
{
    "message" : "Could not delete note",
    "user" :: User,
    "error" :: Error
}
```