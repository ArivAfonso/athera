import time
from newspaper import Article
import google.generativeai as genai
from typing import Union

from fastapi import FastAPI

app = FastAPI()

@app.get("/get/")
def main(url: Union[str, None] = None):
    genai.configure(api_key="AIzaSyCdYfPDryx9a2wnY-0HbFmoWva5AegwSzI")
    model = genai.GenerativeModel('gemini-pro')
    print(url)

    return {"url":url}

    # article = Article(url.strip())
    # article.download()
    # article.parse()
    # chat = model.start_chat()
    # final, final_title = ""
    # response = chat.send_message("REWRITE THE FOLLOWING ARTICLE TO AROUND 1000 WORDS:- "+article.text, stream=True)
    # for chunk in response:
    #     final += chunk
    # title_response = chat.send_message("TITLE:- "+article.title, stream=True)
    # for chunk in title_response:
    #     final_title += chunk
    # return {"text":final, "url":url, "title":final_title, "tags":article.keywords, "summary":article.summary}
