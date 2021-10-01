from defines_py3 import getCreds
from hashtag_search import get_hashtags
from scheduled_post import schedule_posts
from posting_content import createMediaObject, getMediaObjectStatus, publishMedia, getContentPublishingLimit, postMedia
import urllib.request, telebot, json, time, os, random

from telebot import types

bot = telebot.TeleBot("1855581269:AAHDIY6jLf3YCc3XwCKRY8f8ayaXy_rXkQA", parse_mode=None) # You can set parse_mode by default. HTML or MARKDOWN

markup = types.ReplyKeyboardMarkup(row_width=2)
itembtn1 = types.KeyboardButton('/start')
itembtn2 = types.KeyboardButton('/limit')
itembtn3 = types.KeyboardButton('/queue')
itembtn4 = types.KeyboardButton('/schedule')
markup.add(itembtn1, itembtn2, itembtn3, itembtn4)

@bot.message_handler(commands=['start'])
def send_welcome(message):
	bot.reply_to(message, "Howdy, how are you doing?", reply_markup=markup)

@bot.message_handler(commands=['post'])
def send_url(message):
    with open('quotes.txt','r') as quotefile:
        linelist = quotefile.read().split('\n')
        quote = random.sample(linelist, 1)[0]

    url = message.text.split("/post ")[1]
    caption = quote + " \n"
    caption += get_hashtags()
    
    res = postMedia("IMAGE", url, caption)
    bot.reply_to(message, res)
    
@bot.message_handler(content_types=['document', 'photo'])
def echo_all(message):
    image_list = message.json['photo']
    req_1 = urllib.request.urlopen("https://api.telegram.org/bot1855581269:AAHDIY6jLf3YCc3XwCKRY8f8ayaXy_rXkQA/getFile?file_id=" + image_list[len(image_list) -1]['file_id'])
    encoding = req_1.info().get_content_charset('utf-8')
    res_1 = json.loads(req_1.read().decode(encoding))
    url = "https://api.telegram.org/file/bot1855581269:AAHDIY6jLf3YCc3XwCKRY8f8ayaXy_rXkQA/" + res_1['result']['file_path']

    url = os.popen("curl -F'url=" + url + "' https://0x0.st").read()

    file = open("urls.txt", "a")  # append mode
    file.write(url)
    file.close()

    bot.reply_to(message, "Pushed to Queue")

@bot.message_handler(commands=['limit'])
def send_limit(message):
    limit = getContentPublishingLimit(getCreds())

    alloted_quota = limit['json_data']['data'][0]['config']['quota_total']
    used_quota = limit['json_data']['data'][0]['quota_usage']

    bot.reply_to(message, alloted_quota-used_quota)

@bot.message_handler(commands=['queue'])
def send_limit(message):
    fin = open("urls.txt", "r")
    lines = fin.readlines()

    string = ''
    count = 0
    for ele in lines:
        count += 1
        string = string + str(count) + ". " + str(ele)
    if string == '' :
        bot.reply_to(message, 'No Jobs in Queue')
    else :
        bot.reply_to(message, string, disable_web_page_preview=True)
    
@bot.message_handler(commands=['schedule'])
def send_limit(message):
    print(message.chat.id)
    if str(message.chat.id) == "678316420" :
        schedule_posts(bot, message)
    else :
        bot.reply_to(message, "You don't have an authority to run this command\nPlease contact Sumit for further inquiries")

bot.polling()