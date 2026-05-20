from enum import Enum

from fastapi import FastAPI


class UserName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"


app = FastAPI()


@app.get("/models/{model_name}")
async def get_model(model_name: UserName):
    if model_name is UserName.alexnet:
        return {"user_name": model_name, "message": "Deep Learning FTW!"}

    if model_name.value == "lenet":
        return {"user_name": model_name, "message": "LeCNN all the images"}

    return {"user_name": model_name, "message": "Have some residuals"}