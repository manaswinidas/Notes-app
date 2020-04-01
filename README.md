# Notes-app
A Web and Mobile Application to store and remove things from a To-Do List using Apache Cordova

## Configure
You need to have Apache Cordova configured to run this project. Run `npm install` to install the Cordova CLI in your system.
References: [https://cordova.apache.org/](https://cordova.apache.org/)

## Run
Once you have the CLI installed you are ready to launch the app.

**For Browser Platform**
Simply, run the command `cordova run browser` in your terminal. Then, open the browser and enter the url as shown in the terminal,i.e. `localhost:8080/index.html`
Now, you can use the Notes-app.

**For Android Platform** 
You need to first setup your enviornment for running an android application. For that you need to download:
1. [JDK 8](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html)
2. [Gradle](https://gradle.org/install/)
3. [Android SDK](https://developer.android.com/studio/index.html)

After installing all the listed applications, you need to [Set up your enviornment variable](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-environment-variables) accordingly.
Then, you are ready to run the Notes-app as an android application. To run an android app you either need to [Set up an emulator](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-up-an-emulator) or to run on your phone you need to [Set up a hardware device](https://developer.android.com/studio/run/device).

To run the app in android run the command `cordova run android` in your terminal.

**For other platforms like OSX,Electron or if you need any other help in setting cordova CLI or your enviornment for the application you can look at the [Cordova Documentation site](https://cordova.apache.org/docs/en/latest/)** 
