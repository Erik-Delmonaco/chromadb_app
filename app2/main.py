from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_text_splitters import RecursiveCharacterTextSplitter

app = FastAPI()

class ChunkRequest(BaseModel):
    text: str
    chunk_size: int = 200
    chunk_overlap: int = 20

@app.post("/chunk")
def chunk_text(request: ChunkRequest):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size = request.chunk_size,
        chunk_overlap = request.chunk_overlap
    )
    result = splitter.split_text(request.text)
    chunk_list = []
    for chunk in result:
        dictionary = {
            "chunk": chunk,
            "len": len(chunk)
        }
        chunk_list.append(dictionary)
    return chunk_list



app.mount("/", StaticFiles(directory="static", html=True), name="static")