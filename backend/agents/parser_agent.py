import pdfplumber
import pytesseract
from PIL import Image
import io

class ParserAgent:
    @staticmethod
    def parse(file_content: bytes) -> str:
        """
        Extracts text from PDF. Falls back to OCR if scanned.
        """
        text = ""
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
                else:
                    # Fallback to OCR for scanned pages
                    pil_image = page.to_image().original
                    text += pytesseract.image_to_string(pil_image) + "\n"
        
        # Clean formatting
        cleaned_text = " ".join(text.split())
        return cleaned_text
