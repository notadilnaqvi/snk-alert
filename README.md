# SNK Alert
Within the first week of (almost) every month, a new chapter of *Shingeki no Kyojin* is posted on [r/ShingekiNoKyojin](https://www.reddit.com/r/ShingekiNoKyojin)

This app sends me an email alert whenever that happens

## About SNK
*Shingeki no Kyojin* (also known as Attack on Titan) is an immensely popular Japanese manga series written and illustrated by Hajime Isayama. It has been adapted for an anime series of the same name who's 4th and final season will be released in Dec, 2020. Read the [official wiki](https://en.wikipedia.org/wiki/Attack_on_Titan) to know more

## How it works
* Get the latest post by [u/SNKBot](https://www.reddit.com/user/SNKBot) using the Reddit API

* Run 3 checks on the post:
  * Post's title matches the title of previous latest chapter posts
  * Post has the `Latest Chapter` flair
  * Post has not been detected by this program previously (to avoid spamming email recepients every 2 minutes)
  
* If all checks pass it sends the email and adds the post to a database

## How to use it
1. Run `git clone https://github.com/notadilnaqvi/snk-alert.git`

2. Then run `heroku create`. This will create a new app visible on your Heroku dashboard. Open the app and go to the Resources tab

3. From here, disable the default `web` dyno and add and enable a `worker` dyno

4. Now go to the Settings tab and add the following environment variables:
   * GMAIL_USER : *your Gmail ID*
   * GMAIL_PASSWORD : *your Gmail password*
   * GMAIL_RECEPIENT : *receient's Email ID*
   * GMAIL_CC : *Email ID to cc the Email to*
   * DB_USER : *MongoDB user ID*
   * DB_PASSWORD : *MongoDB password*
  
5. Run `git push heroku master`. Your app should now be up and running

6. Run `heroku logs --tail` to see the latest logs

## Why don't I, you know, just turn Reddit notifications on?
Because.
