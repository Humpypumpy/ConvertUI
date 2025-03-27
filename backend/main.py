from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from PIL import Image
import io

app = FastAPI()

@app.post("/convert")
async def convert_image(
    file: UploadFile = File(...),
    format: str = Form(...),
    scale: int = Form(...),
    quality: int = Form(...)
):
    # Load image
    image = Image.open(io.BytesIO(await file.read()))

    # Resize image
    width, height = image.size
    new_width = int(width * scale / 100)
    new_height = int(height * scale / 100)
    image = image.resize((new_width, new_height))

    # Convert and save to memory
    output = io.BytesIO()
    image.save(output, format=format.upper(), quality=quality)
    output.seek(0)

    # Send back as downloadable file
    return StreamingResponse(output, media_type=f"image/{format.lower()}", headers={
        "Content-Disposition": f"attachment; filename=converted.{format.lower()}"
    })
