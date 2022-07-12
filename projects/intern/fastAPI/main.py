'''
# FastAPI localhost

"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --start-maxsized --new-window --no-first-run --window-size=600,800 --app=http://127.0.0.1:8000/

'''

#main.py

import os
from typing import List, Optional
from fastapi import FastAPI, Request, File, Form, UploadFile
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
# from fastapi.templating import Jinja2Templates

from starlette.routing import Mount
# from starlette.requests import Request
from starlette.templating import Jinja2Templates



from pydantic import BaseModel
from enum import Enum

# from flaskwebgui import FlaskUI


favicon_path = "./static/images/favicon.ico"

routes = [
    Mount('/static', app=StaticFiles(directory='./static'), name='static'),
    Mount('/css', app=StaticFiles(directory='./static/css'), name='css'),
    Mount('/images', app=StaticFiles(directory='./static/images'), name='images'),
    Mount('/js', app=StaticFiles(directory='./static/js'), name='static')
]

app = FastAPI(debug=True, routes=routes)







class Item(BaseModel):
    name: str
    price: float
    is_offer: Optional[bool] = None


class Animal(str, Enum):
    Dog = "dog"
    Cat = "cat"
    Mouse = "mouse"


fake_item_db = {
    "dog": {"price": 2.1, "num": 10},
    "cat": {"price": 5.3, "num": 8}
}




templates = Jinja2Templates(directory="templates")



@app.get('/favicon.ico')
async def favicon():
    """
    <link id="favicon" rel="icon" type="image/x-icon" href="images/favicon.ico">
    """
    return FileResponse(favicon_path)



@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request, "username": "Patrick"})



@app.post("/", response_class=HTMLResponse)
async def post_home(
    request: Request, 
    # files: List[UploadFile] = File(...),
    ref_measure_file: UploadFile = File(...), 
    # ref_measure_file: Optional[UploadFile] = File(...), 
    compare_measure_file: UploadFile = File(...), 
    ref_header_file: UploadFile = File(...), 
    compare_header_file: UploadFile = File(...)
    ):
    # print(request)
    print(ref_measure_file.filename)
    print(compare_measure_file.filename)
    print(ref_header_file.filename)
    print(compare_header_file.filename)
    return "hello"


# @app.post("/", response_class=HTMLResponse)
# async def post_home(
#     request: Request):
#     print(request)



# @app.get("/items/{item_id}")
# def read_item(item_id: int, q:Optional[str]=None):
#     return {"item_id": item_id, "q":q}


# @app.put("/items/{item_id}")
# def update_item(item_id: int, item: Item):
#     return {"item_name": item.name, "item_id": item_id}


# @app.get("/animal/{animal_name}")
# def get_animal(animal_name: Animal):
#     if (animal_name == Animal.Dog):
#         return {"Animal_name": "dog"}
#     elif (animal_name == Animal.Cat):
#         return {"Animal_name": "cat"}
#     else:
#         return {"Animal_name": "mouse"}






@app.get("/animal/{item_id}")
def read_item(item_id: str):
    return fake_item_db[item_id]






if __name__ == "__main__":

    # ui = FlaskUI(app, start_server='fastapi')
    # print(ui.browser_path)
    # ui.run()
    # pass
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8080)
