Run the below command to start the server.
```sh
npm install && npm start
```


load 
```
book-rating-system-api.postman_collection.json
```
into postman for examples of the APIs.

TODOs:
- [x] replace new Error by new Err.
- [x] remove messages error handling.
- [x] validate the linting errors like missing ;.
- [ ] add docsctrings and comments.
- [ ] add unit tests
- [ ] postman backend api publish.
- [ ] make sure there is never password returned in any of the output response.
- [ ] /resetpassword route is used for forgot password, validate the flow with UI.
- [ ] make it private live in using digital ocean or github etc.
- [ ] validate the partial update of users, books and reviews.
- [ ] users upload pics flow validate.
- [ ] books images upload.
- [ ] add get params routes for most get requests.