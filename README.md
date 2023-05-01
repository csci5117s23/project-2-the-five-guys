# Module 2 Group Assignment

CSCI 5117, Spring 2022, [assignment description](https://canvas.umn.edu/courses/355584/pages/project-2)

## App Info:

* Team Name: The Five Guys
* App Name: ParkTrack
* App Link: https://snazzy-kelpie-9a8b46.netlify.app/

### Students

* John Cullom, cullo006@umn.edu
* Mikkel Folting, folti002@umn.edu
* Nathaniel Ludwig, ludwi298@umn.edu
* Sahil Raina, raina024@umn.edu
* Ray Robards, robar031@umn.edu


## Key Features

**Describe the most challenging features you implemented
(one sentence per bullet, maximum 4 bullets):**

* Map integration, adding custom icons and geolocation button
* Codehooks custom routes, codehooks issues overall
* Integration with national parks api to gather much of site data

Which (if any) device integration(s) does your app support?

* Device Location
* Sharing

Which (if any) progressive web app feature(s) does your app support?

* Sharing



## Mockup images

**[Add images/photos that show your mockup](https://stackoverflow.com/questions/10189356/how-to-add-screenshot-to-readmes-in-github-repository) along with a very brief caption:**

![](/static/mockups1.png)
![](/static/mockups2.png)

Our homepage will show the user all national parks either in a list view or a map view. The user can toggle between these easily at the top of the page. Upon clicking on any of the parks, it will bring you to the park's page, which will show a zoomed in map of the area and information regarding the area. Clicking on the My Trips button at the bottom of the screen brings you to a page displaying past and future trips to different national parks. Of course, this requires a login capability, which we will add. Each past and future trip can be viewed, showing pictures and notes from that trip. The log and plan trip pages allow the user to log past trips and plan future trips using information grabbed from the National Parks API.  
[Link to our mockups](https://www.figma.com/file/GcmZ7V0VvUvikXThWJEn7W/National-Park-Trip-Tracker?node-id=0-1&t=3dZuOOdRLoZJWC6p-0)

## Testing Notes

**Is there anything special we need to know in order to effectively test your app? (optional):**

* Share feature requires a compatible browser [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API#browser_compatibility)



## Screenshots of Site (complete)

**[Add a screenshot of each key page](https://stackoverflow.com/questions/10189356/how-to-add-screenshot-to-readmes-in-github-repository)
along with a very brief caption:**
![](/static/listView.png)
![](/static/mapView.png)
![](/static/tripPage.png)
![](/static/editTrip.png)


## External Dependencies

**Document integrations with 3rd Party code or services here.
Please do not document required libraries (e.g., Vue, Vuefire, Firebase).**

* [Material UI](https://mui.com/): Styling, components
* [React leaflet](https://react-leaflet.js.org/): Interactive Map
* [Materual UI Carosel](https://www.npmjs.com/package/react-material-ui-carousel): Image carosel
* [Leaftlet Custom Control](https://www.npmjs.com/package/react-leaflet-custom-control): Custom location button
* [Geolocation Api](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API): Access to device location
* [Web Share Api](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API): Share Access

**If there's anything else you would like to disclose about how your project
relied on external code, expertise, or anything else, please disclose that
here:**
 Some small portions were taken from stack overflow and we credit the posts in the code
