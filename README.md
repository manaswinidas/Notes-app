# Notes-app
A Web and Mobile Application to store and remove things from a To-Do List using Apache Cordova

## Configure
You need to have Apache Cordova configured to run this project. Run `npm install` to install the Cordova CLI in your system.
References: [https://cordova.apache.org/](https://cordova.apache.org/)

## Run
Once you have the CLI installed you are ready to launch the app.

**For Browser Platform**
Simply, run the command `cordova run browser` in your terminal. Then, open the browser and enter the url as shown in the terminal,i.e. `localhost:8000/index.html`
Now, you can use the Notes-app.

**For Android Platform** 
You need to first setup your environment for running an android application. For that you need to download:
1. [JDK 8](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html)
2. [Gradle](https://gradle.org/install/)
3. [Android SDK](https://developer.android.com/studio/index.html)

After installing all the listed applications, you need to [Set up your environment variable](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-environment-variables) accordingly.
Then, you are ready to run the Notes-app as an android application. To run an android app you either need to [Set up an emulator](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-up-an-emulator) or to run on your phone you need to [Set up a hardware device](https://developer.android.com/studio/run/device).

To run the app in android run the command `cordova run android` in your terminal.

**For other platforms like OSX,Electron or if you need any other help in setting cordova CLI or your environment for the application you can look at the [Cordova Documentation site](https://cordova.apache.org/docs/en/latest/)** 

## After Setup
So, by now you will have a running setup of the application either in your browser or in your mobile. You can also look into the code to understand the database setup of the application.
We are using [nanoSQL](https://nanosql.io/) for our database setup and configuring it in our project using the plugin `adapter-sqlite-cordova`. The reason for using this is that it provides database support for both browser and android application by switching to the respected mode of database depending upon the environment i.e, for browser it uses `Web SQL / Indexed SQl` and for android it uses `SQLite`. You can learn more about it through the links [SQLite(Cordova)](https://nanosql.io/adapters/sqlite-cordova.html) or [@nano-sql/adapter-sqlite-cordova](https://www.npmjs.com/package/@nano-sql/adapter-sqlite-cordova). If you have basic knowledge of SQL then, you can go through the [Documentation](https://nanosql.io/setup.html) to understand more regarding the usage of SQLite cordova query structures.

Here, we are creating the database and table dynamically if it doesn't exists in your memory by using the connect() method by specifying the database name and table name. We need to connect to the database and the table inside it to run any query on it, so we are saving the connection in a variable `db_connect` and then using it to run the other queries in the later part of our code. Few of the queries used in the code are `select, upsert(insert) and delete` for executing the tasks. You can learn about it by going through the documentation link mentioned above.
