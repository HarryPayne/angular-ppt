# angular-ppt
This is my project for learning AngularJS. It is a work in progress and incomplete.

This project is the angular frontend of a project portfolio management tool. A backend in Flask and SQLAlchemy can be found in my [flask-ppt2](https://github.com/HarryPayne/flask-ppt2) project. Together they are a port of an old Zope 2 website.

The frontend is a single page application in AngularJS. It is a completely JSON-driven application, with forms built using [angular-formly](https://github.com/formly-js/angular-formly) with forms generated from the database. We use angular modules for JSON web tokens [angular-jwt](https://github.com/auth0/angular-jwt) for authentication and authorization, for MomentJS [angular-moment](https://github.com/urish/angular-moment) for dates and times, and for jQuery DataTables [angular-datatables](http://l-lin.github.io/angular-datatables/) for reports. Each view is bookmarkable and browser history works.

The original was written when the CIO said she wanted to plan six months of projects at a time. I was interested in project portfolio management. I wrote this tool to support the planning process by managing the information CIO needed, and recording the decisions made in each cycle. There was a process for developing the information about a project from the idea stage to the stage where it could be scheduled and run. It also tracked portfolio information for comparing projects with each other. Finally, it had rudimentary tracking for projects during execution phase. Implementing all of that functionality is planned, but not all is implemented yet.

The tool is basically a project metadata manager and a report generator with role based access to add and entry functionality. Functionality consists mainly of selecting or searching for projects, viewing search results in tabular form, viewing/updating individual projects, and stepping through the projects in a set of search results. 