import easyocr
from docling.pipeline.standard_pdf_pipeline import StandardPdfPipeline

# need to preload the weights so we don't run them on startup time

easyocr.Reader(
    ["en"], gpu=True, download_enabled=True, model_storage_directory="./easyocr_weights"
)
artifacts_path = StandardPdfPipeline.download_models_hf(
    force=True, local_dir="./pdf_weights"
)
# TODO: I can't get below to work the way I want it to. No way to select a cache dir.
# downloaded_models = load_pretrained_nlp_models(force=True, verbose=True)
# print(f"Downloaded models: {downloaded_models}")
