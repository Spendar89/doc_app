# DocApp

SCI's web app for designing, managing, and electronically signing documents.

## Installation

### Via Docker

[Docker](https://www.docker.com/whatisdocker/) makes installing and maintaining DocApp a breeze, regardless of your operating system.  

*Before you begin, it is recommended that you familiarize yourself with Docker and its basic concepts.  Dockerb s website offers many great resources, including an interactive [tutorial](https://www.docker.com/tryit/).*

##### Step 1: Install Boot2Docker

The official Docker client for both Windows and Mac is Boot2Docker.  It creates Linux virtual machines for running Docker. The following links will walk you through downloading and installing Boot2Docker on your operating system:

[Boot2Docker Installation Guide-Windows](https://docs.docker.com/installation/windows/)

[Boot2Docker Installation Guide-Mac](https://docs.docker.com/installation/mac/)

##### Step 2: Login to Docker

*Note: This assumes you have started a Boot2Docker command-line session.*

Because youb ll be pulling a private Docker image, you need to login to or register for a Docker account:

`$ docker login -e [EMAIL] -p [PASSWORD] -u [USERNAME]`

##### Step 3: Run a Docker Container

Now that youb re logged in, youb re ready to create a container from the Doc App image:

`$ docker run -d -p 3002:3002 --name docapp spendar89/docapp`

This pulls an image from `spendar89/docapp` , uses it to build a container called `docapp`, and starts the application server on port 3002.

*Tip: to confirm that the server is running, you can view the status of your running containers with* `$ docker ps`

Now, in your web browser, visit  http://192.168.59.103:3002/

*Note: 192.168.59.103 is the default ip of Boot2Dockerb s VM*

## Configuration

DocApp generates forms using data pulled from a number of configurable sources.  Web ll go over each one.

### HelloSign Templates

HelloSign templates can be created by uploading a PDF form to [HelloSignb s web client](https://www.hellosign.com/home/createTemplate).  There are 4 types of fields that can be layered on top of a form: **text**, **checkbox**, **date**, and **signature**.  

Signature and date fields are straightforwardb  they are filled out by the recipient when he or she signs the document.  Text and checkbox fields are a bit more nuanced.  They have 3 variations, determined by the value of the *b Who fills this out?b * input on the fieldb s configuration menu:

TODO: screenshot of field configuration menu

1. **Me (now):** the field is given a static value that appears on all documents generated by the template.
2. **Client:** the field is treated like a signature or date field and filled out by the recipient when he or she signs the document.
3. **Me (when sending):** the field is assigned a label and filled out programatically via the HelloSign API.


DocApp uses only the 3rd type, referred to in HelloSignb s API as `customFields`, to build its templates.  The other two are ignored.  Therefore, in order for a field to be represented in a DocApp template, it must be configured like type 3.  

*Note: web ll discuss customField labelling conventions later in this guide*

### Package Data

Package data is represented in DocApp as a JSON file. It determines which HelloSign templates are accessible and how they should be configured.  

*Note: As of this version of DockApp, the selected package is fixed to "EA Package", but functionality will be added in the near-future to set the package dynamically.*

#### Template Data

A package has a `templates` property that contains the `title` and `id` of its HelloSign templates:

``` json
 "templates": [
 	{     
      "id": "15d7739c06cbc00db4faf52213563823faf21419",
      "title": "Primary Agreement"
    }, { 
      "id": "3ed91b9371cc41ef46e332da651b5609048c3a0a", 
      "title": "Tour Acknowledgement"
    }, { 
      "id": "a9bec35769d7b574c26eb21d2c296a8916b99f0c",  
      "title": "Clinical Laboratory Disclosure"
    }           
  ]
```

Once a user selects a template, an API request is made to fetch the templateb s `customFields` and the form is generated.

*Tip: When a user switches templates, the previous templateb s form-data rolls over.  This eliminates the need to fill out the same field multiple times!*

#### Configuration Data

Generally, templates are configured based on their package.  Therefore, a package's JSON file contains the following configuration data:

- **customOptions:** HelloSign doesnb t offer *select* as a field type, so as a workaround,  `customOptions` lets you configure which fields to render as `<select>` tags, along with the corresponding `<option>` values.  With the following example configuration, all fields named "*Program*" will render as `<select> ` tags:
  
  ``` json
  "customOptions": {
    "Program": [
      "Administrative Assistant - Morning",
      "Cosmetology Operator - Morning",
      "HVAC - Evening"
    ]
  }
  ```

- **customTypes:** Serves the same purpose as customOptions, only for the other HTML5 input-types:
  
  ``` json
  "customTypes": {
    "Date": "date",
    "Email": "email",
    "Phone": "tel",
    "Weeks": "number",
    "SSN": "password"
  }
  ```
- **disabledFields:** Lets you specify which fields to disable.  This is useful for fields that are filled out programmatically:
  
  ``` json
  "disabledFields": [
    "StartDate",
    "GradDate",
    "Morning",
    "Afternoon",
    "Evening",
    "Weeks",
    "ClockHours"
  ]
  ```
  
- **headers:** Maps a field to custom header text that will render immediately above the field:
  
  ``` json
  "headers": {
    "Program": "Program Information",
    "RegFee": "Fees",
    "Cash": "Method of Payment",
    "ReportYear": "Program Data"
  }
  ```
  
