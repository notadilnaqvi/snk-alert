import re
import praw


reddit = praw.Reddit(client_id="6aOk3LNSsYMprw", client_secret="xXGQnVHgTlR9rUXqnz87Hz72hqM", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44")

user = reddit.redditor('SNKbot')
submissions = user.submissions.new(limit=2)

for link in submissions:
    title = link.title
    flair = link.link_flair_text
    titleMatch = re.search("\[New Chapter Spoilers\] Chapter \d\d\d RELEASE Megathread!", link.title)
    
    if(titleMatch is not None and flair == "Latest Chapter"):
        name = link.name
        text = link.selftext
        url = link.url

        sendEmail()

print(title)
print(flair)
# print(text)
