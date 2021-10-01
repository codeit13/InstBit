from posting_content import postMedia
from hashtag_search import get_hashtags
import time, random
from datetime import datetime

def schedule_posts(bot, message):
    with open('quotes.txt','r') as quotefile:
            linelist = quotefile.read().split('\n')
            quote = random.sample(linelist, 1)[0]
        
    caption = quote + " \n"
    # caption += get_hashtags()

    fin = open("urls.txt", "r")
    lines = fin.readlines()
    if not lines:
        bot.reply_to(message, "Queue is empty!")
    else :
        bot.reply_to(message, "Queue is added to Schedule!")
    for line in lines:
        url = line.strip("\n")
        
        postMedia("IMAGE", url, caption)
        bot.send_message( 678316420, url + " posted at "+ datetime.now().strftime("%d %b  %I:%M %p"), disable_web_page_preview=True)
        
        lines.remove(line)

        string = ''
        for ele in lines:
            string = string + str(ele)
        with open('urls.txt', "w") as fout:
            fout.write(string)
        time.sleep(7200)