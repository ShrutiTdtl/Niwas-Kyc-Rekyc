import os
import uvicorn

if __name__ == "__main__":
    uvicorn.run("aiml_layer.api.main:app", host=os.getenv("AIML_SERVICE_HOST", "127.0.0.1"), port=int(os.getenv("AIML_SERVICE_PORT", "8010")), reload=True)
