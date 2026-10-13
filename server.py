from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Bật CORS để cho phép frontend gọi API

# Dữ liệu mẫu lưu trên server
devices_db = []


@app.route("/health", methods=["GET"])
def health_check():
  return jsonify(
      {"status": "online", "message": "NEON CONTROL Server is running perfectly"}
  )


@app.route("/api/devices", methods=["GET"])
def get_devices():
  return jsonify(devices_db)


@app.route("/api/devices", methods=["POST"])
def add_device():
  data = request.get_json()
  if not data or "name" not in data or "ip" not in data:
    return jsonify({"error": "Thiếu thông tin tên hoặc địa chỉ IP"}), 400

  devices_db.insert(0, data)
  return jsonify({"success": True, "device": data}), 201


if __name__ == "__main__":
  print("Starting NEON CONTROL Backend on http://127.0.0.1:8080")
  app.run(host="0.0.0.0", port=8080, debug=True)
  