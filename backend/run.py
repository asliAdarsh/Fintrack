from app import create_app
import os

app = create_app(os.environ.get("FLASK_ENV", "development"))

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
