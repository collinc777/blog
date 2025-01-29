# Prediction interface for Cog ⚙️
# https://cog.run/python

import logging

from cog import BasePredictor, Input, Path
from docling.datamodel.pipeline_options import EasyOcrOptions, PdfPipelineOptions
from docling.document_converter import (
    DocumentConverter,
    InputFormat,
    PdfFormatOption,
)
from docling_core.types.doc.base import ImageRefMode

logger = logging.getLogger(__name__)


class Predictor(BasePredictor):
    def setup(self) -> None:
        """Load the model into memory to make running multiple predictions efficient"""
        logging.basicConfig(level=logging.INFO)
        pipeline_options = PdfPipelineOptions(
            artifacts_path="/src/pdf_weights",
            generate_ocr_images=True,
            generate_picture_images=True,
            ocr_options=EasyOcrOptions(
                model_storage_directory="/src/easyocr_weights",
                download_enabled=False,
                lang=["en"],
            ),
        )
        self.converter = DocumentConverter(
            format_options={
                InputFormat.PDF: PdfFormatOption(
                    pipeline_options=pipeline_options,
                )
            }
        )

    def predict(
        self,
        file: Path = Input(description="File to process"),
        output_type: str = Input(description="Output type", default="json"),
    ) -> Path:
        """Run a single prediction on the model"""
        result = self.converter.convert(file)
        doc = result.document
        # ensure reload works
        if output_type == "json":
            file_path = Path("/tmp/document_output.json")
            doc.save_as_json(file_path)
        elif output_type == "html":
            file_path = Path(
                "/tmp/document_output.html",
            )
            doc.save_as_html(file_path, image_mode=ImageRefMode.EMBEDDED)
        return file_path
