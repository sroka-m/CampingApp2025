# Personal project for educational purposes. CRUD REST API with basic YelpCamp functionality.

## The project is a fully functional CRUD that has basic YelpCamp functionality. YelpCamp is a website where users can create and review campgrounds. To review or create a campground, you must have an account. Written in JS using Node, Express, and MongoDb. Rendered on render.com. Based on Colt Steele YelpCamp tutorial with quite a few improvements (listed below).

## Link to Colt's YelpCamp project https://github.com/Colt/YelpCamp

## List of main changes to Colt's project:

- Made sure that when a user logs in/registers they are re-directed to the page they had been on before login/registration took place. Achieved by storing a previous URL in a session. The fix for this problem was outdated. A list of exceptions was updated: login, register, home, API calls to the back-end (res.json), URL of requests that do not have corresponding, identical GET URL (e.g. updating and deleting a review follows a pattern /campgrounds/:id/reviews/:reviewId, the GET request with such URL does not exist, since reviews are displayed as a list under /campgrounds/:id/reviews).

- Image file validation added, both front end and back end (size, number and type).

- If req.body validation fails, the image file(s) are no longer submitted to Cloudinary.

- Campground form does not submit when location input does not resolve in coordinates, for instance when mispelled (both FE and BE).

- Added favicon (mainly to solve 404 error "cannot get favicon.ico").

- Made an API call to backend to fetch the location of all campgrounds for the map cluster. In the original project, this was done by using ejs <%-%> tag and json.stringify (frontend was getting the locations from backend as a variable). As a result, the list of all campgrounds was visible in the browser, together with users who created it and their credentials.

- Campgrounds and reviews show a number of days, weeks, months, or years from when they were created (implemented in routing files so the time is taken from the server where the app is rendered and not from the user's hardware). Reviews marked if edited. Created review partial.

- Raised review resource to a separate route. Edit review added, so that reviews also have full CRUD. Different elements are displayed depending on whether a campground has any reviews, whether a user is logged in, if a logged-in user has already left a review. Only a single review is permitted per user. Added a custom FE validation for stars input, in the original project, when no stars were selected, it defaulted to 1.

- Reviews are sorted by number of stars.

- The ability to display half stars added (for displaying an average campground rating).

- Added validation to password and username (in the originla project they were only required).

Backend: (read https://stackoverflow.com/questions/48345922/reference-password-validation/48346033#48346033 and a blog by Jeff Atwood)
I did not implement authentication with Gmail, FB, etc because it is a small project for educational purposes.
Password: restricted by regex: 8-64 length, ASCII printable characters allowed, except DEL, <, > and &. Spaces are allowed but not at the beginning or the end.
Password cannot be the same as username (JOI validation)
Password checked against common passwords (see ToDos section, where I elaborate on how it could be improved)
Username: 6-20 alphanumeric characters, cannot be set to a username that already exists in the database (JOI .external used).
The corresponding validation added to the front end for smoother user expericence.

- Added show/hide password feature.
- Added password generator.

- Added chart showing percentage of reviews per number of stars (e.g. 40% of reviews are 5-star).

- Added pagination for indexing campgrounds

- Added search functionality (autocomplete option for campgrounds index on title and location fields, with fuzzy option)

---

## Known issues

- The ability to display half stars was added by coping \_starability-base.scss, \_starability-result.scss, \_variables.scss, starability/basic.scss, modifying \_starability-result.scss according to solution https://github.com/LunarLogic/starability/issues/26#issuecomment-367013528 and recompiling with node-sass (starabilityHalf.css). There is one script for integer values and one for haf values. This probably repeats some code but I do not feel I have the luxury of time to dig deeper and understand how the library works.

- Multer file type validation is mimetype based. It would be more secure using magic numbers (file-type, ESM package)

- Multer 1.xxx: when the number of images are exceeded using ( upload.array("image", 4)), it gives an error "Unexpected field". I had to overwrite this error in app.use app.js. Issue https://github.com/expressjs/multer/issues/1057 (it is apparently fixed in Multer 2.xx but it's not properly out yet).

- Preventing upload to Cloudinary when req.body fails is not implemented elegantly (according to solution https://github.com/expressjs/multer/issues/150  validation inside multer fileFilter callback, ). Before that solution I validated using middleware in a router, so I could either validate req.body first or req.files, for instance: router.VERB("/PATH",someMiddleware, validateJoiSchema(campgroundSchema), upload.array("image")). Possible solution: pechkin https://www.npmjs.com/package/pechkin.

- Tooltips lost their custom styles; I am not sure when exactly, but I think it was after I expanded the FE validation. However, the styles work if they are embedded directly into the register form.
  Additionally, #passwordContainer has to be set to relative in both app.css AND through the bootstrap class. Otherwise, the eye icon is set relative to the main. This is irrational/buggy and I am worried that I added so much custom stuff that bootstrap gets wired bugs. Initially, it was working fine, I think this happened after I removed password generator script to a separate file.
- In SessionConfig (app.js) secure: true, the session does not work in development or when deployed

### Todo's

- To use file-type, ESM package to validate file type based on magc numbers
- To extend the array with passwords that are not safe to use. There are 100,000 passwords at https://www.ncsc.gov.uk/static-assets/documents/PwnedPasswordsTop100k.json. When filtered for words with a length greater than or equal to 8, the number decreases by half. However, even after minification, the file is 500kB. Using the jsonminify npm package, removed the quotes around words and the outer []. The size dropped to 100kB but I am still unsure if it would be a good idea to run a search against an array 40k long.
- I might add FE validation to check common passwords, but I would need to make another API and I already done it a few times.
- Paginaiton is implemented using skip/limit, it would be good to implement pagination using pagination tokens (cursor-based pagination). Also, it would be useful perhaps to add infinite scroll to reviews.
- It would be nice to add filter functinality so that a user could type in a location and the nearby camps would be shown. Currently camps are visible on the map. Sadly, using mongo near operator requires geospatial index and it is not compatible with other indexes, like search index https://www.mongodb.com/docs/manual/reference/operator/query/near/.
- To show the most recent reviews I reverse the reviews array. I found it is rather cumbersome to sort documents that are populated, however, it is apparentely done with $lookup, I might address it at a later stage https://www.mongodb.com/community/forums/t/sorting-a-populated-field/10083/4
  https://github.com/Automattic/mongoose/issues/2202

### Notes about the code

- chart.js:
  For the white portion of the chart, I could have added a background, but that requires calculating the size of the bars so that the background is exactly the width of the bar. (Also, I am not sure if I would be able to add a border on the background.) Instead, I simply added another dataset with values 100% and set grouped: false. This also allowed me to add links to both the orange and white bars.
  To make the chart horizontal we need to add options.indexAxis: "y". Then I added chartjs-plugin-datalabels and the labels adjusted automatically (show old y values, x values after making the chart horizontal). However, after I made the dataset.data an object I had to use options.parsing:pathToValues. I had to give the path to y for x values, because the chart is horizontal. Also, the datalabels started to display number of stars ("1 star" etc). To fix datalabels I had to add: options.plugings.datalabels.formatter. I had to use formatter anyway to add the % unit.
  To make the borderRadius for all 4 corners of the bar the border must be applied to all 4 sides of the bar thus borderSkipped: false,
  To change the chart's font size I set Chart.defaults.font.size = 14. It worked, but when resizing the datalabels would get stuck with the old font size so I overwritten it in options.plugins.datalabels.font.size. This made the font size persistent.
  To make the bars a little thicker I used options.aspectRatio.
  To make the datalabels at the top of the white bars I had to added padding: options.layout.padding (so the label is not clipped) and then make the offset a function of chartArea width context.chart.chartArea.width (in plugings.dataLabels we can modify the property of the plugin)

- Created function so that JOI validation is not repeated for every schema validateJoiSchema(someSchema). Initially, I did it to refactor the code. However, with time I realized that I needed to use User schema with validateAsync (need to check whether a username is already taken). Additionally, I needed to validate the Campground schema inside Multer fileFilter in routes/campground. Therefore, I only ended up using validateJoiSchema(someSchema) for a review schema. Maybe will get rid of it.
- Inside JOI validation object, it appears that the order matters in which the functions are called. When I had .custom and .not before escapeHTML(), I got an error testing a simple string with no special characters saying: "The input cannot contain HTML". When I put escapeHTML first and then the .custom and .not, it started working as expected. I did not test it further.
- Inside the app.js in the section when I exclude the paths that ought to be stored in session, it appears that the path to API (res.json) needs to be last. [/login, /register etc etc /APIpath]
-
