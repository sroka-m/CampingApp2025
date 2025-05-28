# Personal project for educational purposes. CRUD REST API with basic YelpCamp functionality.

## The project is a fully functional CRUD that has basic YelpCamp functionality. YelpCamp is a website where users can create and review campgrounds. To review or create a campground, you must have an account. Written in JS using Node, Express, and MongoDb. Rendered on render.com. Based on Colt Steele YelpCamp tutorial with quite a few improvements (listed below).

## List of main changes to Colt's project:

### Made sure that when a user logs in/registers they are re-directed to the page they had been on before login/registration took place. Achieved by storing a previous URL in a session. The fix for this problem was outdated. A list of exceptions was updated: login, register, home, API calls to the back-end (res.json), URL of requests that do not have corresponding, identical GET URL (e.g. updating and deleting a review follows a pattern /campgrounds/:id/reviews/:reviewId, the GET request with such URL does not exist, since reviews are displayed as a list under /campgrounds/:id/reviews).

### Image file validation added, both front end and back end (size, number and type).

### If req.body validation fails, the image file(s) are no longer submitted to Cloudinary.

### Campground form does not submit when location input does not resolve in coordinates, for instance when mispelled (both FE and BE).

### Added favicon (mainly to solve 404 error "cannot get favicon.ico").

### Made an API call to backend to fetch the location of all campgrounds for the map cluster. In the original project, this was done by using ejs <%-%> tag and json.stringify (frontend was getting the locations from backend as a variable). As a result, the list of all campgrounds was visible in the browser, together with users who created it and their credentials.

### Campgrounds and reviews show a number of days, weeks, months, or years from when they were created (implemented in routing files so the time is taken from the server where the app is rendered and not from the user's hardware). Reviews marked if edited.

### Raised review resource to a separate route. Edit review added, so that reviews also have full CRUD. Different elements are displayed depending on whether a campground has any reviews, whether a user is logged in, if a logged-in user has already left a review. Only a single review is permitted per user.  

### Reviews are sorted by number of stars.

### The ability to display half stars added (for displaying an average campground rating).

### Created function so that JOI validation is not repeated for every schema validateJoiSchema(someSchema).

---

## Known issues

### The ability to display half stars was added by coping \_starability-base.scss, \_starability-result.scss, \_variables.scss, starability/basic.scss, modifying \_starability-result.scss according to solution https://github.com/LunarLogic/starability/issues/26#issuecomment-367013528 and recompiling with node-sass (starabilityHalf.css). There is one script for integer values and one for haf values. This probably repeats some code but I do not feel I have the luxury of time to dig deeper and understand how the library works.

#### Multer 1.xxx: when the number of images are exceeded using ( upload.array("image", 4)), it gives an error "Unexpected field". I had to overwrite this error in app.use app.js. Issue https://github.com/expressjs/multer/issues/1057 (it is apparently fixed in Multer 2.xx but it's not properly out yet).

### Preventing upload to Cloudinary when req.body fails is not implemented elegantly (according to solution https://github.com/expressjs/multer/issues/150  validation inside multer fileFilter callback, ). Before that solution I validated using middleware in a router, so I could either validate req.body first or req.files, for instance: router.VERB("/PATH",someMiddleware, validateJoiSchema(reviewSchema), upload.array("image")). Possible solution: pechkin https://www.npmjs.com/package/pechkin.
